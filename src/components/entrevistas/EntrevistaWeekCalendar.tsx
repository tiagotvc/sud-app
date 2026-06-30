"use client";

import { type ReactNode } from "react";
import { addDays, format, isSameDay, isSameMonth, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ModoEntrevista, SlotEntrevista } from "@/lib/entrevistas-constants";

function modoLabel(modo: ModoEntrevista) {
  return modo === "ONLINE" ? "Online" : "Presencial";
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatWeekMeta(semanaInicio: string) {
  const inicio = startOfDay(new Date(semanaInicio));
  const fim = addDays(inicio, 6);
  const tituloMes = capitalize(format(inicio, "MMMM yyyy", { locale: ptBR }));
  const intervalo = isSameMonth(inicio, fim)
    ? `${format(inicio, "d")} – ${format(fim, "d 'de' MMMM", { locale: ptBR })}`
    : `${format(inicio, "d MMM", { locale: ptBR })} – ${format(fim, "d MMM yyyy", { locale: ptBR })}`;

  return { tituloMes, intervalo };
}

function groupSlotsByDay(semanaInicio: string, slots: SlotEntrevista[]) {
  const base = startOfDay(new Date(semanaInicio));
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(base, index);
    const daySlots = slots.filter((slot) =>
      isSameDay(new Date(slot.inicio), date),
    );
    daySlots.sort((a, b) => a.inicio.localeCompare(b.inicio));
    return { date, slots: daySlots };
  });
}

interface EntrevistaWeekCalendarProps {
  semanaInicio: string;
  slots: SlotEntrevista[];
  mode: "public" | "admin";
  selectedSlot?: string | null;
  onSelectSlot?: (inicio: string) => void;
  onCancelReserva?: (id: string) => void;
  semana?: number;
  totalSemanas?: number;
  onSemanaChange?: (delta: number) => void;
}

