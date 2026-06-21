import { NextRequest, NextResponse } from "next/server";
import { requireBispado } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { formatHino, parseHino } from "@/lib/types";

export async function GET(request: NextRequest) {
  const authResult = await requireBispado();
  if ("error" in authResult) {
    return authResult.error;
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  const hinos = await prisma.hino.findMany({
    where: q
      ? {
          OR: [
            { nome: { contains: q } },
            ...(Number.isNaN(Number(q)) ? [] : [{ numero: Number(q) }]),
          ],
        }
      : undefined,
    orderBy: { numero: "asc" },
    take: 20,
  });

  return NextResponse.json(hinos.map((h) => formatHino(h.numero, h.nome)));
}

export async function POST(request: NextRequest) {
  const authResult = await requireBispado();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = await request.json();
  const value = typeof body.value === "string" ? body.value.trim() : "";

  if (!value) {
    return NextResponse.json({ error: "Hino é obrigatório" }, { status: 400 });
  }

  const parsed = parseHino(value);
  if (!parsed) {
    return NextResponse.json(
      { error: "Formato inválido. Use: número  nome (ex: 2  O Senhor é meu pastor)" },
      { status: 400 },
    );
  }

  const hino = await prisma.hino.upsert({
    where: { numero: parsed.numero },
    update: { nome: parsed.nome },
    create: { numero: parsed.numero, nome: parsed.nome },
  });

  return NextResponse.json(formatHino(hino.numero, hino.nome));
}
