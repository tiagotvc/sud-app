"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { AnunciosEditor } from "@/components/AnunciosEditor";
import { AutoridadesEditor } from "@/components/AutoridadesEditor";
import { ChamadosEditor } from "@/components/ChamadosEditor";
import { FormSection } from "@/components/FormSection";
import { RestrictedSelect } from "@/components/RestrictedSelect";
import {
  AgendaInput,
  DIRIGENTE_OPTIONS,
  PRESIDENCIA_OPTIONS,
  parseAnuncios,
  parseAutoridades,
  serializeAnuncios,
  serializeAutoridades,
} from "@/lib/types";
import { formatCalendarDate } from "@/lib/date-utils";

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

function countAnnouncements(value: string | undefined) {
  return parseAnuncios(value).length;
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
  const historyRef = useRef<string[]>([]);
  const [historyCount, setHistoryCount] = useState(0);

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

        if (lastSavedRef.current !== snapshot) {
          historyRef.current = [...historyRef.current, lastSavedRef.current].slice(-15);
          setHistoryCount(historyRef.current.length);
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

  function handleUndo() {
    if (historyRef.current.length === 0) return;

    const previousSnapshot = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setHistoryCount(historyRef.current.length);

    const restored = JSON.parse(previousSnapshot) as AgendaInput;
    setSaveState("pending");
    setForm(restored);
    void enqueueSave(restored);
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
          <span>{formatCalendarDate(meetingDate, "EEEE", { locale: ptBR })}</span>
          <strong>{formatCalendarDate(meetingDate, "dd")}</strong>
          <small>{formatCalendarDate(meetingDate, "MMM yyyy", { locale: ptBR })}</small>
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
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyCount === 0}
            className="agenda-undo-button"
            title="Desfazer última edição"
          >
            <span aria-hidden="true">↺</span> Desfazer
          </button>
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
                Discursos
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
            <RestrictedSelect
              label="Presidida por"
              value={form.presididaPor ?? ""}
              onChange={(value) => updateField("presididaPor", value)}
              options={PRESIDENCIA_OPTIONS}
              allowCustom
            />
            <RestrictedSelect
              label="Dirigida por"
              value={form.dirigidaPor ?? ""}
              onChange={(value) => updateField("dirigidaPor", value)}
              options={DIRIGENTE_OPTIONS}
            />
          </div>
          <div className="mt-5">
            <AutoridadesEditor
              value={parseAutoridades(form.reconhecimentoAutoridades)}
              onChange={(value) => updateField("reconhecimentoAutoridades", serializeAutoridades(value))}
            />
          </div>
          <div className="mt-5">
            <label className="field-label">Visitantes ou novos membros</label>
            <textarea
              value={form.reconhecimentoVisitantes ?? ""}
              onChange={(event) => updateField("reconhecimentoVisitantes", event.target.value)}
              placeholder="Nomes dos visitantes ou novos membros"
              rows={2}
              className="field-input w-full"
            />
          </div>
          <div className="agenda-announcements-field">
            <AnunciosEditor
              value={parseAnuncios(form.anuncios)}
              onChange={(value) => updateField("anuncios", serializeAnuncios(value))}
            />
          </div>
          <div className="agenda-field-grid mt-5">
            <AutocompleteInput label="Regente" value={form.regente ?? ""} onChange={(value) => updateField("regente", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Organista" value={form.organista ?? ""} onChange={(value) => updateField("organista", value)} apiPath="/api/pessoas" variant="person" />
            <AutocompleteInput label="Hino de abertura" value={form.hinoAbertura ?? ""} onChange={(value) => updateField("hinoAbertura", value)} apiPath="/api/hinos" variant="hymn" restrict />
            <AutocompleteInput label="1ª Oração" value={form.primeiraOracao ?? ""} onChange={(value) => updateField("primeiraOracao", value)} apiPath="/api/pessoas" variant="person" />
          </div>
        </FormSection>

        <FormSection title="Chamados, apoios, desobrigações e votos de plena aceitação" accent="gold">
          <ChamadosEditor value={form.chamados ?? []} onChange={(value) => updateField("chamados", value)} />
        </FormSection>

        <FormSection title="Sacramento" accent="gold">
          <div className="agenda-field-grid agenda-field-grid-narrow">
            <AutocompleteInput label="Hino sacramental" value={form.hinoSacramental ?? ""} onChange={(value) => updateField("hinoSacramental", value)} apiPath="/api/hinos" variant="hymn" restrict />
          </div>
        </FormSection>

        {!isTestimonyMeeting && (
          <FormSection title="Discursos — 1ª parte" accent="navy">
            <div className="agenda-field-grid">
              <AutocompleteInput label="1º Orador(a)" value={form.primeiroOrador ?? ""} onChange={(value) => updateField("primeiroOrador", value)} apiPath="/api/pessoas" variant="person" />
              <AutocompleteInput label="2º Orador(a)" value={form.segundoOrador ?? ""} onChange={(value) => updateField("segundoOrador", value)} apiPath="/api/pessoas" variant="person" />
              <div className="agenda-field-span">
                <AutocompleteInput label="Hino especial (intervalo)" value={form.hinoEspecial ?? ""} onChange={(value) => updateField("hinoEspecial", value)} apiPath="/api/hinos" variant="hymn" restrict />
              </div>
            </div>
          </FormSection>
        )}

        <FormSection title={isTestimonyMeeting ? "Encerramento" : "Último orador e encerramento"} accent="cream">
          <div className="agenda-field-grid">
            {!isTestimonyMeeting && (
              <AutocompleteInput label="Último orador(a)" value={form.ultimoOrador ?? ""} onChange={(value) => updateField("ultimoOrador", value)} apiPath="/api/pessoas" variant="person" />
            )}
            <AutocompleteInput label="Hino de encerramento" value={form.hinoEncerramento ?? ""} onChange={(value) => updateField("hinoEncerramento", value)} apiPath="/api/hinos" variant="hymn" restrict />
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
