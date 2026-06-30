import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { AdminPageHeader } from "@/components/layout/AdminBreadcrumb";
import { UserRole } from "@/generated/prisma/client";
import { podeGerenciarConselheiros } from "@/lib/entrevistas";

export const dynamic = "force-dynamic";

export default async function EntrevistasHubPage() {
  const session = await auth();
  if (!session?.user) redirect("/bispado/login");

  const podeConselheiros = podeGerenciarConselheiros(session.user.role);

  return (
    <div className="page-shell w-full">
      <AdminPageHeader
        title="Entrevistas"
        description="Configure seus horários e acompanhe as entrevistas agendadas pelos membros."
      >
        <Link
          href="/entrevistas"
          className="crm-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver página pública →
        </Link>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link href="/bispado/entrevistas/disponibilidade">
          <Card hover className="h-full">
            <CardBody>
              <span className="text-2xl text-brand-gold">🕐</span>
              <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                Minha disponibilidade
              </h2>
              <p className="mt-2 text-sm text-brand-text-muted">
                Defina os dias e horários em que você atende entrevistas.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                Configurar →
              </span>
            </CardBody>
          </Card>
        </Link>

        <Link href="/bispado/entrevistas/agenda">
          <Card hover className="h-full">
            <CardBody>
              <span className="text-2xl text-brand-gold">📋</span>
              <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                Minha agenda
              </h2>
              <p className="mt-2 text-sm text-brand-text-muted">
                Veja quem agendou entrevista com você e cancele se necessário.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-navy">
                Ver agenda →
              </span>
            </CardBody>
          </Card>
        </Link>

        {podeConselheiros && (
          <Link href="/bispado/entrevistas/conselheiros">
            <Card hover className="h-full">
              <CardBody>
                <span className="text-2xl text-brand-gold">👥</span>
                <h2 className="font-display mt-3 text-lg font-semibold text-brand-navy-dark">
                  Conselheiros
                </h2>
                <p className="mt-2 text-sm text-brand-text-muted">
                  Crie acessos para os conselheiros da ala.
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
