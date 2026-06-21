import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  const pessoas = await prisma.pessoa.findMany({
    where: q
      ? { nome: { contains: q } }
      : undefined,
    orderBy: { nome: "asc" },
    take: 20,
  });

  return NextResponse.json(pessoas.map((p) => p.nome));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const nome = typeof body.nome === "string" ? body.nome.trim() : "";

  if (!nome) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const pessoa = await prisma.pessoa.upsert({
    where: { nome },
    update: {},
    create: { nome },
  });

  return NextResponse.json(pessoa);
}