export function EntrevistaWeekCalendar({
  semanaInicio,
  slots,
  mode,
  selectedSlot,
  onSelectSlot,
  onCancelReserva,
  semana,
  totalSemanas,
  onSemanaChange,
}: EntrevistaWeekCalendarProps) {
  const days = groupSlotsByDay(semanaInicio, slots);
  const hoje = new Date();
  const { tituloMes, intervalo } = semanaInicio
    ? formatWeekMeta(semanaInicio)
    : { tituloMes: "", intervalo: "" };

  const disponiveis = slots.filter((s) => s.disponivel).length;
  const agendados = slots.filter((s) => s.reserva).length;
  const diasComHorario = days.filter((d) =>
    mode === "public"
      ? d.slots.some((s) => s.disponivel)
      : d.slots.length > 0,
  ).length;

  if (slots.length === 0) {
    return (
      <div className="entrevista-cal">
        {semanaInicio && (
          <CalendarToolbar
            tituloMes={tituloMes}
            intervalo={intervalo}
            semana={semana}
            totalSemanas={totalSemanas}
            onSemanaChange={onSemanaChange}
          />
        )}
        <p className="rounded-xl border border-dashed border-brand-border px-4 py-10 text-center text-sm text-brand-text-muted">
          Nenhum horário nesta semana.
        </p>
      </div>
    );
  }

  return (
    <div className="entrevista-cal">
      {semanaInicio && (
        <CalendarToolbar
          tituloMes={tituloMes}
          intervalo={intervalo}
          semana={semana}
          totalSemanas={totalSemanas}
          onSemanaChange={onSemanaChange}
          stats={
            mode === "public" ? (
              <>
                <span className="entrevista-cal-stat entrevista-cal-stat-available">
                  {disponiveis} livre{disponiveis !== 1 ? "s" : ""}
                </span>
                <span className="entrevista-cal-stat entrevista-cal-stat-days">
                  {diasComHorario} dia{diasComHorario !== 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <>
                <span className="entrevista-cal-stat entrevista-cal-stat-booked">
                  {agendados} agendada{agendados !== 1 ? "s" : ""}
                </span>
                <span className="entrevista-cal-stat entrevista-cal-stat-available">
                  {disponiveis} livre{disponiveis !== 1 ? "s" : ""}
                </span>
              </>
            )
          }
        />
      )}

      <div className="entrevista-cal-grid">
        {days.map(({ date, slots: daySlots }) => {
          const ehHoje = isSameDay(date, hoje);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const hasAvailable = daySlots.some((s) => s.disponivel);
          const allTaken =
            daySlots.length > 0 && daySlots.every((s) => !s.disponivel);
          const isEmpty = daySlots.length === 0;

          return (
            <div
              key={date.toISOString()}
              className={[
                "entrevista-cal-day",
                ehHoje && "entrevista-cal-day-today",
                isWeekend && "entrevista-cal-day-weekend",
                hasAvailable && "entrevista-cal-day-available",
                allTaken && "entrevista-cal-day-full",
                isEmpty && "entrevista-cal-day-empty-col",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <header className="entrevista-cal-day-head">
                <span className="entrevista-cal-day-month">
                  {format(date, "MMM", { locale: ptBR })}
                </span>
                <span className="entrevista-cal-day-weekday">
                  {format(date, "EEE", { locale: ptBR })}
                </span>
                <span className="entrevista-cal-day-num">{format(date, "d")}</span>
              </header>
              <div className="entrevista-cal-day-body">
                {isEmpty ? (
                  <div className="entrevista-cal-day-empty">
                    <span className="entrevista-cal-day-empty-badge">
                      {mode === "public"
                        ? "Sem horários disponíveis"
                        : "Sem horários neste dia"}
                    </span>
                  </div>
                ) : (
                  <>
                    {allTaken && mode === "public" && (
                      <span className="entrevista-cal-day-full-badge">Esgotado</span>
                    )}
                    {daySlots.map((slot) => {
                      const hora = format(new Date(slot.inicio), "HH:mm");
                      const isSelected = selectedSlot === slot.inicio;

                      if (slot.disponivel && mode === "public") {
                        return (
                          <button
                            key={slot.inicio}
                            type="button"
                            onClick={() => onSelectSlot?.(slot.inicio)}
                            className={`entrevista-cal-slot entrevista-cal-slot-free ${
                              isSelected ? "entrevista-cal-slot-selected" : ""
                            }`}
                          >
                            {hora}
                          </button>
                        );
                      }

                      if (!slot.disponivel && mode === "public") {
                        return (
                          <span
                            key={slot.inicio}
                            className="entrevista-cal-slot entrevista-cal-slot-taken"
                            title="Horário ocupado"
                          >
                            {hora}
                          </span>
                        );
                      }

                      if (slot.disponivel && mode === "admin") {
                        return (
                          <span
                            key={slot.inicio}
                            className="entrevista-cal-slot entrevista-cal-slot-open"
                            title="Horário livre"
                          >
                            {hora}
                          </span>
                        );
                      }

                      const reserva = slot.reserva;
                      if (!reserva) {
                        return (
                          <span
                            key={slot.inicio}
                            className="entrevista-cal-slot entrevista-cal-slot-taken"
                          >
                            {hora}
                          </span>
                        );
                      }

                      const isOnline = reserva.modoEntrevista === "ONLINE";

                      return (
                        <div
                          key={slot.inicio}
                          className={`entrevista-cal-slot entrevista-cal-slot-booked group ${
                            isOnline ? "entrevista-cal-slot-booked-online" : ""
                          }`}
                        >
                          <span className="entrevista-cal-slot-time">{hora}</span>
                          <span className="entrevista-cal-slot-mode">
                            {isOnline ? "On" : "Pres"}
                          </span>
                          <div className="entrevista-cal-tooltip" role="tooltip">
                            <p className="entrevista-cal-tooltip-name">{reserva.nomeMembro}</p>
                            <p
                              className={`entrevista-cal-tooltip-mode ${
                                isOnline ? "entrevista-cal-tooltip-mode-online" : ""
                              }`}
                            >
                              {modoLabel(reserva.modoEntrevista)}
                            </p>
                            {(reserva.telefoneMembro || reserva.emailMembro) && (
                              <p className="entrevista-cal-tooltip-contact">
                                {[reserva.telefoneMembro, reserva.emailMembro]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                            {reserva.observacoes && (
                              <p className="entrevista-cal-tooltip-notes">{reserva.observacoes}</p>
                            )}
                            {onCancelReserva && (
                              <button
                                type="button"
                                onClick={() => onCancelReserva(reserva.id)}
                                className="entrevista-cal-tooltip-cancel"
                              >
                                Cancelar entrevista
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="entrevista-cal-legend">
        {mode === "public" ? (
          <>
            <span className="entrevista-cal-legend-item">
              <span className="entrevista-cal-legend-dot entrevista-cal-legend-dot-free" />
              Disponível
            </span>
            <span className="entrevista-cal-legend-item">
              <span className="entrevista-cal-legend-dot entrevista-cal-legend-dot-selected" />
              Selecionado
            </span>
            <span className="entrevista-cal-legend-item">
              <span className="entrevista-cal-legend-dot entrevista-cal-legend-dot-taken" />
              Ocupado
            </span>
            <span className="entrevista-cal-legend-item">
              <span className="entrevista-cal-legend-dot entrevista-cal-legend-dot-empty" />
              Sem horários
            </span>
          </>
        ) : (
          <>
            <span className="entrevista-cal-legend-item">
              <span className="entrevista-cal-legend-dot entrevista-cal-legend-dot-open" />
              Livre
            </span>
            <span className="entrevista-cal-legend-item">
              <span className="entrevista-cal-legend-dot entrevista-cal-legend-dot-booked" />
              Presencial
            </span>
            <span className="entrevista-cal-legend-item">
              <span className="entrevista-cal-legend-dot entrevista-cal-legend-dot-online" />
              Online
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function CalendarToolbar({
  tituloMes,
  intervalo,
  semana,
  totalSemanas,
  onSemanaChange,
  stats,
}: {
  tituloMes: string;
  intervalo: string;
  semana?: number;
  totalSemanas?: number;
  onSemanaChange?: (delta: number) => void;
  stats?: ReactNode;
}) {
  const showNav =
    semana !== undefined &&
    totalSemanas !== undefined &&
    onSemanaChange !== undefined;

  return (
    <div className="entrevista-cal-toolbar">
      <div className="entrevista-cal-toolbar-main">
        <p className="entrevista-cal-month">{tituloMes}</p>
        <p className="entrevista-cal-range capitalize">{intervalo}</p>
        {stats && <div className="entrevista-cal-stats">{stats}</div>}
      </div>
      {showNav && (
        <div className="entrevista-cal-nav">
          <button
            type="button"
            disabled={semana === 0}
            onClick={() => onSemanaChange(-1)}
            className="entrevista-cal-nav-btn"
          >
            ← Anterior
          </button>
          <span className="entrevista-cal-nav-label">
            Semana {semana + 1} / {totalSemanas}
          </span>
          <button
            type="button"
            disabled={semana >= totalSemanas - 1}
            onClick={() => onSemanaChange(1)}
            className="entrevista-cal-nav-btn"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
