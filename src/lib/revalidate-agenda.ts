import { revalidatePath } from "next/cache";

export function revalidateAgendaPages(agendaId?: string) {
  revalidatePath("/");
  revalidatePath("/agendas/nova");

  if (agendaId) {
    revalidatePath(`/agendas/${agendaId}`);
  }
}
