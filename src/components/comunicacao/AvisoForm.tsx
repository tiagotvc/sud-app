"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/RichTextEditor";

export type AvisoFormData = {
  id?: string;
  titulo: string;
  conteudo: string;
  tipo: "AVISO" | "NOVIDADE" | "JORNAL" | "EVENTO";
  publicado: boolean;
  destaque: boolean;
  linkExterno: string;
};

interface AvisoFormProps {
  initialData?: Partial<AvisoFormData>;
  mode: "create" | "edit";
}

const TIPOS = [
  { value: "AVISO", label: "Aviso" },
  { value: "NOVIDADE", label: "Novidade" },
  { value: "JORNAL", label: "Jornal / Boletim" },
  { value: "EVENTO", label: "Evento" },
] as const;

export function AvisoForm({ initialData, mode }: AvisoFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<AvisoFormData>({
    titulo: initialData?.titulo ?? "",
    conteudo: initialData?.conteudo ?? "",
    tipo: initialData?.tipo ?? "AVISO",
    publicado: initialData?.publicado ?? false,
    destaque: initialData?.destaque ?? false,
    linkExterno: initialData?.linkExterno ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = mode === "create" ? "/api/avisos" : `/api/avisos/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          linkExterno: form.linkExterno || null,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Erro ao salvar aviso");
      }

      router.push("/bispado/comunicacao/avisos");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro ao salvar aviso");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="agenda-paper space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="field-label" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            required
            value={form.titulo}
            onChange={(e) => setForm((c) => ({ ...c, titulo: e.target.value }))}
            className="field-input w-full"
            placeholder="Ex: Festa Junina da ala"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="tipo">
            Tipo
          </label>
          <select
            id="tipo"
            value={form.tipo}
            onChange={(e) =>
              setForm((c) => ({ ...c, tipo: e.target.value as AvisoFormData["tipo"] }))
            }
            className="field-input w-full"
          >
            {TIPOS.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="linkExterno">
            Link externo (opcional)
          </label>
          <input
            id="linkExterno"
            type="url"
            value={form.linkExterno}
            onChange={(e) => setForm((c) => ({ ...c, linkExterno: e.target.value }))}
            className="field-input w-full"
            placeholder="https://... (PDF do jornal, etc.)"
          />
        </div>
      </div>

      <RichTextEditor
        label="Conteúdo"
        value={form.conteudo}
        onChange={(value) => setForm((c) => ({ ...c, conteudo: value }))}
      />

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-brand-text">
          <input
            type="checkbox"
            checked={form.publicado}
            onChange={(e) => setForm((c) => ({ ...c, publicado: e.target.checked }))}
            className="rounded border-brand-border"
          />
          Publicado (visível na área pública)
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-text">
          <input
            type="checkbox"
            checked={form.destaque}
            onChange={(e) => setForm((c) => ({ ...c, destaque: e.target.checked }))}
            className="rounded border-brand-border"
          />
          Destaque no calendário
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="crm-toolbar">
        <button type="submit" disabled={saving} className="crm-btn-primary">
          {saving ? "Salvando..." : mode === "create" ? "Publicar aviso" : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/bispado/comunicacao/avisos")}
          className="crm-btn"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
