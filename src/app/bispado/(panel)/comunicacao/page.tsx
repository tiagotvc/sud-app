import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ComunicacaoPage() {
  const session = await auth();
  if (!session?.user) redirect("/bispado/login");

  const [totalAvisos, publicados, eventos] = await Promise.all([
    prisma.aviso.count(),
    prisma.aviso.count({ where: { publicado: true } }),
    prisma.eventoCalendario.count({ where: { ativo: true } }),
  ]);

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="text-eyebrow">Comunicação</p>
        <h1 className="text-page-title mt-1">Conteúdo público da ala</h1>
        <p className="mt-1 text-sm text-brand-text-muted">
          Gerencie avisos, destaques semanais, hino da semana, mensagem do bispo e calendário.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/bispado/comunicacao/avisos">
          <Card hover className="h-full">
            <CardBody>
              <span className="text-2xl text-brand-gold">◉</span>
              <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                Avisos e novidades
              </h2>
              <p className="mt-2 text-sm text-brand-text-muted">
                {publicados} publicado{publicados !== 1 ? "s" : ""} de {totalAvisos} total
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                Gerenciar →
              </span>
            </CardBody>
          </Card>
        </Link>

        <Link href="/bispado/comunicacao/semana">
          <Card hover className="h-full">
            <CardBody>
              <span className="text-2xl text-brand-navy">✦</span>
              <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                Semana e calendário
              </h2>
              <p className="mt-2 text-sm text-brand-text-muted">
                Hino da semana, mensagem do bispo, versículo, jornal e {eventos} evento
                {eventos !== 1 ? "s" : ""} no calendário.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                Editar →
              </span>
            </CardBody>
          </Card>
        </Link>

        <Link href="/calendario" target="_blank">
          <Card hover className="h-full">
            <CardBody>
              <span className="text-2xl text-brand-navy">👁</span>
              <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                Ver site público
              </h2>
              <p className="mt-2 text-sm text-brand-text-muted">
                Abrir calendário semanal como os membros veem.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                Abrir →
              </span>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
}
