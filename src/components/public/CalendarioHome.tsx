"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { TIPO_AVISO_LABEL, tipoAvisoBadgeClass } from "@/lib/comunicacao";
import { CalendarioLista, getSemanaRange } from "@/components/public/CalendarioLista";
import { CalendarioModal } from "@/components/public/CalendarioModal";
import type {
  AvisoDestaquePublic,
  CalendarioDiaPublico,
  ConteudoSemanalPublic,
} from "@/components/public/types";

interface CalendarioHomeProps {
  dias: CalendarioDiaPublico[];
  conteudo: ConteudoSemanalPublic | null;
  avisosDestaque: AvisoDestaquePublic[];
  semanaLabel: string;
}

function parseHymn(value: string) {
  const match = value.trim().match(/^(\d+)\s*[-–—]?\s*(.+)$/);
  if (match) return { number: match[1], title: match[2] };
  return { number: "", title: value };
}

export function CalendarioHome({
  dias,
  conteudo,
  avisosDestaque,
  semanaLabel,
}: CalendarioHomeProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { inicio: semanaInicio } = getSemanaRange();

  const hino = conteudo?.hinoSemana ? parseHymn(conteudo.hinoSemana) : null;
  const totalEventos = dias.reduce((acc, dia) => acc + dia.eventos.length, 0);

  return (
    <>
      <div className="semana-home">
        <div className="week-context-bar">
          <div>
            <h1 className="week-context-bar-title">Esta semana na ala</h1>
            <p className="week-context-bar-dates">{semanaLabel}</p>
          </div>
          <div className="week-context-bar-actions">
            <Link href="/avisos" className="week-context-btn week-context-btn-secondary">
              Avisos
            </Link>
            <Link href="/entrevistas" className="week-context-btn week-context-btn-ghost">
              Entrevistas
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="week-context-btn week-context-btn-primary"
            >
              Calendário completo
            </button>
          </div>
        </div>

        <div className="semana-home-grid">
          {/* Coluna esquerda — atividades da semana */}
          <aside className="semana-home-rail semana-home-rail-left">
            <div className="semana-rail-panel">
              <div className="semana-rail-panel-head">
                <p className="semana-rail-panel-head-label">Atividades</p>
                <p className="semana-rail-panel-head-value">
                  {totalEventos} evento{totalEventos !== 1 ? "s" : ""} esta semana
                </p>
              </div>
              <div className="semana-rail-panel-body">
                <CalendarioLista
                  dias={dias}
                  semanaInicio={semanaInicio}
                  variant="compact"
                />
              </div>
            </div>
          </aside>

          {/* Coluna central — mensagem e anúncios */}
          <main className="semana-home-main">
            <article className="semana-panel">
              <div className="panel-title-bar">
                <span className="panel-title-bar-accent" aria-hidden />
                <h2 className="panel-title-bar-text">Mensagem da liderança</h2>
              </div>
              {conteudo?.mensagemBispo ? (
                <div
                  className="semana-panel-body prose prose-sm max-w-none text-brand-text"
                  dangerouslySetInnerHTML={{ __html: conteudo.mensagemBispo }}
                />
              ) : (
                <div className="semana-panel-body">
                  <p className="text-sm text-brand-text-muted">
                    Nenhuma mensagem publicada para esta semana.
                  </p>
                </div>
              )}
            </article>

            <section className="semana-section">
              <div className="semana-section-head">
                <h2 className="text-section-label">Anúncios em destaque</h2>
              </div>

              {avisosDestaque.length > 0 ? (
                <div className="semana-anuncios-grid">
                  {avisosDestaque.map((aviso) => (
                    <article key={aviso.id} className="semana-panel">
                      <div className="semana-panel-subhead">
                        <span className={tipoAvisoBadgeClass(aviso.tipo)}>
                          {TIPO_AVISO_LABEL[aviso.tipo] ?? aviso.tipo}
                        </span>
                        {aviso.publicadoEm && (
                          <time className="text-xs text-brand-text-muted">
                            {format(new Date(aviso.publicadoEm), "d 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </time>
                        )}
                      </div>
                      <h3 className="font-display px-4 pt-3 text-base font-semibold text-brand-navy-dark">
                        {aviso.titulo}
                      </h3>
                      {aviso.conteudo && (
                        <div
                          className="semana-panel-body prose prose-sm max-w-none text-brand-text"
                          dangerouslySetInnerHTML={{ __html: aviso.conteudo }}
                        />
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="semana-panel">
                  <div className="semana-panel-body text-sm text-brand-text-muted">
                    Nenhum anúncio em destaque.{" "}
                    <Link href="/avisos" className="font-semibold text-brand-navy hover:underline">
                      Ver todos os avisos
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </main>

          {/* Coluna direita — hino, versículo, jornal */}
          <aside className="semana-home-rail semana-home-rail-right">
            <div className="semana-rail-stack">
              {hino ? (
                <article className="semana-side-card semana-side-card-hymn">
                  <p className="semana-side-card-label">Hino da semana</p>
                  <div className="semana-side-card-body text-center">
                    {hino.number && (
                      <p className="font-display mt-2 text-4xl font-bold text-brand-navy">{hino.number}</p>
                    )}
                    <p className="mt-2 text-sm font-medium leading-snug text-brand-text">
                      {hino.title}
                    </p>
                  </div>
                </article>
              ) : (
                <article className="semana-side-card semana-side-card-empty">
                  <p className="text-center text-xs text-brand-text-muted">
                    Hino da semana em breve
                  </p>
                </article>
              )}

              {conteudo?.versiculoTexto ? (
                <article className="semana-side-card semana-side-card-verse flex-1">
                  <p className="semana-side-card-label">Versículo da semana</p>
                  <blockquote className="font-display mt-3 text-center text-sm italic leading-relaxed text-brand-navy-dark">
                    &ldquo;{conteudo.versiculoTexto}&rdquo;
                  </blockquote>
                  {conteudo.versiculoRef && (
                    <p className="mt-3 text-center text-xs font-bold uppercase tracking-wide text-brand-gold-dark">
                      {conteudo.versiculoRef}
                    </p>
                  )}
                </article>
              ) : (
                <article className="semana-side-card semana-side-card-empty flex-1">
                  <p className="text-center text-xs text-brand-text-muted">
                    Versículo da semana em breve
                  </p>
                </article>
              )}

              {conteudo?.linkJornal && (
                <article className="semana-side-card semana-side-card-jornal">
                  <p className="semana-side-card-label">Jornal / Boletim</p>
                  <p className="font-display mt-2 text-sm font-semibold text-brand-navy-dark">
                    {conteudo.tituloJornal || "Edição da semana"}
                  </p>
                  <a
                    href={conteudo.linkJornal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="crm-btn-accent mt-4 w-full justify-center text-sm"
                  >
                    Abrir jornal →
                  </a>
                </article>
              )}
            </div>
          </aside>
        </div>
      </div>

      <CalendarioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dias={dias}
        semanaInicio={semanaInicio}
        semanaLabel={semanaLabel}
      />
    </>
  );
}
