"use client";

import { FormEvent, useEffect, useState } from "react";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { RichTextEditor } from "@/components/RichTextEditor";
import { DIAS_SEMANA } from "@/lib/comunicacao";

type EventoCalendario = {
  id: string;
  diaSemana: number;
  titulo: string;
  horario: string | null;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
};

type ConteudoSemanal = {
  mensagemBispo: string | null;
  hinoSemana: string | null;
  versiculoTexto: string | null;
  versiculoRef: string | null;
  linkJornal: string | null;
  tituloJornal: string | null;
};

const emptyConteudo: ConteudoSemanal = {
  mensagemBispo: "",
  hinoSemana: "",
  versiculoTexto: "",
  versiculoRef: "",
  linkJornal: "",
  tituloJornal: "",
};

export function SemanaEditor() {
  const [conteudo, setConteudo] = useState<ConteudoSemanal>(emptyConteudo);
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [novoEvento, setNovoEvento] = useState({
    diaSemana: 0,
    titulo: "",
    horario: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [conteudoRes, eventosRes] = await Promise.all([
          fetch("/api/conteudo-semanal"),
          fetch("/api/eventos-calendario"),
        ]);

        if (conteudoRes.ok) {
          const data = (await conteudoRes.json()) as ConteudoSemanal | null;
          if (data) {
            setConteudo({
              mensagemBispo: data.mensagemBispo ?? "",
              hinoSemana: data.hinoSemana ?? "",
              versiculoTexto: data.versiculoTexto ?? "",
              versiculoRef: data.versiculoRef ?? "",
              linkJornal: data.linkJornal ?? "",
              tituloJornal: data.tituloJornal ?? "",
            });
          }
        }

        if (eventosRes.ok) {
          setEventos((await eventosRes.json()) as EventoCalendario[]);
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function handleSaveConteudo(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/conteudo-semanal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conteudo),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar conteúdo semanal");
      }

      setSuccess(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddEvento() {
    if (!novoEvento.titulo.trim()) return;

    const response = await fetch("/api/eventos-calendario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diaSemana: novoEvento.diaSemana,
        titulo: novoEvento.titulo,
        horario: novoEvento.horario || null,
      }),
    });

    if (response.ok) {
      const created = (await response.json()) as EventoCalendario;
      setEventos((current) => [...current, created]);
      setNovoEvento({ diaSemana: 0, titulo: "", horario: "" });
    }
  }

  async function handleDeleteEvento(id: string) {
    await fetch(`/api/eventos-calendario/${id}`, { method: "DELETE" });
    setEventos((current) => current.filter((e) => e.id !== id));
  }

  if (loading) {
    return <p className="text-brand-text-muted">Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveConteudo} className="agenda-paper space-y-5">
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-navy-dark">
            Destaques da semana
          </h2>
          <p className="mt-1 text-sm text-brand-text-muted">
            Aparecem no topo do calendário público — mensagem do bispo, hino, versículo e jornal.
          </p>
        </div>

        <RichTextEditor
          label="Mensagem do bispo / liderança"
          value={conteudo.mensagemBispo ?? ""}
          onChange={(value) => setConteudo((c) => ({ ...c, mensagemBispo: value }))}
        />

        <AutocompleteInput
          label="Hino da semana"
          value={conteudo.hinoSemana ?? ""}
          onChange={(value) => setConteudo((c) => ({ ...c, hinoSemana: value }))}
          apiPath="/api/hinos"
          variant="hymn"
          hint="Sugestão de hino para estudo ou referência da semana"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">Versículo (texto)</label>
            <textarea
              value={conteudo.versiculoTexto ?? ""}
              onChange={(e) => setConteudo((c) => ({ ...c, versiculoTexto: e.target.value }))}
              rows={3}
              className="field-input w-full resize-y"
              placeholder="Texto do versículo..."
            />
          </div>
          <div>
            <label className="field-label">Referência bíblica</label>
            <input
              value={conteudo.versiculoRef ?? ""}
              onChange={(e) => setConteudo((c) => ({ ...c, versiculoRef: e.target.value }))}
              className="field-input w-full"
              placeholder="Ex: João 3:16"
            />
          </div>
          <div>
            <label className="field-label">Título do jornal / boletim</label>
            <input
              value={conteudo.tituloJornal ?? ""}
              onChange={(e) => setConteudo((c) => ({ ...c, tituloJornal: e.target.value }))}
              className="field-input w-full"
              placeholder="Ex: Jornal da Ala — Junho 2026"
            />
          </div>
          <div>
            <label className="field-label">Link do jornal (PDF ou página)</label>
            <input
              type="url"
              value={conteudo.linkJornal ?? ""}
              onChange={(e) => setConteudo((c) => ({ ...c, linkJornal: e.target.value }))}
              className="field-input w-full"
              placeholder="https://..."
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Conteúdo semanal salvo com sucesso.
          </div>
        )}

        <div className="crm-toolbar">
          <button type="submit" disabled={saving} className="crm-btn-primary">
            {saving ? "Salvando..." : "Salvar destaques da semana"}
          </button>
        </div>
      </form>

      <section className="agenda-paper space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-navy-dark">
            Eventos do calendário semanal
          </h2>
          <p className="mt-1 text-sm text-brand-text-muted">
            Atividades fixas ou da semana que aparecem no calendário público.
          </p>
        </div>

        <div className="grid gap-3 rounded-lg border border-brand-border bg-brand-cream-warm p-4 md:grid-cols-[140px_1fr_120px_auto]">
          <select
            value={novoEvento.diaSemana}
            onChange={(e) =>
              setNovoEvento((c) => ({ ...c, diaSemana: Number(e.target.value) }))
            }
            className="field-input"
          >
            {DIAS_SEMANA.map((dia) => (
              <option key={dia.id} value={dia.index}>
                {dia.label}
              </option>
            ))}
          </select>
          <input
            value={novoEvento.titulo}
            onChange={(e) => setNovoEvento((c) => ({ ...c, titulo: e.target.value }))}
            className="field-input"
            placeholder="Nome da atividade"
          />
          <input
            value={novoEvento.horario}
            onChange={(e) => setNovoEvento((c) => ({ ...c, horario: e.target.value }))}
            className="field-input"
            placeholder="Horário"
          />
          <button type="button" onClick={handleAddEvento} className="crm-btn-accent">
            + Adicionar
          </button>
        </div>

        <ul className="divide-y divide-brand-border rounded-md border border-brand-border bg-white">
          {eventos.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-brand-text-muted">
              Nenhum evento cadastrado. Adicione as atividades da semana acima.
            </li>
          ) : (
            eventos.map((evento) => {
              const dia = DIAS_SEMANA.find((d) => d.index === evento.diaSemana);
              return (
                <li
                  key={evento.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <span className="ala-badge">{dia?.label ?? "DIA"}</span>
                    <p className="mt-1 font-medium text-brand-text">
                      {evento.titulo}
                      {evento.horario && (
                        <span className="text-brand-text-muted"> · {evento.horario}</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvento(evento.id)}
                    className="crm-btn text-red-700"
                  >
                    Remover
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
