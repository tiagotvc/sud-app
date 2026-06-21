import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export default async function AgendasSacramentaisPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.BISPADO) {
    redirect("/bispado");
  }

  const agendas = await prisma.agenda.findMany({
    orderBy: { data: "desc" },
    include: {
      chamados: { orderBy: { ordem: "asc" } },
    },
  });

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
            Bispado
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#0c1f3d]">Agendas Sacramentais</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registro das agendas de reunião sacramental da Ala Novo Hamburgo.
          </p>
        </div>
        <Link href="/bispado/agendas-sacramentais/nova" className="crm-btn-accent">
          + Nova agenda
        </Link>
      </div>

      {agendas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-medium text-slate-700">Nenhuma agenda registrada ainda.</p>
          <p className="mt-1 text-sm text-slate-500">
            Crie a primeira agenda sacramental da semana.
          </p>
          <Link
            href="/bispado/agendas-sacramentais/nova"
            className="crm-btn-primary mt-6 inline-flex"
          >
            Criar a primeira agenda
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {agendas.length} {agendas.length === 1 ? "agenda" : "agendas"}
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {agendas.map((agenda) => (
              <li
                key={agenda.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50/80"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a3a6b]">
                    Agenda Sacramental
                  </p>
                  <h2 className="mt-0.5 text-base font-semibold capitalize text-slate-900">
                    {format(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Dirigida por{" "}
                    <span className="font-medium text-slate-800">
                      {agenda.dirigidaPor || "—"}
                    </span>
                    {" · "}
                    Presidida por{" "}
                    <span className="font-medium text-slate-800">
                      {agenda.presididaPor || "—"}
                    </span>
                    {" · "}
                    Frequência:{" "}
                    <span className="font-medium text-slate-800">
                      {agenda.frequencia ?? "—"}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/bispado/agendas-sacramentais/${agenda.id}/apresentacao`}
                    className="crm-btn-primary"
                    title="Modo apresentação — tela cheia para a reunião"
                  >
                    ▶ Apresentar
                  </Link>
                  <Link
                    href={`/bispado/agendas-sacramentais/${agenda.id}`}
                    className="crm-btn"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
