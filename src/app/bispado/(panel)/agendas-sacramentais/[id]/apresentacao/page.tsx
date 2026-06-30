import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AgendaPresentation } from "@/components/AgendaPresentation";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgendaApresentacaoPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.BISPADO) {
    redirect(`/bispado/login?callbackUrl=/bispado/agendas-sacramentais/${id}/apresentacao`);
  }

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
    <AgendaPresentation
      agenda={{
        id: agenda.id,
        data: agenda.data,
        frequencia: agenda.frequencia,
        presididaPor: agenda.presididaPor,
        dirigidaPor: agenda.dirigidaPor,
        reconhecimentoAutoridades: agenda.reconhecimentoAutoridades,
        reconhecimentoVisitantes: agenda.reconhecimentoVisitantes,
        anuncios: agenda.anuncios,
        regente: agenda.regente,
        organista: agenda.organista,
        hinoAbertura: agenda.hinoAbertura,
        primeiraOracao: agenda.primeiraOracao,
        hinoSacramental: agenda.hinoSacramental,
        primeiroOrador: agenda.primeiroOrador,
        segundoOrador: agenda.segundoOrador,
        hinoEspecial: agenda.hinoEspecial,
        ultimoOrador: agenda.ultimoOrador,
        hinoEncerramento: agenda.hinoEncerramento,
        oracaoEncerramento: agenda.oracaoEncerramento,
        chamados: agenda.chamados.map((c) => ({ pessoa: c.pessoa, chamado: c.chamado })),
      }}
    />
  );
}
