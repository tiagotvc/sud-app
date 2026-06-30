"use client";

import { AutocompleteInput } from "@/components/AutocompleteInput";
import { AgendaChamadoInput } from "@/lib/types";

interface ChamadosEditorProps {
  value: AgendaChamadoInput[];
  onChange: (value: AgendaChamadoInput[]) => void;
}

export function ChamadosEditor({ value, onChange }: ChamadosEditorProps) {
  function updateItem(index: number, field: keyof AgendaChamadoInput, fieldValue: string) {
    const next = [...value];
    next[index] = { ...next[index], [field]: fieldValue };
    onChange(next);
  }

  function addItem() {
    onChange([...value, { pessoa: "", chamado: "" }]);
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={addItem}
          className="crm-btn-accent rounded px-3.5 py-1.5 text-xs font-semibold"
        >
          + Adicionar chamado
        </button>
      </div>

      {value.length === 0 && (
        <p className="rounded-lg border border-dashed border-brand-border bg-brand-cream-warm px-4 py-6 text-center text-sm text-brand-text-muted">
          Nenhum chamado registrado. Clique em &quot;Adicionar chamado&quot; para incluir.
        </p>
      )}

      {value.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-lg border border-brand-border bg-brand-cream-warm p-4 md:grid-cols-[1fr_1fr_auto]"
        >
          <AutocompleteInput
            label="Pessoa"
            value={item.pessoa}
            onChange={(nextValue) => updateItem(index, "pessoa", nextValue)}
            apiPath="/api/pessoas"
            placeholder="Nome da pessoa"
            variant="person"
          />
          <AutocompleteInput
            label="Chamado"
            value={item.chamado}
            onChange={(nextValue) => updateItem(index, "chamado", nextValue)}
            apiPath="/api/chamados"
            placeholder="Ex: Professor da Primária"
          />
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
  );
}
