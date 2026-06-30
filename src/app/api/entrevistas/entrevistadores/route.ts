import { NextRequest, NextResponse } from "next/server";
import { listarEntrevistadoresPublicos } from "@/lib/entrevistas";

export async function GET() {
  const entrevistadores = await listarEntrevistadoresPublicos();
  return NextResponse.json(entrevistadores);
}
