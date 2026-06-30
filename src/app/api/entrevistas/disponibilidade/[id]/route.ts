import { NextRequest, NextResponse } from "next/server";
import { requireEntrevistador } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireEntrevistador();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await params;
  const body = (await request.json()) as { ativo?: boolean };

  const item = await prisma.disponibilidadeEntrevista.findUnique({
    where: { id },
  });

  if (!item) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  if (
    item.usuarioId !== authResult.session.user.id &&
    authResult.session.user.role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const updated = await prisma.disponibilidadeEntrevista.update({
    where: { id },
    data: { ativo: body.ativo ?? item.ativo },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireEntrevistador();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await params;

  const item = await prisma.disponibilidadeEntrevista.findUnique({
    where: { id },
  });

  if (!item) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  if (
    item.usuarioId !== authResult.session.user.id &&
    authResult.session.user.role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  await prisma.disponibilidadeEntrevista.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
