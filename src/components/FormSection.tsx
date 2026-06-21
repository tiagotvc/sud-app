import { ReactNode } from "react";

type Accent = "blue" | "indigo" | "amber" | "emerald" | "violet";

const accentStyles: Record<
  Accent,
  { border: string; badge: string; title: string }
> = {
  blue: {
    border: "border-l-[#1e4d8c]",
    badge: "bg-blue-50 text-blue-800",
    title: "text-blue-950",
  },
  indigo: {
    border: "border-l-indigo-500",
    badge: "bg-indigo-50 text-indigo-800",
    title: "text-indigo-950",
  },
  amber: {
    border: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-900",
    title: "text-amber-950",
  },
  emerald: {
    border: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-800",
    title: "text-emerald-950",
  },
  violet: {
    border: "border-l-violet-500",
    badge: "bg-violet-50 text-violet-800",
    title: "text-violet-950",
  },
};

interface FormSectionProps {
  title: string;
  subtitle?: string;
  accent?: Accent;
  children: ReactNode;
}

export function FormSection({
  title,
  subtitle,
  accent = "blue",
  children,
}: FormSectionProps) {
  const styles = accentStyles[accent];

  return (
    <section
      className={`overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100 ${styles.border} border-l-4`}
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${styles.badge}`}
          >
            Seção
          </span>
        </div>
        <h3 className={`mt-1 text-base font-semibold ${styles.title}`}>{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

interface AgendaHeaderProps {
  data?: string;
  frequencia?: number | null;
  onDataChange?: (value: string) => void;
  onFrequenciaChange?: (value: number | null) => void;
  editable?: boolean;
}

export function AgendaHeader({
  data,
  frequencia,
  onDataChange,
  onFrequenciaChange,
  editable = true,
}: AgendaHeaderProps) {
  return (
    <header className="overflow-hidden rounded-xl border border-blue-900/20 shadow-md">
      <div className="bg-gradient-to-br from-[#1e4d8c] via-[#2563a8] to-[#1e3a5f] px-6 py-8 text-white">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-100/90">
          A Igreja de Jesus Cristo dos Santos dos Últimos Dias
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight">
          Agenda Sacramental
        </h2>
        <p className="mt-1 text-center text-sm font-medium text-blue-100">
          Ala Novo Hamburgo
        </p>
      </div>

      {editable && onDataChange && onFrequenciaChange && (
        <div className="grid gap-4 border-t border-slate-200 bg-white p-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Data
            </label>
            <input
              type="date"
              required
              value={data ?? ""}
              onChange={(event) => onDataChange(event.target.value)}
              className="field-input w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Frequência
            </label>
            <input
              type="number"
              min={0}
              value={frequencia ?? ""}
              onChange={(event) =>
                onFrequenciaChange(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              className="field-input w-full"
              placeholder="Número de presentes"
            />
          </div>
        </div>
      )}
    </header>
  );
}
