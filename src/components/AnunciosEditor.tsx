"use client";

import { AgendaAnuncioInput, LOCAIS_ANUNCIO } from "@/lib/types";

interface AnunciosEditorProps {
  value: AgendaAnuncioInput[];
  onChange: (value: AgendaAnuncioInput[]) => void;
}

export function AnunciosEditor({ value, onChange }: AnunciosEditorProps) {
  function updateItem<K extends keyof AgendaAnuncioInput>(
    index: number,
    field: K,
    fieldValue: AgendaAnuncioInput[K],
  ) {
    const next = [...value];
    next[index] = { ...next[index], [field]: fieldValue };
    onChange(next);
  }

  function addItem() {
    onChange([...value, { data: "", hora: "", texto: "", local: "" }]);
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div>
      <label className="field-label">Anúncios</label>
      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={addItem}
            className="crm-btn-accent rounded px-3.5 py-1.5 text-xs font-semibold"
          >
            + Adicionar anúncio
          </button>
        </div>

        {value.length === 0 && (
          <p className="rounded-lg border border-dashed border-brand-border bg-brand-cream-warm px-4 py-6 text-center text-sm text-brand-text-muted">
            Nenhum anúncio registrado. Clique em &quot;Adicionar anúncio&quot; para incluir.
          </p>
        )}

        {value.map((item, index) => (
          <div key={index} className="agenda-anuncio-editor-row">
            <div>
              <label className="field-label">Data</label>
              <input
                type="date"
                value={item.data}
                onChange={(event) => updateItem(index, "data", event.target.value)}
                className="field-input w-full"
              />
            </div>
            <div>
              <label className="field-label">Hora</label>
              <input
                type="time"
                value={item.hora}
                onChange={(event) => updateItem(index, "hora", event.target.value)}
                className="field-input w-full"
              />
            </div>
            <div>
              <label className="field-label">Texto</label>
              <input
                type="text"
                value={item.texto}
                onChange={(event) => updateItem(index, "texto", event.target.value)}
                placeholder="Ex: Arrecadação de alimentos para doação"
                className="field-input w-full"
              />
            </div>
            <div>
              <label className="field-label">Local</label>
              <input
                type="text"
                list="locais-anuncio"
                value={item.local}
                onChange={(event) => updateItem(index, "local", event.target.value)}
                placeholder="Opcional"
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
      <datalist id="locais-anuncio">
        {LOCAIS_ANUNCIO.map((local) => (
          <option key={local} value={local} />
        ))}
      </datalist>
    </div>
  );
}
