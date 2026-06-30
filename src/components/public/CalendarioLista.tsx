import {
  addDays,
  format,
  isSameDay,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarioDiaPublico } from "@/components/public/types";

interface CalendarioListaProps {
  dias: CalendarioDiaPublico[];
  semanaInicio: Date;
  variant?: "full" | "compact";
}

export function CalendarioLista({
  dias,
  semanaInicio,
  variant = "full",
}: CalendarioListaProps) {
  const hoje = new Date();

  const diasComData = dias.map((dia, index) => ({
    ...dia,
    data: addDays(semanaInicio, index),
  }));

  if (variant === "compact") {
    return (
      <ul className="calendario-compact-list">
        {diasComData.map((dia) => {
          const ehHoje = isSameDay(dia.data, hoje);
          const resumo =
            dia.eventos.length > 0
              ? dia.eventos[0]
              : "Sem atividades";

          return (
            <li
              key={dia.id}
              className={`calendario-compact-item ${ehHoje ? "calendario-compact-item-today" : ""}`}
            >
              <div className="calendario-compact-date">
                <span className="calendario-compact-day">{format(dia.data, "d")}</span>
                <span className="calendario-compact-weekday">{dia.label.slice(0, 3)}</span>
              </div>
              <p className="calendario-compact-event">{resumo}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="space-y-3">
      {diasComData.map((dia) => {
        const ehHoje = isSameDay(dia.data, hoje);

        return (
          <article
            key={dia.id}
            className={`ala-day-row ${ehHoje ? "ala-day-row-today" : ""}`}
          >
            <div className="ala-day-sidebar">
              <span className="text-lg" aria-hidden>
                {dia.icon !== "·" ? dia.icon : "◦"}
              </span>
              <span className="ala-day-sidebar-label mt-1">{dia.label}</span>
              <span className="ala-day-sidebar-value mt-0.5 text-base">
                {format(dia.data, "d")}
              </span>
            </div>
            <div className="ala-day-content">
              {ehHoje && <span className="ala-badge mb-2">Hoje</span>}
              {dia.eventos.length > 0 ? (
                <ul className="space-y-1.5">
                  {dia.eventos.map((evento) => (
                    <li
                      key={evento}
                      className="flex items-start gap-2 text-sm text-brand-text"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {evento}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-brand-text-muted">
                  Nenhuma atividade registrada.
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function formatSemanaLabel(inicio: Date, fim: Date) {
  return `${format(inicio, "d 'de' MMMM", { locale: ptBR })} a ${format(fim, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
}

export function getSemanaRange(date = new Date()) {
  const inicio = startOfWeek(date, { weekStartsOn: 0 });
  const fim = addDays(inicio, 6);
  return { inicio, fim };
}
