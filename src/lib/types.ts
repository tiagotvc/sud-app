export type OrganizacaoChamado =
  | "ELDERES"
  | "SOCORRO"
  | "RAPAZES"
  | "MOCAS"
  | "ESCOLA_DOMINICAL"
  | "BISPADO"
  | "OBRA_MISSIONARIA";

export const ORGANIZACOES_CHAMADO: { value: OrganizacaoChamado; label: string }[] = [
  { value: "ELDERES", label: "Quorum de Élderes" },
  { value: "SOCORRO", label: "Sociedade de Socorro" },
  { value: "RAPAZES", label: "Rapazes" },
  { value: "MOCAS", label: "Moças" },
  { value: "ESCOLA_DOMINICAL", label: "Escola Dominical" },
  { value: "BISPADO", label: "Bispado" },
  { value: "OBRA_MISSIONARIA", label: "Obra Missionária" },
];

export function organizacaoLabel(value: OrganizacaoChamado | null | undefined): string | null {
  return ORGANIZACOES_CHAMADO.find((item) => item.value === value)?.label ?? null;
}

export interface AgendaChamadoInput {
  tipo: "APOIO" | "DESOBRIGACAO";
  organizacao?: OrganizacaoChamado | "" | null;
  pessoa: string;
  chamado: string;
}

export const LOCAIS_ANUNCIO = [
  "Sede da Estaca",
  "Ala Liberdade",
  "Ala Primavera",
  "Ala Jardim Alcantara",
];

export interface AgendaAnuncioInput {
  data: string;
  hora: string;
  texto: string;
  local: string;
}

export const PRESIDENCIA_OPTIONS = ["Bispo Tiago Carvalho", "Presidente Borges"];

export const DIRIGENTE_OPTIONS = [
  "Marinaldo Souza",
  "Bispo Tiago Carvalho",
  "Gilberto Ilustre Junior",
];

export const CARGOS_AUTORIDADE = [
  "Presidente da Estaca",
  "Setenta",
  "Presidente do Templo",
  "Apóstolo",
];

export interface AgendaAutoridadeInput {
  cargo: string;
  nome: string;
}

export interface AgendaInput {
  data: string;
  tipo: "NORMA" | "TESTEMUNHO";
  frequencia?: number | null;
  presididaPor?: string;
  dirigidaPor?: string;
  reconhecimentoAutoridades?: string;
  reconhecimentoVisitantes?: string;
  anuncios?: string;
  regente?: string;
  organista?: string;
  hinoAbertura?: string;
  primeiraOracao?: string;
  hinoSacramental?: string;
  primeiroOrador?: string;
  segundoOrador?: string;
  hinoEspecial?: string;
  ultimoOrador?: string;
  hinoEncerramento?: string;
  oracaoEncerramento?: string;
  chamados?: AgendaChamadoInput[];
}

export const CAMPOS_PESSOA: (keyof AgendaInput)[] = [
  "presididaPor",
  "dirigidaPor",
  "regente",
  "organista",
  "primeiraOracao",
  "primeiroOrador",
  "segundoOrador",
  "ultimoOrador",
  "oracaoEncerramento",
];

export const CAMPOS_HINO: (keyof AgendaInput)[] = [
  "hinoAbertura",
  "hinoSacramental",
  "hinoEspecial",
  "hinoEncerramento",
];

export function formatHino(numero: number, nome: string): string {
  return `${numero}  ${nome}`;
}

export function parseHino(value: string): { numero: number; nome: string } | null {
  const match = value.match(/^(\d+)\s{1,}\s*(.+)$/);
  if (!match) return null;
  return { numero: parseInt(match[1], 10), nome: match[2].trim() };
}

function isAgendaAnuncioInput(value: unknown): value is AgendaAnuncioInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.texto === "string" ||
    typeof item.data === "string" ||
    typeof item.hora === "string" ||
    typeof item.local === "string"
  );
}

/**
 * `anuncios` is stored as a JSON string of structured items. Older agendas
 * saved it as rich-text HTML instead — those get converted into a single
 * text-only item so existing announcements stay visible and editable.
 */
export function parseAnuncios(raw: string | undefined | null): AgendaAnuncioInput[] {
  const trimmed = raw?.trim();
  if (!trimmed) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(isAgendaAnuncioInput).map((item) => ({
        data: item.data ?? "",
        hora: item.hora ?? "",
        texto: item.texto ?? "",
        local: item.local ?? "",
      }));
    }
  } catch {
    // legacy HTML content, fall through to plain-text conversion below
  }

  const plainText = trimmed
    .replace(/<\/(p|li|div)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (plainText.length === 0) return [];
  return plainText.map((texto) => ({ data: "", hora: "", texto, local: "" }));
}

/**
 * Keeps blank rows in the serialized value (unlike the DB-bound cleanup in
 * agenda-service.ts) so a freshly added, still-empty row in the editor isn't
 * wiped out by the very next parse → serialize round-trip.
 */
export function serializeAnuncios(items: AgendaAnuncioInput[]): string {
  return items.length > 0 ? JSON.stringify(items) : "";
}

export function cleanAnuncios(items: AgendaAnuncioInput[]): AgendaAnuncioInput[] {
  return items
    .map((item) => ({
      data: item.data?.trim() ?? "",
      hora: item.hora?.trim() ?? "",
      texto: item.texto?.trim() ?? "",
      local: item.local?.trim() ?? "",
    }))
    .filter((item) => item.data || item.hora || item.texto || item.local);
}

function isAgendaAutoridadeInput(value: unknown): value is AgendaAutoridadeInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.nome === "string" || typeof item.cargo === "string";
}

/**
 * `reconhecimentoAutoridades` is stored as a JSON string of structured
 * items. Older agendas saved it as a single free-text line instead — those
 * get converted into a single item with an empty cargo so they stay visible
 * and editable.
 */
export function parseAutoridades(raw: string | undefined | null): AgendaAutoridadeInput[] {
  const trimmed = raw?.trim();
  if (!trimmed) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(isAgendaAutoridadeInput).map((item) => ({
        cargo: item.cargo ?? "",
        nome: item.nome ?? "",
      }));
    }
  } catch {
    // legacy free-text content, fall through to plain-text conversion below
  }

  return [{ cargo: "", nome: trimmed }];
}

/**
 * Keeps blank rows in the serialized value (unlike the DB-bound cleanup in
 * agenda-service.ts) so a freshly added, still-empty row in the editor isn't
 * wiped out by the very next parse → serialize round-trip.
 */
export function serializeAutoridades(items: AgendaAutoridadeInput[]): string {
  return items.length > 0 ? JSON.stringify(items) : "";
}

export function cleanAutoridades(items: AgendaAutoridadeInput[]): AgendaAutoridadeInput[] {
  return items
    .map((item) => ({ cargo: item.cargo?.trim() ?? "", nome: item.nome?.trim() ?? "" }))
    .filter((item) => item.cargo || item.nome);
}
