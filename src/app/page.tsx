import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const agendas = await prisma.agenda.findMany({
    orderBy: { data: "desc" },
    include: {
      chamados: { orderBy: { ordem: "asc" } },
    },
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            Bispado
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Agendas Sacramentais</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registro seguro das atas de reunião sacramental da Ala Novo Hamburgo.
          </p>
        </div>
        <Link
          href="/agendas/nova"
          className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
        >
          + Nova agenda
        </Link>
      </header>

      {agendas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-slate-600">Nenhuma agenda registrada ainda.</p>
          <Link
            href="/agendas/nova"
            className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline"
          >
            Criar a primeira agenda
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {agendas.map((agenda) => (
            <Link
              key={agenda.id}
              href={`/agendas/${agenda.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {format(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Dirigida por: {agenda.dirigidaPor || "—"} · Presidida por:{" "}
                    {agenda.presididaPor || "—"}
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Frequência: {agenda.frequencia ?? "—"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
