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
    redirect("/login");
  }

  const isBispado = session.user.role === UserRole.BISPADO;

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
        <p className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
          Bem-vindo
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[#0c1f3d]">
          Olá, {session.user.name}
        </h1>
        <p className="mt-2 text-slate-600">
          Painel administrativo da Ala Novo Hamburgo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isBispado && (
          <Link href="/bispado/agendas-sacramentais">
            <Card hover className="h-full">
              <CardBody>
                <span className="text-2xl text-[#c9a227]">✦</span>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  Agendas Sacramentais
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {agendaCount === 0
                    ? "Nenhuma agenda registrada."
                    : `${agendaCount} agenda${agendaCount !== 1 ? "s" : ""} registrada${agendaCount !== 1 ? "s" : ""}.`}
                </p>
                {ultimaAgenda && (
                  <p className="mt-3 text-xs text-slate-500">
                    Última:{" "}
                    {format(ultimaAgenda.data, "dd/MM/yyyy", { locale: ptBR })}
                    {ultimaAgenda.frequencia != null &&
                      ` · Frequência: ${ultimaAgenda.frequencia}`}
                  </p>
                )}
                <span className="mt-4 inline-block text-sm font-semibold text-[#1a3a6b]">
                  Gerenciar →
                </span>
              </CardBody>
            </Card>
          </Link>
        )}

        <Card className="h-full opacity-60">
          <CardBody>
            <span className="text-2xl text-slate-400">◉</span>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">Avisos</h2>
            <p className="mt-2 text-sm text-slate-600">
              Publicação de comunicados para a ala.
            </p>
            <span className="mt-4 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Em breve
            </span>
          </CardBody>
        </Card>

        <Card className="h-full opacity-60">
          <CardBody>
            <span className="text-2xl text-slate-400">⚙</span>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">Configurações</h2>
            <p className="mt-2 text-sm text-slate-600">
              Gestão de usuários e preferências.
            </p>
            <span className="mt-4 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Em breve
            </span>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
