import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma/client";
import { requireGestorConselheiros } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function GET() {
  const authResult = await requireGestorConselheiros();
  if ("error" in authResult) {
    return authResult.error;
  }

  const conselheiros = await prisma.usuario.findMany({
    where: { role: UserRole.CONSELHEIRO },
    select: {
      id: true,
      nome: true,
      email: true,
      ativo: true,
      createdAt: true,
      _count: { select: { disponibilidadesEntrevista: true } },
    },
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(conselheiros);
}

export async function POST(request: NextRequest) {
  const authResult = await requireGestorConselheiros();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = (await request.json()) as {
    nome?: string;
    email?: string;
    password?: string;
  };

  if (!body.nome?.trim() || !body.email?.trim() || !body.password?.trim()) {
    return NextResponse.json(
      { error: "Nome, email e senha são obrigatórios." },
      { status: 400 },
    );
  }

  if (body.password.length < 6) {
    return NextResponse.json({ error: "Senha deve ter ao menos 6 caracteres." }, { status: 400 });
  }

  const email = body.email.toLowerCase().trim();
  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);

  const conselheiro = await prisma.usuario.create({
    data: {
      nome: body.nome.trim(),
      email,
      passwordHash,
      role: UserRole.CONSELHEIRO,
      ativo: true,
    },
    select: { id: true, nome: true, email: true, ativo: true, createdAt: true },
  });

  return NextResponse.json(conselheiro, { status: 201 });
}
