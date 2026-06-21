export interface AgendaChamadoInput {
  pessoa: string;
  chamado: string;
}

export interface AgendaInput {
  data: string;
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
  "reconhecimentoAutoridades",
  "reconhecimentoVisitantes",
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
