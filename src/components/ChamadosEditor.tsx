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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Chamados, apoios, desobrigações, votos de plena aceitação
        </h3>
        <button
          type="button"
          onClick={addItem}
          className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          + Adicionar
        </button>
      </div>

      {value.length === 0 && (
        <p className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
          Nenhum chamado registrado. Clique em &quot;Adicionar&quot; para incluir.
        </p>
      )}

      {value.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_auto]"
        >
          <AutocompleteInput
            label="Pessoa"
            value={item.pessoa}
            onChange={(nextValue) => updateItem(index, "pessoa", nextValue)}
            apiPath="/api/pessoas"
            placeholder="Nome da pessoa"
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
              className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
