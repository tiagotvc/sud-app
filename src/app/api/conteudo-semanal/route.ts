import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { inicioSemanaAtual } from "@/lib/comunicacao";
import { prisma } from "@/lib/db";
import { revalidateComunicacaoPages } from "@/lib/revalidate-comunicacao";

export async function GET() {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const semanaInicio = inicioSemanaAtual();
  const conteudo = await prisma.conteudoSemanal.findUnique({
    where: { semanaInicio },
  });

  return NextResponse.json(conteudo);
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = (await request.json()) as {
    mensagemBispo?: string | null;
    hinoSemana?: string | null;
    versiculoTexto?: string | null;
    versiculoRef?: string | null;
    linkJornal?: string | null;
    tituloJornal?: string | null;
    ativo?: boolean;
  };

  const semanaInicio = inicioSemanaAtual();

  const conteudo = await prisma.conteudoSemanal.upsert({
    where: { semanaInicio },
    create: {
      semanaInicio,
      mensagemBispo: body.mensagemBispo?.trim() || null,
      hinoSemana: body.hinoSemana?.trim() || null,
      versiculoTexto: body.versiculoTexto?.trim() || null,
      versiculoRef: body.versiculoRef?.trim() || null,
      linkJornal: body.linkJornal?.trim() || null,
      tituloJornal: body.tituloJornal?.trim() || null,
      ativo: body.ativo ?? true,
    },
    update: {
      mensagemBispo: body.mensagemBispo?.trim() || null,
      hinoSemana: body.hinoSemana?.trim() || null,
      versiculoTexto: body.versiculoTexto?.trim() || null,
      versiculoRef: body.versiculoRef?.trim() || null,
      linkJornal: body.linkJornal?.trim() || null,
      tituloJornal: body.tituloJornal?.trim() || null,
      ativo: body.ativo ?? true,
    },
  });

  revalidateComunicacaoPages();
  return NextResponse.json(conteudo);
}
