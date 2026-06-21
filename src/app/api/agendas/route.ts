import { NextRequest, NextResponse } from "next/server";
import {
  buildAgendaData,
  buildChamadosData,
  syncMasterData,
} from "@/lib/agenda-service";
import { prisma } from "@/lib/db";
import { revalidateAgendaPages } from "@/lib/revalidate-agenda";
import { AgendaInput } from "@/lib/types";

export async function GET() {
  const agendas = await prisma.agenda.findMany({
    orderBy: { data: "desc" },
    include: {
      chamados: { orderBy: { ordem: "asc" } },
    },
  });

  return NextResponse.json(agendas);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AgendaInput;

  if (!body.data) {
    return NextResponse.json({ error: "Data é obrigatória" }, { status: 400 });
  }

  await syncMasterData(body);

  const agenda = await prisma.agenda.create({
    data: {
      ...buildAgendaData(body),
      chamados: {
        create: buildChamadosData(body.chamados),
      },
    },
    include: {
      chamados: { orderBy: { ordem: "asc" } },
    },
  });

  revalidateAgendaPages(agenda.id);

  return NextResponse.json(agenda, { status: 201 });
}
