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
    <main className="page-shell">
      <header className="mb-8 overflow-hidden rounded-2xl border border-blue-900/10 bg-white shadow-lg">
        <div className="bg-gradient-to-br from-[#1e4d8c] via-[#2563a8] to-[#1e3a5f] px-6 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">
            Bispado
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Agendas Sacramentais</h1>
          <p className="mt-2 text-sm text-blue-100/90">
            Registro das agendas de reunião sacramental da Ala Novo Hamburgo.
          </p>
        </div>
        <div className="flex justify-end bg-white px-6 py-4">
          <Link href="/agendas/nova" className="btn-primary">
            + Nova agenda
          </Link>
        </div>
      </header>

      {agendas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-700">Nenhuma agenda registrada ainda.</p>
          <p className="mt-1 text-sm text-slate-500">
            Crie a primeira agenda sacramental da semana.
          </p>
          <Link
            href="/agendas/nova"
            className="mt-6 inline-block text-sm font-semibold text-[#1e4d8c] hover:underline"
          >
            Criar a primeira agenda →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {agendas.map((agenda) => (
            <Link
              key={agenda.id}
              href={`/agendas/${agenda.id}`}
              className="group block overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-[#1e4d8c]/30 hover:shadow-md"
            >
              <div className="flex">
                <div className="w-1.5 shrink-0 bg-gradient-to-b from-[#1e4d8c] to-[#2563a8] transition-all group-hover:w-2" />
                <div className="flex flex-1 flex-wrap items-start justify-between gap-3 p-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1e4d8c]">
                      Agenda Sacramental
                    </p>
                    <h2 className="mt-1 text-lg font-semibold capitalize text-slate-900">
                      {format(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600">
                      Dirigida por{" "}
                      <span className="font-medium text-slate-800">
                        {agenda.dirigidaPor || "—"}
                      </span>
                      {" · "}
                      Presidida por{" "}
                      <span className="font-medium text-slate-800">
                        {agenda.presididaPor || "—"}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#1e4d8c]">
                    Frequência: {agenda.frequencia ?? "—"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
