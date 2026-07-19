"use client";

import { AgendaAutoridadeInput, CARGOS_AUTORIDADE } from "@/lib/types";

interface AutoridadesEditorProps {
  value: AgendaAutoridadeInput[];
  onChange: (value: AgendaAutoridadeInput[]) => void;
}

export function AutoridadesEditor({ value, onChange }: AutoridadesEditorProps) {
  function updateItem<K extends keyof AgendaAutoridadeInput>(
    index: number,
    field: K,
    fieldValue: AgendaAutoridadeInput[K],
  ) {
    const next = [...value];
    next[index] = { ...next[index], [field]: fieldValue };
    onChange(next);
  }

  function addItem() {
    onChange([...value, { cargo: "", nome: "" }]);
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div>
      <label className="field-label">Reconhecimento de autoridades</label>
      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={addItem}
            className="crm-btn-accent rounded px-3.5 py-1.5 text-xs font-semibold"
          >
            + Adicionar autoridade
          </button>
        </div>

        {value.length === 0 && (
          <p className="rounded-lg border border-dashed border-brand-border bg-brand-cream-warm px-4 py-6 text-center text-sm text-brand-text-muted">
            Nenhuma autoridade reconhecida. Clique em &quot;Adicionar autoridade&quot; para incluir.
          </p>
        )}

        {value.map((item, index) => (
          <div key={index} className="agenda-autoridade-editor-row">
            <div>
              <label className="field-label">Cargo</label>
              <select
                value={item.cargo}
                onChange={(event) => updateItem(index, "cargo", event.target.value)}
                className="field-input field-select w-full"
              >
                <option value="">—</option>
                {CARGOS_AUTORIDADE.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Nome</label>
              <input
                type="text"
                value={item.nome}
                onChange={(event) => updateItem(index, "nome", event.target.value)}
                placeholder="Nome completo"
                className="field-input w-full"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
