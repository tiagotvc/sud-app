import { NextRequest, NextResponse } from "next/server";
import { requireBispado } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authResult = await requireBispado();
  if ("error" in authResult) {
    return authResult.error;
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  const chamados = await prisma.chamado.findMany({
    where: q ? { titulo: { contains: q } } : undefined,
    orderBy: { titulo: "asc" },
    take: 20,
  });

  return NextResponse.json(chamados.map((c) => c.titulo));
}

export async function POST(request: NextRequest) {
  const authResult = await requireBispado();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = await request.json();
  const titulo = typeof body.titulo === "string" ? body.titulo.trim() : "";

  if (!titulo) {
    return NextResponse.json({ error: "Chamado é obrigatório" }, { status: 400 });
  }

  const chamado = await prisma.chamado.upsert({
    where: { titulo },
    update: {},
    create: { titulo },
  });

  return NextResponse.json(chamado);
}
