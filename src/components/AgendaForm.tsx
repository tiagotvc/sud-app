"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { ChamadosEditor } from "@/components/ChamadosEditor";
import { FormSection } from "@/components/FormSection";
import { RichTextEditor } from "@/components/RichTextEditor";
import { AgendaInput } from "@/lib/types";

interface AgendaFormProps {
  initialData?: Partial<AgendaInput> & { id?: string };
  mode: "create" | "edit";
}

type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

const emptyForm: AgendaInput = {
  data: format(new Date(), "yyyy-MM-dd"),
  tipo: "NORMA",
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

function countAnnouncements(html: string | undefined) {
  if (!html?.replace(/<[^>]*>/g, "").trim()) return 0;
  const listItems = html.match(/<li(?:\s[^>]*)?>/gi)?.length ?? 0;
  return listItems || 1;
}

function SaveIndicator({ state }: { state: SaveState }) {
  const labels: Record<SaveState, string> = {
    idle: "Autosave ativo",
    pending: "Alterações pendentes",
    saving: "Salvando…",
    saved: "Tudo salvo",
    error: "Falha ao salvar",
  };

  return (
    <span className={`agenda-save-status agenda-save-status-${state}`} aria-live="polite">
      <span aria-hidden="true" />
      {labels[state]}
    </span>
  );
}

export function AgendaForm({ initialData }: AgendaFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<AgendaInput>({
    ...emptyForm,
    ...initialData,
    tipo: initialData?.tipo ?? "NORMA",
    chamados: initialData?.chamados ?? [],
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [agendaId, setAgendaId] = useState(initialData?.id);
  const agendaIdRef = useRef(initialData?.id);
  const lastSavedRef = useRef(JSON.stringify(form));
  const latestQueuedRef = useRef(JSON.stringify(form));
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());

  const enqueueSave = useCallback((nextForm: AgendaInput, force = false) => {
    const snapshot = JSON.stringify(nextForm);
    const needsInitialCreate = force && !agendaIdRef.current;

    if (!nextForm.data && !force) return saveChainRef.current;

    latestQueuedRef.current = snapshot;
    if (snapshot === lastSavedRef.current && !needsInitialCreate) {
      return saveChainRef.current;
    }

    const payload = JSON.parse(snapshot) as AgendaInput;
    saveChainRef.current = saveChainRef.current
      .catch(() => undefined)
      .then(async () => {
        if (snapshot === lastSavedRef.current && agendaIdRef.current) return;

        setSaveState("saving");
        const currentId = agendaIdRef.current;
        const response = await fetch(currentId ? `/api/agendas/${currentId}` : "/api/agendas", {
          method: currentId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = (await response.json()) as { id?: string; error?: string };

        if (!response.ok) {
          throw new Error(result.error ?? "Não foi possível salvar a agenda.");
        }

        if (!currentId && result.id) {
          agendaIdRef.current = result.id;
          setAgendaId(result.id);
          window.history.replaceState(
            window.history.state,
            "",
            `/bispado/agendas-sacramentais/${result.id}`,
          );
        }

        lastSavedRef.current = snapshot;
        setError(null);
        if (latestQueuedRef.current === snapshot) setSaveState("saved");
      })
      .catch((saveError: unknown) => {
        setError(
          saveError instanceof Error ? saveError.message : "Não foi possível salvar a agenda.",
        );
        if (latestQueuedRef.current === snapshot) setSaveState("error");
      });

    return saveChainRef.current;
  }, []);

  useEffect(() => {
    const snapshot = JSON.stringify(form);
    if (snapshot === lastSavedRef.current) return;

    const timer = window.setTimeout(() => {
      void enqueueSave(form);
    }, 850);

    return () => window.clearTimeout(timer);
  }, [enqueueSave, form]);

  function updateField<K extends keyof AgendaInput>(field: K, value: AgendaInput[K]) {
    setSaveState("pending");
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const snapshot = JSON.stringify(form);
    await enqueueSave(form, true);

    if (lastSavedRef.current === snapshot) {
      router.push("/bispado/agendas-sacramentais");
      router.refresh();
    }
  }

  const isTestimonyMeeting = form.tipo === "TESTEMUNHO";
  const parsedMeetingDate = parseISO(form.data);
  const meetingDate = isValid(parsedMeetingDate) ? parsedMeetingDate : new Date();
  const musicCount = [
    form.hinoAbertura,
    form.hinoSacramental,
    !isTestimonyMeeting ? form.hinoEspecial : "",
    form.hinoEncerramento,
  ].filter((value) => value?.trim()).length;
  const speechCount = isTestimonyMeeting
    ? 0
    : [form.primeiroOrador, form.segundoOrador, form.ultimoOrador].filter((value) =>
        value?.trim(),
      ).length;

  return (
    <form
      onSubmit={handleSubmit}
      onBlurCapture={() => void enqueueSave(form)}
      className="agenda-editor"
    >
      <header className="agenda-editor-header">
        <div className="agenda-editor-date">
          <span>{format(meetingDate, "EEEE", { locale: ptBR })}</span>
          <strong>{format(meetingDate, "dd")}</strong>
          <small>{format(meetingDate, "MMM yyyy", { locale: ptBR })}</small>
        </div>

        <div className="agenda-editor-heading">
          <div className="agenda-editor-kicker">
            <span aria-hidden="true">▣</span>
            Agenda sacramental
          </div>
          <h2>Agenda Sacramental</h2>
          <p>Ala Novo Hamburgo</p>
          <SaveIndicator state={saveState} />
        </div>

        <div className="agenda-editor-actions">
          {agendaId && (
            <Link
              href={`/bispado/agendas-sacramentais/${agendaId}/apresentacao`}
              className="agenda-present-button"
            >
              <span aria-hidden="true">▶</span> Apresentar
            </Link>
          )}
          <button type="submit" className="agenda-edit-button">
            Salvar e voltar
          </button>
        </div>

        <div className="agenda-editor-meta">
          <label>
            <span>Data</span>
            <input
              type="date"
              required
              value={form.data}
              onChange={(event) => updateField("data", event.target.value)}
            />
          </label>
          <label>
            <span>Frequência</span>
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
              placeholder="—"
            />
          </label>
          <fieldset>
            <legend>Tipo de reunião</legend>
            <div className="agenda-type-picker">
              <button
                type="button"
                className={!isTestimonyMeeting ? "active" : ""}
                onClick={() => updateField("tipo", "NORMA")}
              >
                Norma
              </button>
              <button
                type="button"
                className={isTestimonyMeeting ? "active" : ""}
                onClick={() => updateField("tipo", "TESTEMUNHO")}
              >
                Testemunho
              </button>
            </div>
          </fieldset>
        </div>
      </header>

      <div className="agenda-editor-stats" aria-label="Resumo da agenda">
        <div><span>Músicas</span><strong>{musicCount}</strong><small>definidas</small></div>
        <div><span>Discursos</span><strong>{isTestimonyMeeting ? "—" : speechCount}</strong><small>{isTestimonyMeeting ? "não se aplica" : "programados"}</small></div>
        <div><span>Chamados</span><strong>{form.chamados?.length ?? 0}</strong><small>no programa</small></div>
        <div><span>Anúncios</span><strong>{countAnnouncements(form.anuncios)}</strong><small>informados</small></div>
      </div>

      <div className="agenda-editor-sections">
        <FormSection title="Abertura" subtitle="Presidência, música e reconhecimentos" accent="navy">
          <div className="agenda-field-grid">
            <AutocompleteInput label="Presidida por" value={form.presididaPor ?? ""} onChange={(value) => updateField("presididaPor", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Dirigida por" value={form.dirigidaPor ?? ""} onChange={(value) => updateField("dirigidaPor", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Reconhecimento de autoridades" value={form.reconhecimentoAutoridades ?? ""} onChange={(value) => updateField("reconhecimentoAutoridades", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Reconhecimento de visitantes ou novos membros" value={form.reconhecimentoVisitantes ?? ""} onChange={(value) => updateField("reconhecimentoVisitantes", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Regente" value={form.regente ?? ""} onChange={(value) => updateField("regente", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Organista" value={form.organista ?? ""} onChange={(value) => updateField("organista", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Hino de abertura" value={form.hinoAbertura ?? ""} onChange={(value) => updateField("hinoAbertura", value)} apiPath="/api/hinos" variant="hymn" />
            <AutocompleteInput label="1ª Oração" value={form.primeiraOracao ?? ""} onChange={(value) => updateField("primeiraOracao", value)} apiPath="/api/pessoas" variant="person" />
          </div>
          <div className="agenda-announcements-field">
            <RichTextEditor label="Anúncios" value={form.anuncios ?? ""} onChange={(value) => updateField("anuncios", value)} />
          </div>
        </FormSection>

        <FormSection title="Chamados, apoios, desobrigações e votos de plena aceitação" accent="gold">
          <ChamadosEditor value={form.chamados ?? []} onChange={(value) => updateField("chamados", value)} />
        </FormSection>

        <FormSection title="Sacramento" accent="gold">
          <div className="agenda-field-grid agenda-field-grid-narrow">
            <AutocompleteInput label="Hino sacramental" value={form.hinoSacramental ?? ""} onChange={(value) => updateField("hinoSacramental", value)} apiPath="/api/hinos" variant="hymn" />
          </div>
        </FormSection>

        {!isTestimonyMeeting && (
          <FormSection title="Discursos — 1ª parte" accent="navy">
            <div className="agenda-field-grid">
              <AutocompleteInput label="1º Orador(a)" value={form.primeiroOrador ?? ""} onChange={(value) => updateField("primeiroOrador", value)} apiPath="/api/pessoas" variant="person" />
              <AutocompleteInput label="2º Orador(a)" value={form.segundoOrador ?? ""} onChange={(value) => updateField("segundoOrador", value)} apiPath="/api/pessoas" variant="person" />
              <div className="agenda-field-span">
                <AutocompleteInput label="Hino especial (intervalo)" value={form.hinoEspecial ?? ""} onChange={(value) => updateField("hinoEspecial", value)} apiPath="/api/hinos" variant="hymn" />
              </div>
            </div>
          </FormSection>
        )}

        <FormSection title={isTestimonyMeeting ? "Encerramento" : "Último orador e encerramento"} accent="cream">
          <div className="agenda-field-grid">
            {!isTestimonyMeeting && (
              <AutocompleteInput label="Último orador(a)" value={form.ultimoOrador ?? ""} onChange={(value) => updateField("ultimoOrador", value)} apiPath="/api/pessoas" variant="person" />
            )}
            <AutocompleteInput label="Hino de encerramento" value={form.hinoEncerramento ?? ""} onChange={(value) => updateField("hinoEncerramento", value)} apiPath="/api/hinos" variant="hymn" />
            <AutocompleteInput label="Oração de encerramento" value={form.oracaoEncerramento ?? ""} onChange={(value) => updateField("oracaoEncerramento", value)} apiPath="/api/pessoas" variant="person" />
          </div>
        </FormSection>
      </div>

      {error && <div className="agenda-save-error">{error}</div>}

      <div className="agenda-save-bar">
        <SaveIndicator state={saveState} />
        <div>
          <Link href="/bispado/agendas-sacramentais" className="crm-btn">Voltar</Link>
          <button type="submit" className="agenda-present-button">Salvar e voltar</button>
        </div>
      </div>
    </form>
  );
}
