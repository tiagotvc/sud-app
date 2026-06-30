import { NextRequest, NextResponse } from "next/server";
import { reservarEntrevista } from "@/lib/entrevistas";

const ERROS: Record<string, { status: number; msg: string }> = {
  HORARIO_INVALIDO: { status: 400, msg: "Horário inválido ou no passado." },
  ENTREVISTADOR_INVALIDO: { status: 400, msg: "Entrevistador não encontrado." },
  FORA_DISPONIBILIDADE: { status: 400, msg: "Horário fora da disponibilidade." },
  HORARIO_INDISPONIVEL: { status: 409, msg: "Este horário acabou de ser reservado. Escolha outro." },
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    entrevistadorId?: string;
    inicio?: string;
    nomeMembro?: string;
    emailMembro?: string;
    telefoneMembro?: string;
    observacoes?: string;
    modoEntrevista?: "PRESENCIAL" | "ONLINE";
  };

  if (!body.entrevistadorId || !body.inicio || !body.nomeMembro?.trim()) {
    return NextResponse.json(
      { error: "Entrevistador, horário e nome são obrigatórios." },
      { status: 400 },
    );
  }

  try {
    const reserva = await reservarEntrevista({
      entrevistadorId: body.entrevistadorId,
      inicio: body.inicio,
      nomeMembro: body.nomeMembro,
      emailMembro: body.emailMembro,
      telefoneMembro: body.telefoneMembro,
      observacoes: body.observacoes,
      modoEntrevista: body.modoEntrevista,
    });

    return NextResponse.json(reserva, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "ERRO";
    const info = ERROS[code] ?? { status: 500, msg: "Não foi possível reservar." };
    return NextResponse.json({ error: info.msg }, { status: info.status });
  }
}
