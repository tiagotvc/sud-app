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

  if (!agenda) notFound();

  return (
    <div className="page-shell agenda-editor-page">
      <Link href="/bispado/agendas-sacramentais" className="agenda-editor-back">
        <span aria-hidden="true">‹</span>
        Agendas Sacramentais
        <span aria-hidden="true">/</span>
        <strong>Agenda de {format(agenda.data, "dd/MM/yyyy")}</strong>
      </Link>
      <AgendaForm
        mode="edit"
        initialData={{
          id: agenda.id,
          data: format(agenda.data, "yyyy-MM-dd"),
          tipo: agenda.tipo,
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
