import { ReactNode } from "react";

type Accent = "navy" | "gold" | "cream";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  accent?: Accent;
  children: ReactNode;
}

export function FormSection({
  title,
  subtitle,
  children,
}: FormSectionProps) {
  return (
    <section className="form-section">
      <div className="form-section-header">
        <div className="form-section-tab" />
        <div className="form-section-heading">
          <p className="text-eyebrow">Seção</p>
          <h3 className="form-section-title">{title}</h3>
          {subtitle && <p className="form-section-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="form-section-body">{children}</div>
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
    <header className="agenda-header">
      <div className="agenda-header-banner">
        <p className="agenda-header-church">
          A Igreja de Jesus Cristo dos Santos dos Últimos Dias
        </p>
        <h2 className="agenda-header-title">Agenda Sacramental</h2>
        <p className="agenda-header-ward">Ala Novo Hamburgo</p>
      </div>

      {editable && onDataChange && onFrequenciaChange && (
        <div className="grid gap-4 border-t border-brand-border bg-brand-surface p-5 md:grid-cols-2">
          <div>
            <label className="field-label">Data</label>
            <input
              type="date"
              required
              value={data ?? ""}
              onChange={(event) => onDataChange(event.target.value)}
              className="field-input w-full"
            />
          </div>
          <div>
            <label className="field-label">Frequência</label>
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
