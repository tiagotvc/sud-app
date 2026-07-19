import Link from "next/link";
import { ptBR } from "date-fns/locale";
import { redirect } from "next/navigation";
import { AgendaPeriodFilter } from "@/components/agenda/AgendaPeriodFilter";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";
import { formatCalendarDate } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

type AgendaPeriod = "90" | "year" | "all";

function periodStart(period: AgendaPeriod) {
  const now = new Date();

  if (period === "all") return undefined;
  if (period === "year") return new Date(now.getFullYear(), 0, 1);

  const start = new Date(now);
  start.setDate(start.getDate() - 90);
  return start;
}

export default async function AgendasSacramentaisPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.BISPADO) {
    redirect("/bispado");
  }

  const requestedPeriod = (await searchParams).periodo;
  const period: AgendaPeriod =
    requestedPeriod === "all" || requestedPeriod === "year" ? requestedPeriod : "90";
  const start = periodStart(period);

  const agendas = await prisma.agenda.findMany({
    where: start ? { data: { gte: start } } : undefined,
    orderBy: { data: "desc" },
    include: {
      chamados: { orderBy: { ordem: "asc" } },
    },
  });

  const directedByUser = agendas.filter(
    (agenda) =>
      agenda.dirigidaPor?.localeCompare(session.user.name ?? "", "pt-BR", {
        sensitivity: "base",
      }) === 0,
  ).length;
  const highestAttendance = Math.max(0, ...agendas.map((agenda) => agenda.frequencia ?? 0));

  return (
    <div className="page-shell agenda-page">
      <div className="agenda-page-intro">
        <div>
          <p className="text-eyebrow">Bispado</p>
          <h1 className="text-page-title mt-1">Agendas Sacramentais</h1>
          <p className="mt-1 text-sm text-brand-text-muted">
            Registro das agendas de reunião sacramental da Ala Novo Hamburgo.
          </p>
        </div>
        <Link href="/bispado/agendas-sacramentais/nova" className="agenda-new-button">
          <span aria-hidden="true">+</span> Nova agenda
        </Link>
      </div>

      <div className="agenda-overview-grid">
        <section className="agenda-summary-card" aria-label="Resumo das agendas">
          <div className="agenda-card-label">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75h6M9 3.75A2.25 2.25 0 006.75 6v.75H6A2.25 2.25 0 003.75 9v9A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V9A2.25 2.25 0 0018 6.75h-.75V6A2.25 2.25 0 0015 3.75M9 3.75V6h6V3.75" />
            </svg>
            Resumo
          </div>
          <div className="agenda-stat">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z" />
            </svg>
            <span className="agenda-stat-value">{agendas.length}</span>
            <span className="agenda-stat-label">Agendas cadastradas</span>
          </div>
          <div className="agenda-stat">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.5 12a3 3 0 100-6 3 3 0 000 6zm9 0a3 3 0 100-6 3 3 0 000 6zM2.25 18.75a5.25 5.25 0 0110.5 0v.75H2.25v-.75zm9.75.75v-.75a6.7 6.7 0 00-1.15-3.75 5.25 5.25 0 018.9 3.75v.75H12z" />
            </svg>
            <span className="agenda-stat-value">{directedByUser}</span>
            <span className="agenda-stat-label">Dirigidas por você</span>
          </div>
          <div className="agenda-stat">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 18.75l4.5-4.5 3 3 6-7.5M15 9.75h3.75v3.75" />
            </svg>
            <span className="agenda-stat-value">{highestAttendance || "—"}</span>
            <span className="agenda-stat-label">Maior frequência</span>
          </div>
        </section>

        <section className="agenda-filter-card">
          <p className="agenda-card-label">Filtros</p>
          <AgendaPeriodFilter />
        </section>
      </div>

      {agendas.length === 0 ? (
        <div className="ala-card mt-6 border-dashed px-6 py-16 text-center">
          <p className="text-base font-medium text-brand-text">Nenhuma agenda neste período.</p>
          <p className="mt-1 text-sm text-brand-text-muted">
            Ajuste o filtro ou crie uma nova agenda sacramental.
          </p>
          <Link href="/bispado/agendas-sacramentais/nova" className="crm-btn-primary mt-6 inline-flex">
            Criar a primeira agenda
          </Link>
        </div>
      ) : (
        <section className="agenda-list-section">
          <p className="text-section-label">Lista de agendas</p>
          <div className="agenda-list">
            {agendas.map((agenda) => {
              const dayLabel = formatCalendarDate(agenda.data, "EEEE", { locale: ptBR }).toUpperCase();
              const dayNumber = formatCalendarDate(agenda.data, "d");
              const monthYear = formatCalendarDate(agenda.data, "MMM yyyy", { locale: ptBR }).toUpperCase();

              return (
                <div key={agenda.id} className="ala-day-row">
                  <div className="ala-day-sidebar">
                    <span className="ala-day-sidebar-label">{dayLabel}</span>
                    <span className="ala-day-sidebar-value">{dayNumber}</span>
                    <span className="ala-day-sidebar-month">{monthYear}</span>
                  </div>
                  <div className="ala-day-content">
                    <div className="agenda-row-main">
                      <p className="agenda-row-kicker">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z" />
                        </svg>
                        {agenda.tipo === "TESTEMUNHO"
                          ? "Agenda de Testemunhos"
                          : "Agenda Sacramental"}
                      </p>
                      <h2 className="agenda-row-title">
                        {formatCalendarDate(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </h2>
                      <dl className="agenda-row-people">
                        <div><dt>Dirigida por</dt><dd>{agenda.dirigidaPor || "—"}</dd></div>
                        <div><dt>Presidida por</dt><dd>{agenda.presididaPor || "—"}</dd></div>
                      </dl>
                    </div>
                    <div className="agenda-attendance">
                      <span>Frequência</span>
                      <strong>{agenda.frequencia ?? "—"}</strong>
                    </div>
                    <div className="agenda-row-actions">
                      <Link
                        href={`/bispado/agendas-sacramentais/${agenda.id}/apresentacao`}
                        className="agenda-present-button"
                        title="Modo apresentação — tela cheia para a reunião"
                      >
                        <span aria-hidden="true">▶</span> Apresentar
                      </Link>
                      <Link href={`/bispado/agendas-sacramentais/${agenda.id}`} className="agenda-edit-button">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                        </svg>
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <footer className="agenda-page-footer">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75l7.5 3v5.625c0 4.146-3.17 7.727-7.5 8.875-4.33-1.148-7.5-4.729-7.5-8.875V6.75l7.5-3zM9.75 12l1.5 1.5 3-3" />
        </svg>
        Servir a Deus e a Sua obra com excelência e amor.
        <span>Ala Novo Hamburgo</span>
      </footer>
    </div>
  );
}
