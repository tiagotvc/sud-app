import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { revalidateComunicacaoPages } from "@/lib/revalidate-comunicacao";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const existing = await prisma.eventoCalendario.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  const body = (await request.json()) as {
    diaSemana?: number;
    titulo?: string;
    horario?: string | null;
    descricao?: string | null;
    ordem?: number;
    ativo?: boolean;
  };

  const evento = await prisma.eventoCalendario.update({
    where: { id },
    data: {
      diaSemana: body.diaSemana ?? existing.diaSemana,
      titulo: body.titulo?.trim() ?? existing.titulo,
      horario: body.horario !== undefined ? body.horario?.trim() || null : existing.horario,
      descricao:
        body.descricao !== undefined ? body.descricao?.trim() || null : existing.descricao,
      ordem: body.ordem ?? existing.ordem,
      ativo: body.ativo ?? existing.ativo,
    },
  });

  revalidateComunicacaoPages();
  return NextResponse.json(evento);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  await prisma.eventoCalendario.delete({ where: { id } });
  revalidateComunicacaoPages();
  return NextResponse.json({ ok: true });
}
