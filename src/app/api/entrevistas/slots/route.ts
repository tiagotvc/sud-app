import { NextRequest, NextResponse } from "next/server";
import { gerarSlotsEntrevistador, SEMANAS_AGENDA } from "@/lib/entrevistas";

export async function GET(request: NextRequest) {
  const entrevistadorId = request.nextUrl.searchParams.get("entrevistadorId");
  const semanaParam = request.nextUrl.searchParams.get("semana");

  if (!entrevistadorId) {
    return NextResponse.json({ error: "entrevistadorId é obrigatório" }, { status: 400 });
  }

  const semana = semanaParam ? Number(semanaParam) : 0;
  if (Number.isNaN(semana) || semana < 0 || semana >= SEMANAS_AGENDA) {
    return NextResponse.json({ error: "Semana inválida" }, { status: 400 });
  }

  const resultado = await gerarSlotsEntrevistador(entrevistadorId, semana);
  return NextResponse.json(resultado);
}
