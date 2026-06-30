import { NextRequest, NextResponse } from "next/server";
import { TipoAviso } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { revalidateComunicacaoPages } from "@/lib/revalidate-comunicacao";

export async function GET() {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const avisos = await prisma.aviso.findMany({
    orderBy: [{ publicado: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(avisos);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = (await request.json()) as {
    titulo?: string;
    conteudo?: string;
    tipo?: TipoAviso;
    publicado?: boolean;
    destaque?: boolean;
    linkExterno?: string | null;
  };

  if (!body.titulo?.trim()) {
    return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
  }

  const publicado = body.publicado ?? false;

  const aviso = await prisma.aviso.create({
    data: {
      titulo: body.titulo.trim(),
      conteudo: body.conteudo?.trim() ?? "",
      tipo: body.tipo ?? TipoAviso.AVISO,
      publicado,
      destaque: body.destaque ?? false,
      linkExterno: body.linkExterno?.trim() || null,
      publicadoEm: publicado ? new Date() : null,
    },
  });

  revalidateComunicacaoPages();
  return NextResponse.json(aviso, { status: 201 });
}
