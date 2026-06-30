"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SEMANAS_AGENDA, type ModoEntrevista, type SlotEntrevista } from "@/lib/entrevistas-constants";
import { EntrevistaWeekCalendar } from "@/components/entrevistas/EntrevistaWeekCalendar";

interface Entrevistador {
  id: string;
  nome: string;
  role: string;
}

function entrevistadorChipLabel(p: Entrevistador) {
  if (p.role === "BISPADO") return "Bispo";
  return p.nome;
}

function BookingForm({
  nome,
  setNome,
  telefone,
  setTelefone,
  email,
  setEmail,
  observacoes,
  setObservacoes,
  modoEntrevista,
  setModoEntrevista,
  error,
  submitting,
  selectedSlotLabel,
  onSubmit,
}: {
  nome: string;
  setNome: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  observacoes: string;
  setObservacoes: (v: string) => void;
  modoEntrevista: ModoEntrevista;
  setModoEntrevista: (v: ModoEntrevista) => void;
  error: string | null;
  submitting: boolean;
  selectedSlotLabel?: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="public-card">
      <div className="public-card-head">
        <h3 className="public-card-title">Seus dados</h3>
        {selectedSlotLabel ? (
          <p className="mt-1 text-xs text-brand-text-muted">
            Horário: <span className="font-semibold text-brand-navy-dark">{selectedSlotLabel}</span>
          </p>
        ) : (
          <p className="mt-1 text-xs text-brand-text-muted">
            Selecione um horário ao lado para continuar.
          </p>
        )}
      </div>
      <div className="public-card-body space-y-5">
        <div className="form-field-group">
          <label className="field-label" htmlFor="nome">
            Nome completo *
          </label>
          <input
            id="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="field-input"
            placeholder="Seu nome completo"
            disabled={!selectedSlotLabel}
          />
        </div>
        <div className="admin-form-grid">
          <div className="form-field-group">
            <label className="field-label" htmlFor="telefone">
              Telefone / WhatsApp
            </label>
            <input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="field-input"
              placeholder="(51) 99999-9999"
              disabled={!selectedSlotLabel}
            />
          </div>
          <div className="form-field-group">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="seu@email.com"
              disabled={!selectedSlotLabel}
            />
          </div>
        </div>
        <div className="form-field-group">
          <span className="field-label">Como será a entrevista? *</span>
          <div className="modo-picker" role="group" aria-label="Modo da entrevista">
            <button
              type="button"
              disabled={!selectedSlotLabel}
              onClick={() => setModoEntrevista("PRESENCIAL")}
              className={`modo-picker-chip ${
                modoEntrevista === "PRESENCIAL" ? "modo-picker-chip-active modo-picker-chip-presencial" : ""
              }`}
            >
              Presencial
            </button>
            <button
              type="button"
              disabled={!selectedSlotLabel}
              onClick={() => setModoEntrevista("ONLINE")}
              className={`modo-picker-chip ${
                modoEntrevista === "ONLINE" ? "modo-picker-chip-active modo-picker-chip-online" : ""
              }`}
            >
              Online
            </button>
          </div>
        </div>
        <div className="form-field-group">
          <label className="field-label" htmlFor="obs">
            Observações
          </label>
          <textarea
            id="obs"
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="field-input"
            placeholder="Assunto da entrevista, se desejar"
            disabled={!selectedSlotLabel}
          />
          <p className="field-hint">Opcional — ajuda a liderança a se preparar.</p>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !nome.trim() || !selectedSlotLabel}
          className="btn-primary w-full sm:w-auto sm:px-8"
        >
          {submitting ? "Confirmando..." : "Confirmar entrevista"}
        </button>
      </div>
    </form>
  );
}

