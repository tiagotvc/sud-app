import { revalidatePath } from "next/cache";

export function revalidateAgendaPages(agendaId?: string) {
  revalidatePath("/bispado");
  revalidatePath("/bispado/agendas-sacramentais");
  revalidatePath("/bispado/agendas-sacramentais/nova");

  if (agendaId) {
    revalidatePath(`/bispado/agendas-sacramentais/${agendaId}`);
  }
}
