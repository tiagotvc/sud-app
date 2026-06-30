import { revalidatePath } from "next/cache";

export function revalidateComunicacaoPages() {
  revalidatePath("/calendario");
  revalidatePath("/avisos");
  revalidatePath("/bispado/comunicacao");
}