export function EntrevistaBooking() {
  const [entrevistadores, setEntrevistadores] = useState<Entrevistador[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [semana, setSemana] = useState(0);
  const [slots, setSlots] = useState<SlotEntrevista[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [modoEntrevista, setModoEntrevista] = useState<ModoEntrevista>("PRESENCIAL");
  const [semanaInicio, setSemanaInicio] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/entrevistas/entrevistadores")
      .then((r) => r.json())
      .then((data: Entrevistador[]) => {
        setEntrevistadores(data);
        if (data.length === 1) setSelectedId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadSlots = useCallback(async (id: string, sem: number) => {
    setLoadingSlots(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/entrevistas/slots?entrevistadorId=${id}&semana=${sem}`,
      );
      const data = await res.json();
      setSlots(data.slots ?? []);
      setSemanaInicio(data.semanaInicio ?? "");
    } catch {
      setError("Não foi possível carregar os horários.");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      setSelectedSlot(null);
      void loadSlots(selectedId, semana);
    }
  }, [selectedId, semana, loadSlots]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !selectedSlot || !nome.trim()) return;

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/entrevistas/reservar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entrevistadorId: selectedId,
        inicio: selectedSlot,
        nomeMembro: nome,
        telefoneMembro: telefone || undefined,
        emailMembro: email || undefined,
        observacoes: observacoes || undefined,
        modoEntrevista,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao reservar.");
      if (selectedId) void loadSlots(selectedId, semana);
      return;
    }

    const slotLabel = slots.find((s) => s.inicio === selectedSlot)?.label;
    setSuccess(
      `Entrevista confirmada para ${slotLabel ?? format(new Date(selectedSlot), "dd/MM/yyyy HH:mm", { locale: ptBR })}.`,
    );
    setSelectedSlot(null);
    setNome("");
    setTelefone("");
    setEmail("");
    setObservacoes("");
    setModoEntrevista("PRESENCIAL");
    if (selectedId) void loadSlots(selectedId, semana);
  }

  if (loading) {
    return (
      <div className="public-card px-6 py-10 text-center">
        <p className="text-sm text-brand-text-muted">Carregando agenda...</p>
      </div>
    );
  }

  if (entrevistadores.length === 0) {
    return (
      <div className="public-card px-6 py-10 text-center">
        <p className="font-display text-lg font-semibold text-brand-navy-dark">
          Nenhum horário disponível no momento
        </p>
        <p className="mt-2 text-sm text-brand-text-muted">
          A liderança ainda não configurou a agenda de entrevistas. Tente novamente em breve.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="public-card px-6 py-12 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/15 text-2xl text-brand-gold-dark">
          ✓
        </span>
        <p className="font-display mt-4 text-lg font-semibold text-brand-navy-dark">
          Entrevista agendada
        </p>
        <p className="mt-2 text-sm text-brand-text-muted">{success}</p>
        <button type="button" onClick={() => setSuccess(null)} className="btn-primary mt-6">
          Agendar outra entrevista
        </button>
      </div>
    );
  }

  const slotsDisponiveis = slots.filter((s) => s.disponivel);
  const selectedSlotLabel = slots.find((s) => s.inicio === selectedSlot)?.label;

  const formProps = {
    nome,
    setNome,
    telefone,
    setTelefone,
    email,
    setEmail,
    observacoes,
    setObservacoes,
    modoEntrevista,
    setModoEntrevista,
    error,
    submitting,
    selectedSlotLabel,
    onSubmit: handleSubmit,
  };

  return (
    <div className="booking-layout">
      <div className="booking-main space-y-4">
        <div className="booking-person-row">
          <span className="booking-person-label">Com quem:</span>
          <div className="booking-person-chips">
            {entrevistadores.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`booking-person-chip ${
                  selectedId === p.id ? "booking-person-chip-selected" : ""
                }`}
              >
                {entrevistadorChipLabel(p)}
              </button>
            ))}
          </div>
        </div>

        {selectedId && (
          <section className="public-card">
            <div className="public-card-head public-card-head-compact">
              <h2 className="public-card-title">Horários disponíveis</h2>
            </div>
            <div className="public-card-body">
              {loadingSlots ? (
                <p className="text-sm text-brand-text-muted">Carregando horários...</p>
              ) : (
                <>
                  <EntrevistaWeekCalendar
                    semanaInicio={semanaInicio}
                    slots={slots}
                    mode="public"
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    semana={semana}
                    totalSemanas={SEMANAS_AGENDA}
                    onSemanaChange={(delta) => setSemana((s) => s + delta)}
                  />
                  {!loadingSlots && slots.length > 0 && slotsDisponiveis.length === 0 && (
                    <p className="mt-4 text-center text-sm text-brand-text-muted">
                      Todos os horários desta semana já foram reservados.
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {selectedSlot && (
          <div className="xl:hidden">
            <BookingForm {...formProps} />
          </div>
        )}
      </div>

      <aside className="booking-aside hidden xl:block">
        {selectedSlot ? (
          <BookingForm {...formProps} />
        ) : (
          <div className="booking-aside-placeholder">
            <span className="text-2xl text-brand-gold">◷</span>
            <p className="font-display mt-3 text-sm font-semibold text-brand-navy-dark">
              Escolha um horário
            </p>
            <p className="mt-1 text-xs text-brand-text-muted">
              Clique em um horário disponível no calendário para preencher seus dados.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
