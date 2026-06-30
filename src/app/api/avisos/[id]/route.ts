import { NextRequest, NextResponse } from "next/server";
import { TipoAviso } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { revalidateComunicacaoPages } from "@/lib/revalidate-comunicacao";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const aviso = await prisma.aviso.findUnique({ where: { id } });

  if (!aviso) {
    return NextResponse.json({ error: "Aviso não encontrado" }, { status: 404 });
  }

  return NextResponse.json(aviso);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const existing = await prisma.aviso.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Aviso não encontrado" }, { status: 404 });
  }

  const body = (await request.json()) as {
    titulo?: string;
    conteudo?: string;
    tipo?: TipoAviso;
    publicado?: boolean;
    destaque?: boolean;
    linkExterno?: string | null;
  };

  const publicado = body.publicado ?? existing.publicado;
  const wasPublished = existing.publicado;

  const aviso = await prisma.aviso.update({
    where: { id },
    data: {
      titulo: body.titulo?.trim() ?? existing.titulo,
      conteudo: body.conteudo ?? existing.conteudo,
      tipo: body.tipo ?? existing.tipo,
      publicado,
      destaque: body.destaque ?? existing.destaque,
      linkExterno:
        body.linkExterno !== undefined ? body.linkExterno?.trim() || null : existing.linkExterno,
      publicadoEm: publicado && !wasPublished ? new Date() : existing.publicadoEm,
    },
  });

  revalidateComunicacaoPages();
  return NextResponse.json(aviso);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;

  await prisma.aviso.delete({ where: { id } });
  revalidateComunicacaoPages();
  return NextResponse.json({ ok: true });
}
