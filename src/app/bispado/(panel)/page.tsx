import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export default async function BispadoDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/bispado/login");
  }

  const role = session.user.role;
  const isBispado = role === UserRole.BISPADO;
  const podeComunicacao = role === UserRole.BISPADO || role === UserRole.ADMIN;
  const podeEntrevistas =
    role === UserRole.BISPADO || role === UserRole.CONSELHEIRO || role === UserRole.ADMIN;

  const [agendaCount, ultimaAgenda] = isBispado
    ? await Promise.all([
        prisma.agenda.count(),
        prisma.agenda.findFirst({
          orderBy: { data: "desc" },
          select: { data: true, dirigidaPor: true, frequencia: true },
        }),
      ])
    : [0, null];

  return (
    <div className="page-shell space-y-8">
      <div>
        <p className="text-eyebrow">Bem-vindo</p>
        <h1 className="text-page-title mt-1">Olá, {session.user.name}</h1>
        <p className="font-script mt-1 text-2xl text-brand-gold-dark">Ala Novo Hamburgo</p>
        <p className="mt-2 text-brand-text-muted">Painel administrativo da ala.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isBispado && (
          <Link href="/bispado/agendas-sacramentais">
            <Card hover className="h-full">
              <CardBody>
                <span className="text-2xl text-brand-gold">✦</span>
                <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                  Agendas Sacramentais
                </h2>
                <p className="mt-2 text-sm text-brand-text-muted">
                  {agendaCount === 0
                    ? "Nenhuma agenda registrada."
                    : `${agendaCount} agenda${agendaCount !== 1 ? "s" : ""} registrada${agendaCount !== 1 ? "s" : ""}.`}
                </p>
                {ultimaAgenda && (
                  <p className="mt-3 text-xs text-brand-text-muted">
                    Última: {format(ultimaAgenda.data, "dd/MM/yyyy", { locale: ptBR })}
                    {ultimaAgenda.frequencia != null &&
                      ` · Frequência: ${ultimaAgenda.frequencia}`}
                  </p>
                )}
                <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                  Gerenciar →
                </span>
              </CardBody>
            </Card>
          </Link>
        )}

        {podeComunicacao && (
          <Link href="/bispado/comunicacao">
            <Card hover className="h-full">
              <CardBody>
                <span className="text-2xl text-brand-gold">◉</span>
                <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                  Comunicação
                </h2>
                <p className="mt-2 text-sm text-brand-text-muted">
                  Avisos, novidades, jornal, hino da semana e calendário público.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                  Gerenciar →
                </span>
              </CardBody>
            </Card>
          </Link>
        )}

        {podeEntrevistas && (
          <Link href="/bispado/entrevistas">
            <Card hover className="h-full">
              <CardBody>
                <span className="text-2xl text-brand-gold">🕐</span>
                <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                  Entrevistas
                </h2>
                <p className="mt-2 text-sm text-brand-text-muted">
                  Configure horários e veja entrevistas agendadas pelos membros.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                  Gerenciar →
                </span>
              </CardBody>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
