"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { format } from "date-fns";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { ChamadosEditor } from "@/components/ChamadosEditor";
import { AgendaHeader, FormSection } from "@/components/FormSection";
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
    <form onSubmit={handleSubmit} className="agenda-paper">
      <AgendaHeader
        data={form.data}
        frequencia={form.frequencia}
        onDataChange={(value) => updateField("data", value)}
        onFrequenciaChange={(value) => updateField("frequencia", value)}
      />

      <FormSection title="Abertura" subtitle="Presidência, música e reconhecimentos" accent="blue">
        <div className="grid gap-4 md:grid-cols-2">
          <AutocompleteInput
            label="Presidida por"
            value={form.presididaPor ?? ""}
            onChange={(value) => updateField("presididaPor", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="Dirigida por"
            value={form.dirigidaPor ?? ""}
            onChange={(value) => updateField("dirigidaPor", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="Reconhecimento de autoridades"
            value={form.reconhecimentoAutoridades ?? ""}
            onChange={(value) => updateField("reconhecimentoAutoridades", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="Reconhecimento de visitantes ou novos membros"
            value={form.reconhecimentoVisitantes ?? ""}
            onChange={(value) => updateField("reconhecimentoVisitantes", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="Regente"
            value={form.regente ?? ""}
            onChange={(value) => updateField("regente", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="Organista"
            value={form.organista ?? ""}
            onChange={(value) => updateField("organista", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="Hino de abertura"
            value={form.hinoAbertura ?? ""}
            onChange={(value) => updateField("hinoAbertura", value)}
            apiPath="/api/hinos"
            variant="hymn"
            hint="Formato: número  nome (ex: 2  O Senhor é meu pastor)"
          />
          <AutocompleteInput
            label="1ª Oração"
            value={form.primeiraOracao ?? ""}
            onChange={(value) => updateField("primeiraOracao", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
        </div>

        <div className="mt-5">
          <RichTextEditor
            label="Anúncios"
            value={form.anuncios ?? ""}
            onChange={(value) => updateField("anuncios", value)}
          />
        </div>
      </FormSection>

      <FormSection
        title="Chamados, apoios, desobrigações, votos de plena aceitação"
        accent="violet"
      >
        <ChamadosEditor
          value={form.chamados ?? []}
          onChange={(value) => updateField("chamados", value)}
        />
      </FormSection>

      <FormSection title="Sacramento" accent="indigo">
        <AutocompleteInput
          label="Hino sacramental"
          value={form.hinoSacramental ?? ""}
          onChange={(value) => updateField("hinoSacramental", value)}
          apiPath="/api/hinos"
          variant="hymn"
          hint="Formato: número  nome"
        />
      </FormSection>

      <FormSection title="Discursos — 1ª parte" accent="emerald">
        <div className="grid gap-4 md:grid-cols-2">
          <AutocompleteInput
            label="1º Orador(a)"
            value={form.primeiroOrador ?? ""}
            onChange={(value) => updateField("primeiroOrador", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="2º Orador(a)"
            value={form.segundoOrador ?? ""}
            onChange={(value) => updateField("segundoOrador", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <div className="md:col-span-2">
            <AutocompleteInput
              label="Hino especial (intervalo)"
              value={form.hinoEspecial ?? ""}
              onChange={(value) => updateField("hinoEspecial", value)}
              apiPath="/api/hinos"
              variant="hymn"
              hint="Formato: número  nome"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Último orador e encerramento" accent="blue">
        <div className="grid gap-4 md:grid-cols-2">
          <AutocompleteInput
            label="Último orador(a)"
            value={form.ultimoOrador ?? ""}
            onChange={(value) => updateField("ultimoOrador", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
          <AutocompleteInput
            label="Hino de encerramento"
            value={form.hinoEncerramento ?? ""}
            onChange={(value) => updateField("hinoEncerramento", value)}
            apiPath="/api/hinos"
            variant="hymn"
            hint="Formato: número  nome"
          />
          <AutocompleteInput
            label="Oração de encerramento"
            value={form.oracaoEncerramento ?? ""}
            onChange={(value) => updateField("oracaoEncerramento", value)}
            apiPath="/api/pessoas"
            variant="person"
          />
        </div>
      </FormSection>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : mode === "create" ? "Criar agenda" : "Salvar alterações"}
        </button>
        <button type="button" onClick={() => router.push("/")} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
