import { prisma } from "@/lib/db";
import { DIAS_SEMANA, formatarEvento, inicioSemanaAtual } from "@/lib/comunicacao";

export async function getConteudoSemanaAtual() {
  const semanaInicio = inicioSemanaAtual();

  let conteudo = await prisma.conteudoSemanal.findFirst({
    where: { semanaInicio, ativo: true },
  });

  if (!conteudo) {
    conteudo = await prisma.conteudoSemanal.findFirst({
      where: { ativo: true },
      orderBy: { semanaInicio: "desc" },
    });
  }

  return conteudo;
}

export async function getEventosCalendarioPublico() {
  const eventos = await prisma.eventoCalendario.findMany({
    where: { ativo: true },
    orderBy: [{ diaSemana: "asc" }, { ordem: "asc" }],
  });

  return DIAS_SEMANA.map((dia) => ({
    ...dia,
    eventos: eventos
      .filter((e) => e.diaSemana === dia.index)
      .map((e) => formatarEvento(e.titulo, e.horario)),
  }));
}

export async function getAvisosPublicos() {
  return prisma.aviso.findMany({
    where: { publicado: true },
    orderBy: [{ destaque: "desc" }, { publicadoEm: "desc" }, { createdAt: "desc" }],
  });
}

export async function getAvisosDestaque() {
  return prisma.aviso.findMany({
    where: { publicado: true, destaque: true },
    orderBy: { publicadoEm: "desc" },
    take: 3,
  });
}
