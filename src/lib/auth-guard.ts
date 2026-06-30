import { auth } from "@/auth";
import { UserRole } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { podeGerenciarConselheiros, podeGerenciarEntrevistas } from "@/lib/entrevistas";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) };
  }

  return { session };
}

export async function requireBispado() {
  const result = await requireAuth();

  if ("error" in result) {
    return result;
  }

  if (result.session.user.role !== UserRole.BISPADO) {
    return {
      error: NextResponse.json({ error: "Acesso restrito ao Bispado" }, { status: 403 }),
    };
  }

  return result;
}

export async function requireEntrevistador() {
  const result = await requireAuth();

  if ("error" in result) {
    return result;
  }

  if (!podeGerenciarEntrevistas(result.session.user.role)) {
    return {
      error: NextResponse.json({ error: "Acesso restrito" }, { status: 403 }),
    };
  }

  return result;
}

export async function requireGestorConselheiros() {
  const result = await requireAuth();

  if ("error" in result) {
    return result;
  }

  if (!podeGerenciarConselheiros(result.session.user.role)) {
    return {
      error: NextResponse.json({ error: "Acesso restrito" }, { status: 403 }),
    };
  }

  return result;
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}
