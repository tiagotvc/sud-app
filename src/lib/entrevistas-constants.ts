export const DIAS_ENTREVISTA = [
  { index: 0, label: "Domingo" },
  { index: 1, label: "Segunda-feira" },
  { index: 2, label: "Terça-feira" },
  { index: 3, label: "Quarta-feira" },
  { index: 4, label: "Quinta-feira" },
  { index: 5, label: "Sexta-feira" },
  { index: 6, label: "Sábado" },
] as const;

export const SEMANAS_AGENDA = 4;

export type ModoEntrevista = "PRESENCIAL" | "ONLINE";

export interface ReservaSlotInfo {
  id: string;
  nomeMembro: string;
  modoEntrevista: ModoEntrevista;
  telefoneMembro?: string | null;
  emailMembro?: string | null;
  observacoes?: string | null;
}

export interface SlotEntrevista {
  inicio: string;
  fim: string;
  label: string;
  disponivel: boolean;
  reserva?: ReservaSlotInfo;
}

export function labelEntrevistador(role: string) {
  if (role === "BISPADO") return "Bispo";
  if (role === "CONSELHEIRO") return "Conselheiro";
  return "Líder";
}
