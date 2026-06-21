import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { AgendaForm } from "@/components/AgendaForm";
import { prisma } from "@/lib/db";

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
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
          ← Voltar para agendas
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Editar agenda · {format(agenda.data, "dd/MM/yyyy")}
        </h1>
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
