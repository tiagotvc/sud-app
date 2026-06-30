import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { TIPO_AVISO_LABEL } from "@/lib/comunicacao";

export const dynamic = "force-dynamic";

export default async function AvisosAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/bispado/login");

  const avisos = await prisma.aviso.findMany({
    orderBy: [{ publicado: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/bispado/comunicacao" className="crm-btn-ghost -ml-3">
            ← Comunicação
          </Link>
          <h1 className="text-page-title mt-2">Avisos e novidades</h1>
          <p className="mt-1 text-sm text-brand-text-muted">
            Publicados na área de avisos e destaques do calendário.
          </p>
        </div>
        <Link href="/bispado/comunicacao/avisos/nova" className="crm-btn-accent">
          + Novo aviso
        </Link>
      </div>

      {avisos.length === 0 ? (
        <div className="ala-card px-6 py-12 text-center">
          <p className="text-brand-text-muted">Nenhum aviso criado ainda.</p>
          <Link href="/bispado/comunicacao/avisos/nova" className="crm-btn-primary mt-4 inline-flex">
            Criar primeiro aviso
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-brand-border rounded-md border border-brand-border bg-white">
          {avisos.map((aviso) => (
            <li
              key={aviso.id}
              className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 hover:bg-brand-cream-warm"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ala-badge">{TIPO_AVISO_LABEL[aviso.tipo]}</span>
                  {!aviso.publicado && (
                    <span className="ala-badge-muted">Rascunho</span>
                  )}
                  {aviso.destaque && <span className="ala-badge">Destaque</span>}
                </div>
                <h2 className="font-display mt-1 font-semibold text-brand-navy-dark">
                  {aviso.titulo}
                </h2>
                <p className="text-xs text-brand-text-muted">
                  {format(aviso.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <Link href={`/bispado/comunicacao/avisos/${aviso.id}`} className="crm-btn">
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
