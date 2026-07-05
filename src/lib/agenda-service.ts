import { prisma } from "@/lib/db";
import {
  AgendaInput,
  CAMPOS_HINO,
  CAMPOS_PESSOA,
  parseHino,
} from "@/lib/types";

async function upsertPessoa(nome: string) {
  const trimmed = nome.trim();
  if (!trimmed) return;

  await prisma.pessoa.upsert({
    where: { nome: trimmed },
    update: {},
    create: { nome: trimmed },
  });
}

async function upsertHino(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;

  const parsed = parseHino(trimmed);
  if (!parsed) return;

  await prisma.hino.upsert({
    where: { numero: parsed.numero },
    update: { nome: parsed.nome },
    create: { numero: parsed.numero, nome: parsed.nome },
  });
}

async function upsertChamado(titulo: string) {
  const trimmed = titulo.trim();
  if (!trimmed) return;

  await prisma.chamado.upsert({
    where: { titulo: trimmed },
    update: {},
    create: { titulo: trimmed },
  });
}

export async function syncMasterData(input: AgendaInput) {
  for (const campo of CAMPOS_PESSOA) {
    const value = input[campo];
    if (typeof value === "string") {
      await upsertPessoa(value);
    }
  }

  for (const campo of CAMPOS_HINO) {
    const value = input[campo];
    if (typeof value === "string") {
      await upsertHino(value);
    }
  }

  if (input.chamados) {
    for (const item of input.chamados) {
      await upsertPessoa(item.pessoa);
      await upsertChamado(item.chamado);
    }
  }
}

export function buildAgendaData(input: AgendaInput) {
  const tipo: AgendaInput["tipo"] =
    input.tipo === "TESTEMUNHO" ? "TESTEMUNHO" : "NORMA";
  const isTestimonyMeeting = tipo === "TESTEMUNHO";

  return {
    data: new Date(input.data),
    tipo,
    frequencia: input.frequencia ?? null,
    presididaPor: input.presididaPor?.trim() || null,
    dirigidaPor: input.dirigidaPor?.trim() || null,
    reconhecimentoAutoridades: input.reconhecimentoAutoridades?.trim() || null,
    reconhecimentoVisitantes: input.reconhecimentoVisitantes?.trim() || null,
    anuncios: input.anuncios || null,
    regente: input.regente?.trim() || null,
    organista: input.organista?.trim() || null,
    hinoAbertura: input.hinoAbertura?.trim() || null,
    primeiraOracao: input.primeiraOracao?.trim() || null,
    hinoSacramental: input.hinoSacramental?.trim() || null,
    primeiroOrador: isTestimonyMeeting ? null : input.primeiroOrador?.trim() || null,
    segundoOrador: isTestimonyMeeting ? null : input.segundoOrador?.trim() || null,
    hinoEspecial: isTestimonyMeeting ? null : input.hinoEspecial?.trim() || null,
    ultimoOrador: isTestimonyMeeting ? null : input.ultimoOrador?.trim() || null,
    hinoEncerramento: input.hinoEncerramento?.trim() || null,
    oracaoEncerramento: input.oracaoEncerramento?.trim() || null,
  };
}

export function buildChamadosData(chamados: AgendaInput["chamados"]) {
  return (chamados ?? [])
    .filter((item) => item.pessoa.trim() || item.chamado.trim())
    .map((item, index) => ({
      tipo: item.tipo === "DESOBRIGACAO" ? "DESOBRIGACAO" as const : "APOIO" as const,
      pessoa: item.pessoa.trim(),
      chamado: item.chamado.trim(),
      ordem: index,
    }));
}
