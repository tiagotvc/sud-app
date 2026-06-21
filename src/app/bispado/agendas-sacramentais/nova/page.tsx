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
    <div className="page-shell space-y-6">
      <div>
        <Link href="/bispado/agendas-sacramentais" className="crm-btn-ghost -ml-3">
          ← Voltar para agendas
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#0c1f3d]">Nova Agenda Sacramental</h1>
        <p className="mt-1 text-sm text-slate-500">
          Preencha os campos da reunião sacramental desta semana.
        </p>
      </div>
      <AgendaForm mode="create" />
    </div>
  );
}
