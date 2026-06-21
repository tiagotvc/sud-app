import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { AgendaForm } from "@/components/AgendaForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgendaDetailPage({ params }: PageProps) {
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
    <main className="page-shell">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#1e4d8c] hover:underline"
        >
          ← Voltar para agendas
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Editar Agenda Sacramental · {format(agenda.data, "dd/MM/yyyy")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize os campos da reunião sacramental.
        </p>
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
    </main>
  );
}
