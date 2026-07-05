import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AgendaForm } from "@/components/AgendaForm";
import { UserRole } from "@/generated/prisma/client";

export default async function NovaAgendaPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.BISPADO) {
    redirect("/bispado");
  }

  return (
    <div className="page-shell agenda-editor-page">
      <Link href="/bispado/agendas-sacramentais" className="agenda-editor-back">
        <span aria-hidden="true">‹</span>
        Agendas Sacramentais
        <span aria-hidden="true">/</span>
        <strong>Nova agenda</strong>
      </Link>
      <AgendaForm mode="create" />
    </div>
  );
}
