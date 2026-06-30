import { startOfWeek } from "date-fns";

export const DIAS_SEMANA = [
  { index: 0, id: "domingo", label: "DOMINGO", icon: "⛪" },
  { index: 1, id: "segunda", label: "SEGUNDA", icon: "·" },
  { index: 2, id: "terca", label: "TERÇA", icon: "💻" },
  { index: 3, id: "quarta", label: "QUARTA", icon: "👥" },
  { index: 4, id: "quinta", label: "QUINTA", icon: "📖" },
  { index: 5, id: "sexta", label: "SEXTA", icon: "📕" },
  { index: 6, id: "sabado", label: "SÁBADO", icon: "🔥" },
] as const;

export { NOTAS_CALENDARIO, EVENTOS_SEMANA_ALA } from "@/lib/calendario-data";

export const TIPO_AVISO_LABEL: Record<string, string> = {
  AVISO: "Aviso",
  NOVIDADE: "Novidade",
  JORNAL: "Jornal",
  EVENTO: "Evento",
};

const TIPO_AVISO_BADGE: Record<string, string> = {
  EVENTO: "ala-badge ala-badge-evento",
  NOVIDADE: "ala-badge ala-badge-novidade",
  AVISO: "ala-badge ala-badge-aviso",
  JORNAL: "ala-badge ala-badge-jornal",
};

const TIPO_AVISO_BORDER: Record<string, string> = {
  EVENTO: "aviso-card-evento",
  NOVIDADE: "aviso-card-novidade",
  AVISO: "aviso-card-aviso",
  JORNAL: "aviso-card-jornal",
};

export function tipoAvisoBadgeClass(tipo: string) {
  return TIPO_AVISO_BADGE[tipo] ?? "ala-badge";
}

export function tipoAvisoBorderClass(tipo: string) {
  return TIPO_AVISO_BORDER[tipo] ?? "";
}

export function inicioSemanaAtual(date = new Date()) {
  return startOfWeek(date, { weekStartsOn: 0 });
}

export function formatarEvento(titulo: string, horario?: string | null) {
  return horario ? `${titulo} · ${horario}` : titulo;
}
