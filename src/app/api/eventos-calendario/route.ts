import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { revalidateComunicacaoPages } from "@/lib/revalidate-comunicacao";

export async function GET() {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const eventos = await prisma.eventoCalendario.findMany({
    orderBy: [{ diaSemana: "asc" }, { ordem: "asc" }],
  });

  return NextResponse.json(eventos);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = (await request.json()) as {
    diaSemana?: number;
    titulo?: string;
    horario?: string | null;
    descricao?: string | null;
    ordem?: number;
    ativo?: boolean;
  };

  if (body.diaSemana == null || body.diaSemana < 0 || body.diaSemana > 6) {
    return NextResponse.json({ error: "Dia da semana inválido" }, { status: 400 });
  }

  if (!body.titulo?.trim()) {
    return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
  }

  const evento = await prisma.eventoCalendario.create({
    data: {
      diaSemana: body.diaSemana,
      titulo: body.titulo.trim(),
      horario: body.horario?.trim() || null,
      descricao: body.descricao?.trim() || null,
      ordem: body.ordem ?? 0,
      ativo: body.ativo ?? true,
    },
  });

  revalidateComunicacaoPages();
  return NextResponse.json(evento, { status: 201 });
}
