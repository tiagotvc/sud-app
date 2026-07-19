import { NextRequest, NextResponse } from "next/server";
import {
  buildAgendaData,
  buildChamadosData,
  syncMasterData,
} from "@/lib/agenda-service";
import { requireBispado } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { revalidateAgendaPages } from "@/lib/revalidate-agenda";
import { AgendaInput } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireBispado();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await params;

  const agenda = await prisma.agenda.findUnique({
    where: { id },
    include: {
      chamados: { orderBy: { ordem: "asc" } },
    },
  });

  if (!agenda) {
    return NextResponse.json({ error: "Agenda não encontrada" }, { status: 404 });
  }

  return NextResponse.json(agenda);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireBispado();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await params;
  const body = (await request.json()) as AgendaInput;

  if (!body.data) {
    return NextResponse.json({ error: "Data é obrigatória" }, { status: 400 });
  }

  const existing = await prisma.agenda.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Agenda não encontrada" }, { status: 404 });
  }

  try {
    await syncMasterData(body);

    const agenda = await prisma.$transaction(async (tx) => {
      await tx.agendaChamado.deleteMany({ where: { agendaId: id } });

      return tx.agenda.update({
        where: { id },
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
    });

    revalidateAgendaPages(id);

    return NextResponse.json(agenda);
  } catch (error) {
    console.error("Falha ao atualizar agenda", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível salvar a agenda." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireBispado();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await params;

  const existing = await prisma.agenda.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Agenda não encontrada" }, { status: 404 });
  }

  await prisma.agenda.delete({ where: { id } });

  revalidateAgendaPages();

  return NextResponse.json({ success: true });
}
