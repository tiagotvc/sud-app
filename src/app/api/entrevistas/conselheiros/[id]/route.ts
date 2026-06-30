import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireGestorConselheiros } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireGestorConselheiros();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await params;
  const body = (await request.json()) as {
    ativo?: boolean;
    nome?: string;
    password?: string;
  };

  const conselheiro = await prisma.usuario.findFirst({
    where: { id, role: "CONSELHEIRO" },
  });

  if (!conselheiro) {
    return NextResponse.json({ error: "Conselheiro não encontrado." }, { status: 404 });
  }

  const data: { ativo?: boolean; nome?: string; passwordHash?: string } = {};

  if (typeof body.ativo === "boolean") data.ativo = body.ativo;
  if (body.nome?.trim()) data.nome = body.nome.trim();
  if (body.password?.trim()) {
    if (body.password.length < 6) {
      return NextResponse.json({ error: "Senha deve ter ao menos 6 caracteres." }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(body.password, 12);
  }

  const updated = await prisma.usuario.update({
    where: { id },
    data,
    select: { id: true, nome: true, email: true, ativo: true },
  });

  return NextResponse.json(updated);
}
