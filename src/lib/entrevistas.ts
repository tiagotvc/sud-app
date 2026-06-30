import {
  addDays,
  addMinutes,
  addWeeks,
  differenceInWeeks,
  format,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { SEMANAS_AGENDA, type SlotEntrevista } from "@/lib/entrevistas-constants";

export { DIAS_ENTREVISTA, SEMANAS_AGENDA } from "@/lib/entrevistas-constants";
export type { SlotEntrevista } from "@/lib/entrevistas-constants";

function parseHora(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return { hours: h, minutes: m ?? 0 };
}

function combinarDataHora(data: Date, hora: string) {
  const { hours, minutes } = parseHora(hora);
  return setMinutes(setHours(startOfDay(data), hours), minutes);
}

export function labelEntrevistadorRole(role: UserRole) {
  if (role === UserRole.BISPADO) return "Bispo";
  if (role === UserRole.CONSELHEIRO) return "Conselheiro";
  return "Líder";
}

export async function listarEntrevistadoresPublicos() {
  return prisma.usuario.findMany({
    where: {
      ativo: true,
      role: { in: [UserRole.BISPADO, UserRole.CONSELHEIRO] },
      disponibilidadesEntrevista: { some: { ativo: true } },
    },
    select: {
      id: true,
      nome: true,
      role: true,
    },
    orderBy: [{ role: "asc" }, { nome: "asc" }],
  });
}

export async function gerarSlotsEntrevistador(
  entrevistadorId: string,
  semanaOffset = 0,
  opcoes?: { incluirDetalhesReserva?: boolean },
): Promise<{ semanaInicio: string; slots: SlotEntrevista[] }> {
  const semanaInicio = addWeeks(startOfWeek(new Date(), { weekStartsOn: 0 }), semanaOffset);

  const [disponibilidades, reservas] = await Promise.all([
    prisma.disponibilidadeEntrevista.findMany({
      where: { usuarioId: entrevistadorId, ativo: true },
    }),
    prisma.reservaEntrevista.findMany({
      where: {
        entrevistadorId,
        inicio: {
          gte: semanaInicio,
          lt: addWeeks(semanaInicio, 1),
        },
      },
    }),
  ]);

  const reservaPorInicio = new Map(
    reservas.map((r) => [r.inicio.toISOString(), r]),
  );
  const agora = new Date();
  const slots: SlotEntrevista[] = [];
  const incluirDetalhes = opcoes?.incluirDetalhesReserva ?? false;

  for (let dia = 0; dia < 7; dia++) {
    const dataDia = addDays(semanaInicio, dia);
    const blocosDia = disponibilidades.filter((d) => d.diaSemana === dia);

    for (const bloco of blocosDia) {
      let cursor = combinarDataHora(dataDia, bloco.horaInicio);
      const fimBloco = combinarDataHora(dataDia, bloco.horaFim);

      while (addMinutes(cursor, bloco.duracaoMin) <= fimBloco) {
        const fim = addMinutes(cursor, bloco.duracaoMin);
        const iso = cursor.toISOString();
        const reserva = reservaPorInicio.get(iso);

        if (!isBefore(cursor, agora)) {
          const slot: SlotEntrevista = {
            inicio: iso,
            fim: fim.toISOString(),
            label: format(cursor, "EEEE, d 'de' MMMM · HH:mm", { locale: ptBR }),
            disponivel: !reserva,
          };

          if (reserva && incluirDetalhes) {
            slot.reserva = {
              id: reserva.id,
              nomeMembro: reserva.nomeMembro,
              modoEntrevista: reserva.modoEntrevista,
              telefoneMembro: reserva.telefoneMembro,
              emailMembro: reserva.emailMembro,
              observacoes: reserva.observacoes,
            };
          }

          slots.push(slot);
        }

        cursor = fim;
      }
    }
  }

  slots.sort((a, b) => a.inicio.localeCompare(b.inicio));

  return { semanaInicio: semanaInicio.toISOString(), slots };
}

export async function reservarEntrevista(input: {
  entrevistadorId: string;
  inicio: string;
  nomeMembro: string;
  emailMembro?: string;
  telefoneMembro?: string;
  observacoes?: string;
  modoEntrevista?: "PRESENCIAL" | "ONLINE";
}) {
  const inicio = new Date(input.inicio);
  if (Number.isNaN(inicio.getTime()) || isBefore(inicio, new Date())) {
    throw new Error("HORARIO_INVALIDO");
  }

  const entrevistador = await prisma.usuario.findFirst({
    where: {
      id: input.entrevistadorId,
      ativo: true,
      role: { in: [UserRole.BISPADO, UserRole.CONSELHEIRO] },
    },
  });

  if (!entrevistador) {
    throw new Error("ENTREVISTADOR_INVALIDO");
  }

  const semanaBase = startOfWeek(new Date(), { weekStartsOn: 0 });
  const semanaSlot = startOfWeek(inicio, { weekStartsOn: 0 });
  const offset = differenceInWeeks(semanaSlot, semanaBase);

  if (offset < 0 || offset >= SEMANAS_AGENDA) {
    throw new Error("FORA_DISPONIBILIDADE");
  }

  const { slots } = await gerarSlotsEntrevistador(input.entrevistadorId, offset);
  const slot = slots.find((s) => s.inicio === inicio.toISOString() && s.disponivel);

  if (!slot) {
    throw new Error("HORARIO_INDISPONIVEL");
  }

  const fim = new Date(slot.fim);

  const modo =
    input.modoEntrevista === "ONLINE" || input.modoEntrevista === "PRESENCIAL"
      ? input.modoEntrevista
      : "PRESENCIAL";

  try {
    return await prisma.reservaEntrevista.create({
      data: {
        entrevistadorId: input.entrevistadorId,
        inicio,
        fim,
        nomeMembro: input.nomeMembro.trim(),
        emailMembro: input.emailMembro?.trim() || null,
        telefoneMembro: input.telefoneMembro?.trim() || null,
        observacoes: input.observacoes?.trim() || null,
        modoEntrevista: modo,
      },
    });
  } catch {
    throw new Error("HORARIO_INDISPONIVEL");
  }
}

export function podeGerenciarEntrevistas(role: UserRole) {
  return role === UserRole.BISPADO || role === UserRole.CONSELHEIRO || role === UserRole.ADMIN;
}

export function podeGerenciarConselheiros(role: UserRole) {
  return role === UserRole.BISPADO || role === UserRole.ADMIN;
}
