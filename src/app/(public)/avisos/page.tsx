import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAvisosPublicos } from "@/lib/comunicacao-public";
import { TIPO_AVISO_LABEL, tipoAvisoBadgeClass, tipoAvisoBorderClass } from "@/lib/comunicacao";
import { PublicPageHeader, PublicShell } from "@/components/layout/PublicPageHeader";

export const dynamic = "force-dynamic";

export default async function AvisosPage() {
  const avisos = await getAvisosPublicos();

  const porTipo = avisos.reduce(
    (acc, aviso) => {
      const tipo = aviso.tipo;
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(aviso);
      return acc;
    },
    {} as Record<string, typeof avisos>,
  );

  return (
    <PublicShell>
      <PublicPageHeader
        title="Avisos da ala"
        description="Comunicados, novidades, jornal e eventos."
        crumbs={[
          { href: "/calendario", label: "Início" },
          { label: "Avisos" },
        ]}
      >
        <Link href="/calendario" className="week-context-btn week-context-btn-secondary">
          Voltar ao início
        </Link>
      </PublicPageHeader>

      {avisos.length === 0 ? (
        <div className="public-card px-6 py-12 text-center">
          <span className="text-3xl text-brand-gold">◉</span>
          <p className="font-display mt-4 text-lg font-semibold text-brand-navy-dark">
            Nenhum aviso publicado no momento
          </p>
          <p className="mt-2 text-sm text-brand-text-muted">
            Novos comunicados aparecerão aqui quando forem publicados pela liderança.
          </p>
          <Link href="/calendario" className="btn-primary mt-6 inline-flex">
            Ver calendário semanal
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(porTipo).map(([tipo, lista]) => (
            <section key={tipo}>
              <h2 className="public-section-title">{TIPO_AVISO_LABEL[tipo] ?? tipo}</h2>
              <ul className="avisos-grid">
                {lista.map((aviso) => (
                  <li
                    key={aviso.id}
                    className={`public-card overflow-hidden ${tipoAvisoBorderClass(aviso.tipo)}`}
                  >
                    <div className="public-card-head">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap gap-2">
                            {aviso.destaque && <span className="ala-badge">Destaque</span>}
                            <span className={tipoAvisoBadgeClass(aviso.tipo)}>
                              {TIPO_AVISO_LABEL[aviso.tipo] ?? aviso.tipo}
                            </span>
                          </div>
                          <h3 className="font-display text-base font-semibold text-brand-navy-dark">
                            {aviso.titulo}
                          </h3>
                        </div>
                        <time className="shrink-0 text-xs text-brand-text-muted">
                          {format(
                            aviso.publicadoEm ?? aviso.createdAt,
                            "d 'de' MMMM 'de' yyyy",
                            { locale: ptBR },
                          )}
                        </time>
                      </div>
                    </div>
                    <div className="public-card-body space-y-3">
                      {aviso.conteudo && (
                        <div
                          className="prose prose-sm max-w-none text-brand-text"
                          dangerouslySetInnerHTML={{ __html: aviso.conteudo }}
                        />
                      )}
                      {aviso.linkExterno && (
                        <a
                          href={aviso.linkExterno}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex"
                        >
                          {aviso.tipo === "JORNAL" ? "Abrir jornal →" : "Abrir link →"}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PublicShell>
  );
}
