import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireEntrevistador } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireEntrevistador();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await params;

  const reserva = await prisma.reservaEntrevista.findUnique({ where: { id } });

  if (!reserva) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const podeCancelar =
    reserva.entrevistadorId === authResult.session.user.id ||
    authResult.session.user.role === UserRole.ADMIN;

  if (!podeCancelar) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  await prisma.reservaEntrevista.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
