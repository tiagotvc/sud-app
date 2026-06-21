import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/auth";
import { AgendaForm } from "@/components/AgendaForm";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgendaDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.BISPADO) {
    redirect("/bispado");
  }

  const { id } = await params;

  const agenda = await prisma.agenda.findUnique({
    where: { id },
    include: {
      chamados: { orderBy: { ordem: "asc" } },
    },
  });

  if (!agenda) {
    notFound();
  }

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/bispado/agendas-sacramentais" className="crm-btn-ghost -ml-3">
            ← Voltar para agendas
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[#0c1f3d]">
            Editar Agenda Sacramental
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {format(agenda.data, "dd/MM/yyyy")} — atualize os campos da reunião sacramental.
          </p>
        </div>
        <Link
          href={`/bispado/agendas-sacramentais/${agenda.id}/apresentacao`}
          className="crm-btn-primary"
        >
          ▶ Apresentar
        </Link>
      </div>
      <AgendaForm
        mode="edit"
        initialData={{
          id: agenda.id,
          data: format(agenda.data, "yyyy-MM-dd"),
          frequencia: agenda.frequencia,
          presididaPor: agenda.presididaPor ?? "",
          dirigidaPor: agenda.dirigidaPor ?? "",
          reconhecimentoAutoridades: agenda.reconhecimentoAutoridades ?? "",
          reconhecimentoVisitantes: agenda.reconhecimentoVisitantes ?? "",
          anuncios: agenda.anuncios ?? "",
          regente: agenda.regente ?? "",
          organista: agenda.organista ?? "",
          hinoAbertura: agenda.hinoAbertura ?? "",
          primeiraOracao: agenda.primeiraOracao ?? "",
          hinoSacramental: agenda.hinoSacramental ?? "",
          primeiroOrador: agenda.primeiroOrador ?? "",
          segundoOrador: agenda.segundoOrador ?? "",
          hinoEspecial: agenda.hinoEspecial ?? "",
          ultimoOrador: agenda.ultimoOrador ?? "",
          hinoEncerramento: agenda.hinoEncerramento ?? "",
          oracaoEncerramento: agenda.oracaoEncerramento ?? "",
          chamados: agenda.chamados.map((item) => ({
            pessoa: item.pessoa,
            chamado: item.chamado,
          })),
        }}
      />
    </div>
  );
}
