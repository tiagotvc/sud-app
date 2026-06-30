import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireEntrevistador } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authResult = await requireEntrevistador();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { session } = authResult;
  const usuarioId = request.nextUrl.searchParams.get("usuarioId");
  const isAdmin = session.user.role === UserRole.ADMIN;

  const targetId =
    isAdmin && usuarioId ? usuarioId : session.user.id;

  if (usuarioId && usuarioId !== session.user.id && !isAdmin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const disponibilidades = await prisma.disponibilidadeEntrevista.findMany({
    where: { usuarioId: targetId },
    orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
  });

  return NextResponse.json(disponibilidades);
}

export async function POST(request: NextRequest) {
  const authResult = await requireEntrevistador();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { session } = authResult;
  const body = (await request.json()) as {
    diaSemana?: number;
    horaInicio?: string;
    horaFim?: string;
    duracaoMin?: number;
    usuarioId?: string;
  };

  const isAdmin = session.user.role === UserRole.ADMIN;
  const usuarioId =
    isAdmin && body.usuarioId ? body.usuarioId : session.user.id;

  if (
    body.diaSemana == null ||
    !body.horaInicio?.trim() ||
    !body.horaFim?.trim()
  ) {
    return NextResponse.json({ error: "Dia e horários são obrigatórios." }, { status: 400 });
  }

  if (body.diaSemana < 0 || body.diaSemana > 6) {
    return NextResponse.json({ error: "Dia da semana inválido." }, { status: 400 });
  }

  if (body.horaInicio >= body.horaFim) {
    return NextResponse.json({ error: "Hora fim deve ser após hora início." }, { status: 400 });
  }

  const duracaoMin = body.duracaoMin ?? 30;
  if (![15, 20, 30, 45, 60].includes(duracaoMin)) {
    return NextResponse.json({ error: "Duração inválida." }, { status: 400 });
  }

  const item = await prisma.disponibilidadeEntrevista.create({
    data: {
      usuarioId,
      diaSemana: body.diaSemana,
      horaInicio: body.horaInicio,
      horaFim: body.horaFim,
      duracaoMin,
      ativo: true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
