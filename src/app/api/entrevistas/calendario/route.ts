import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { gerarSlotsEntrevistador, podeGerenciarEntrevistas, SEMANAS_AGENDA } from "@/lib/entrevistas";

export async function GET(request: NextRequest) {
  const session = await auth();
  const semanaParam = request.nextUrl.searchParams.get("semana");
  const semana = semanaParam ? Number(semanaParam) : 0;

  if (Number.isNaN(semana) || semana < 0 || semana >= SEMANAS_AGENDA) {
    return NextResponse.json({ error: "Semana inválida" }, { status: 400 });
  }

  if (!session?.user || !podeGerenciarEntrevistas(session.user.role)) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const resultado = await gerarSlotsEntrevistador(session.user.id, semana, {
    incluirDetalhesReserva: true,
  });

  return NextResponse.json(resultado);
}
