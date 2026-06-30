import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireEntrevistador } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authResult = await requireEntrevistador();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { session } = authResult;
  const verTodas = session.user.role === UserRole.ADMIN;
  const entrevistadorId = request.nextUrl.searchParams.get("entrevistadorId");

  const where = verTodas
    ? entrevistadorId
      ? { entrevistadorId }
      : {}
    : { entrevistadorId: session.user.id };

  const reservas = await prisma.reservaEntrevista.findMany({
    where: {
      ...where,
      inicio: { gte: new Date() },
    },
    include: {
      entrevistador: { select: { id: true, nome: true, role: true } },
    },
    orderBy: { inicio: "asc" },
  });

  return NextResponse.json(reservas);
}
