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
          <p className="text-eyebrow">Bispado</p>
          <h1 className="text-page-title mt-1">Agendas Sacramentais</h1>
          <p className="mt-1 text-sm text-brand-text-muted">
            Registro das agendas de reunião sacramental da Ala Novo Hamburgo.
          </p>
        </div>
        <Link href="/bispado/agendas-sacramentais/nova" className="crm-btn-accent">
          + Nova agenda
        </Link>
      </div>

      {agendas.length === 0 ? (
        <div className="ala-card border-dashed px-6 py-16 text-center">
          <p className="text-base font-medium text-brand-text">Nenhuma agenda registrada ainda.</p>
          <p className="mt-1 text-sm text-brand-text-muted">
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
        <div className="space-y-3">
          <p className="text-section-label">
            {agendas.length} {agendas.length === 1 ? "agenda" : "agendas"}
          </p>
          {agendas.map((agenda) => {
            const dayLabel = format(agenda.data, "EEE", { locale: ptBR }).toUpperCase();
            const dayNumber = format(agenda.data, "d");

            return (
              <div key={agenda.id} className="ala-day-row">
                <div className="ala-day-sidebar">
                  <span className="ala-day-sidebar-label">{dayLabel}</span>
                  <span className="ala-day-sidebar-value">{dayNumber}</span>
                </div>
                <div className="ala-day-content flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-section-label">Agenda Sacramental</p>
                    <h2 className="font-display mt-0.5 text-base font-semibold capitalize text-brand-navy-dark">
                      {format(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </h2>
                    <p className="mt-1 text-sm text-brand-text-muted">
                      Dirigida por{" "}
                      <span className="font-medium text-brand-text">
                        {agenda.dirigidaPor || "—"}
                      </span>
                      {" · "}
                      Presidida por{" "}
                      <span className="font-medium text-brand-text">
                        {agenda.presididaPor || "—"}
                      </span>
                      {" · "}
                      Frequência:{" "}
                      <span className="font-medium text-brand-text">
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
