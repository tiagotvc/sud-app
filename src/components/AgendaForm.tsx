"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { format } from "date-fns";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { ChamadosEditor } from "@/components/ChamadosEditor";
import { RichTextEditor } from "@/components/RichTextEditor";
import { AgendaChamadoInput, AgendaInput } from "@/lib/types";

interface AgendaFormProps {
  initialData?: Partial<AgendaInput> & { id?: string };
  mode: "create" | "edit";
}

const emptyForm: AgendaInput = {
  data: format(new Date(), "yyyy-MM-dd"),
  frequencia: null,
  presididaPor: "",
  dirigidaPor: "",
  reconhecimentoAutoridades: "",
  reconhecimentoVisitantes: "",
  anuncios: "",
  regente: "",
  organista: "",
  hinoAbertura: "",
  primeiraOracao: "",
  hinoSacramental: "",
  primeiroOrador: "",
  segundoOrador: "",
  hinoEspecial: "",
  ultimoOrador: "",
  hinoEncerramento: "",
  oracaoEncerramento: "",
  chamados: [],
};

export function AgendaForm({ initialData, mode }: AgendaFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<AgendaInput>({
    ...emptyForm,
    ...initialData,
    chamados: initialData?.chamados ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof AgendaInput>(field: K, value: AgendaInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url =
        mode === "create" ? "/api/agendas" : `/api/agendas/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Erro ao salvar agenda");
      }

      router.push("/");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Erro ao salvar agenda",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b border-slate-200 pb-3">
          <h2 className="text-lg font-semibold text-slate-900">Ata de Reunião Sacramental</h2>
          <p className="text-sm text-slate-500">Ala Novo Hamburgo</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Data</label>
            <input
              type="date"
              required
              value={form.data}
              onChange={(event) => updateField("data", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Frequência</label>
            <input
              type="number"
              min={0}
              value={form.frequencia ?? ""}
              onChange={(event) =>
                updateField(
                  "frequencia",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
          Abertura
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <AutocompleteInput
            label="Presidida por"
            value={form.presididaPor ?? ""}
            onChange={(value) => updateField("presididaPor", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Dirigida por"
            value={form.dirigidaPor ?? ""}
            onChange={(value) => updateField("dirigidaPor", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Reconhecimento de autoridades"
            value={form.reconhecimentoAutoridades ?? ""}
            onChange={(value) => updateField("reconhecimentoAutoridades", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Reconhecimento de visitantes ou novos membros"
            value={form.reconhecimentoVisitantes ?? ""}
            onChange={(value) => updateField("reconhecimentoVisitantes", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Regente"
            value={form.regente ?? ""}
            onChange={(value) => updateField("regente", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Organista"
            value={form.organista ?? ""}
            onChange={(value) => updateField("organista", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Hino de abertura"
            value={form.hinoAbertura ?? ""}
            onChange={(value) => updateField("hinoAbertura", value)}
            apiPath="/api/hinos"
            hint='Formato: número  nome (ex: 2  O Senhor é meu pastor)'
          />
          <AutocompleteInput
            label="1ª Oração"
            value={form.primeiraOracao ?? ""}
            onChange={(value) => updateField("primeiraOracao", value)}
            apiPath="/api/pessoas"
          />
        </div>

        <div className="mt-4">
          <RichTextEditor
            label="Anúncios"
            value={form.anuncios ?? ""}
            onChange={(value) => updateField("anuncios", value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <ChamadosEditor
          value={form.chamados ?? []}
          onChange={(value) => updateField("chamados", value)}
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
          Sacramento
        </h3>
        <AutocompleteInput
          label="Hino sacramental"
          value={form.hinoSacramental ?? ""}
          onChange={(value) => updateField("hinoSacramental", value)}
          apiPath="/api/hinos"
          hint='Formato: número  nome'
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
          Discursos 1ª parte
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <AutocompleteInput
            label="1º Orador(a)"
            value={form.primeiroOrador ?? ""}
            onChange={(value) => updateField("primeiroOrador", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="2º Orador(a)"
            value={form.segundoOrador ?? ""}
            onChange={(value) => updateField("segundoOrador", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Hino especial (intervalo)"
            value={form.hinoEspecial ?? ""}
            onChange={(value) => updateField("hinoEspecial", value)}
            apiPath="/api/hinos"
            hint='Formato: número  nome'
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
          Último orador e encerramento
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <AutocompleteInput
            label="Último orador(a)"
            value={form.ultimoOrador ?? ""}
            onChange={(value) => updateField("ultimoOrador", value)}
            apiPath="/api/pessoas"
          />
          <AutocompleteInput
            label="Hino de encerramento"
            value={form.hinoEncerramento ?? ""}
            onChange={(value) => updateField("hinoEncerramento", value)}
            apiPath="/api/hinos"
            hint='Formato: número  nome'
          />
          <AutocompleteInput
            label="Oração de encerramento"
            value={form.oracaoEncerramento ?? ""}
            onChange={(value) => updateField("oracaoEncerramento", value)}
            apiPath="/api/pessoas"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {saving ? "Salvando..." : mode === "create" ? "Criar agenda" : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
