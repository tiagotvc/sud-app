"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DIAS_ENTREVISTA } from "@/lib/entrevistas-constants";

interface Disponibilidade {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  duracaoMin: number;
  ativo: boolean;
}

function contarSlots(horaInicio: string, horaFim: string, duracaoMin: number) {
  const [hi, mi] = horaInicio.split(":").map(Number);
  const [hf, mf] = horaFim.split(":").map(Number);
  const inicio = hi * 60 + mi;
  const fim = hf * 60 + mf;
  if (fim <= inicio || duracaoMin <= 0) return 0;
  return Math.floor((fim - inicio) / duracaoMin);
}

export function DisponibilidadeEditor() {
  const [items, setItems] = useState<Disponibilidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    diaSemana: 3,
    horaInicio: "19:00",
    horaFim: "21:00",
    duracaoMin: 30,
  });

  const previewSlots = useMemo(
    () => contarSlots(form.horaInicio, form.horaFim, form.duracaoMin),
    [form.horaInicio, form.horaFim, form.duracaoMin],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/entrevistas/disponibilidade");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/entrevistas/disponibilidade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao salvar.");
      return;
    }

    setItems((prev) => [...prev, data].sort((a, b) => a.diaSemana - b.diaSemana));
  }

  async function toggleAtivo(id: string, ativo: boolean) {
    const res = await fetch(`/api/entrevistas/disponibilidade/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este horário da sua agenda?")) return;
    const res = await fetch(`/api/entrevistas/disponibilidade/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const diaLabel = DIAS_ENTREVISTA.find((d) => d.index === form.diaSemana)?.label;

  return (
    <div className="admin-content-grid admin-content-grid-split">
      <div className="admin-form-card">
        <div className="admin-form-card-head">
          <h2 className="admin-form-card-title">Novo bloco de horários</h2>
          <p className="admin-form-card-subtitle">
            Defina um dia fixo da semana. Os membros verão vagas automáticas nas próximas 4
            semanas.
          </p>
        </div>

        <form onSubmit={handleAdd} className="admin-form-card-body">
          <div className="admin-form-grid">
            <div className="form-field-group sm:col-span-2">
              <label className="field-label" htmlFor="dia-semana">
                Dia da semana
              </label>
              <select
                id="dia-semana"
                value={form.diaSemana}
                onChange={(e) => setForm({ ...form, diaSemana: Number(e.target.value) })}
                className="field-input field-select"
              >
                {DIAS_ENTREVISTA.map((d) => (
                  <option key={d.index} value={d.index}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field-group sm:col-span-2">
              <label className="field-label">Intervalo</label>
              <div className="time-range-group">
                <input
                  type="time"
                  required
                  aria-label="Horário inicial"
                  value={form.horaInicio}
                  onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                  className="field-input field-time"
                />
                <span className="time-range-separator">até</span>
                <input
                  type="time"
                  required
                  aria-label="Horário final"
                  value={form.horaFim}
                  onChange={(e) => setForm({ ...form, horaFim: e.target.value })}
                  className="field-input field-time"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label" htmlFor="duracao">
                Duração
              </label>
              <select
                id="duracao"
                value={form.duracaoMin}
                onChange={(e) => setForm({ ...form, duracaoMin: Number(e.target.value) })}
                className="field-input field-select"
              >
                <option value={15}>15 minutos</option>
                <option value={20}>20 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos</option>
              </select>
            </div>

            <div className="form-field-group sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={saving || previewSlots === 0}
                className="crm-btn-primary h-[2.75rem] w-full justify-center rounded-xl text-sm font-semibold sm:w-auto sm:min-w-[10rem]"
              >
                {saving ? "Salvando..." : "Adicionar bloco"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-brand-border bg-brand-cream-warm/60 px-4 py-3">
            <span className="schedule-slot-badge">Prévia</span>
            <p className="text-sm text-brand-text">
              {previewSlots > 0 ? (
                <>
                  <strong className="text-brand-navy-dark">{previewSlots}</strong> vaga
                  {previewSlots !== 1 ? "s" : ""} por {diaLabel?.toLowerCase()} (
                  {form.horaInicio}–{form.horaFim})
                </>
              ) : (
                <span className="text-brand-text-muted">
                  Ajuste o intervalo — o horário final deve ser depois do inicial.
                </span>
              )}
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
      </div>

      <div className="admin-form-card xl:sticky xl:top-24">
        <div className="admin-form-card-head flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="admin-form-card-title">Agenda semanal</h2>
            <p className="admin-form-card-subtitle">
              {items.filter((i) => i.ativo).length} bloco(s) ativo(s)
            </p>
          </div>
        </div>

        {loading ? (
          <p className="admin-form-card-body text-sm text-brand-text-muted">Carregando...</p>
        ) : items.length === 0 ? (
          <div className="admin-form-card-body py-12 text-center">
            <p className="font-display text-base font-semibold text-brand-navy-dark">
              Nenhum horário configurado
            </p>
            <p className="mt-2 text-sm text-brand-text-muted">
              Adicione um bloco acima para liberar agendamentos no site público.
            </p>
          </div>
        ) : (
          <ul className="schedule-slot-list max-h-[32rem] overflow-y-auto xl:max-h-[calc(100vh-12rem)]">
            {items
              .slice()
              .sort((a, b) => a.diaSemana - b.diaSemana)
              .map((item) => {
                const label = DIAS_ENTREVISTA.find((d) => d.index === item.diaSemana)?.label;
                const slots = contarSlots(item.horaInicio, item.horaFim, item.duracaoMin);

                return (
                  <li
                    key={item.id}
                    className={`schedule-slot-item ${!item.ativo ? "schedule-slot-item-paused" : ""}`}
                  >
                    <div>
                      <span
                        className={`schedule-slot-day ${!item.ativo ? "schedule-slot-day-paused" : ""}`}
                      >
                        {label}
                      </span>
                      <div className="schedule-slot-meta">
                        <span>
                          <span className="schedule-slot-time">
                            {item.horaInicio} – {item.horaFim}
                          </span>
                        </span>
                        <span>·</span>
                        <span>{item.duracaoMin} min cada</span>
                        <span>·</span>
                        <span className="schedule-slot-badge">{slots} vagas/semana</span>
                        {!item.ativo && (
                          <>
                            <span>·</span>
                            <span className="text-brand-text-light">Pausado</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="schedule-slot-actions">
                      <button
                        type="button"
                        onClick={() => toggleAtivo(item.id, !item.ativo)}
                        className="btn-icon-ghost"
                      >
                        {item.ativo ? "Pausar" : "Ativar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="btn-icon-danger"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
