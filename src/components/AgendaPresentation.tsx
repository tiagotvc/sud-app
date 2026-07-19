"use client";

import Link from "next/link";
import { ptBR } from "date-fns/locale";
import { formatCalendarDate } from "@/lib/date-utils";
import { OrganizacaoChamado, organizacaoLabel, parseAnuncios, parseAutoridades } from "@/lib/types";

export interface AgendaPresentationData {
  id: string;
  data: Date;
  tipo: "NORMA" | "TESTEMUNHO";
  frequencia: number | null;
  presididaPor: string | null;
  dirigidaPor: string | null;
  reconhecimentoAutoridades: string | null;
  reconhecimentoVisitantes: string | null;
  anuncios: string | null;
  regente: string | null;
  organista: string | null;
  hinoAbertura: string | null;
  primeiraOracao: string | null;
  hinoSacramental: string | null;
  primeiroOrador: string | null;
  segundoOrador: string | null;
  hinoEspecial: string | null;
  ultimoOrador: string | null;
  hinoEncerramento: string | null;
  oracaoEncerramento: string | null;
  chamados: {
    tipo: "APOIO" | "DESOBRIGACAO";
    organizacao: OrganizacaoChamado | null;
    pessoa: string;
    chamado: string;
  }[];
}

interface AgendaPresentationProps {
  agenda: AgendaPresentationData;
}

function formatAnuncioDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  return `${match[3]}/${match[2]}`;
}

function parseHymn(value: string): { number: string; title: string } {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+)\s*[-–—]?\s*(.+)$/);
  if (match) {
    return { number: match[1], title: match[2].trim() };
  }
  return { number: "", title: trimmed };
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  const hasValue = Boolean(value?.trim());

  return (
    <div className={`presentation-field ${!hasValue ? "presentation-field-empty" : ""}`}>
      <dt className="presentation-label">{label}</dt>
      <dd className={hasValue ? "presentation-value-name" : "presentation-value-empty"}>
        {hasValue ? value : "—"}
      </dd>
    </div>
  );
}

function AutoridadesField({ label, value }: { label: string; value: string | null | undefined }) {
  const autoridades = parseAutoridades(value).filter((item) => item.cargo || item.nome);
  const hasValue = autoridades.length > 0;

  return (
    <div className={`presentation-field ${!hasValue ? "presentation-field-empty" : ""}`}>
      <dt className="presentation-label">{label}</dt>
      {hasValue ? (
        <dd className="mt-1 space-y-1">
          {autoridades.map((item, index) => (
            <div key={index} className="presentation-autoridade">
              {item.cargo && <span className="presentation-autoridade-cargo">{item.cargo}</span>}
              {item.nome && <span className="presentation-value-name">{item.nome}</span>}
            </div>
          ))}
        </dd>
      ) : (
        <dd className="presentation-value-empty">—</dd>
      )}
    </div>
  );
}

function HymnField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  const hasValue = Boolean(value?.trim());
  const hymn = hasValue ? parseHymn(value!) : null;

  return (
    <div
      className={`presentation-field presentation-hymn ${!hasValue ? "presentation-hymn-empty" : ""}`}
    >
      <div className="presentation-hymn-header">
        <span className="presentation-hymn-icon" aria-hidden>
          ♪
        </span>
        <dt className="presentation-label">{label}</dt>
      </div>
      {hasValue && hymn ? (
        <dd className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {hymn.number && (
            <span className="presentation-hymn-number">{hymn.number}</span>
          )}
          <span className="presentation-hymn-title">
            {hymn.number ? hymn.title : value}
          </span>
        </dd>
      ) : (
        <dd className="presentation-value-empty mt-1">Não informado</dd>
      )}
    </div>
  );
}

export function AgendaPresentation({ agenda }: AgendaPresentationProps) {
  const dayLabel = formatCalendarDate(agenda.data, "EEE", { locale: ptBR }).toUpperCase();
  const dayNumber = formatCalendarDate(agenda.data, "d");
  const isTestimonyMeeting = agenda.tipo === "TESTEMUNHO";
  const releases = agenda.chamados.filter((item) => item.tipo === "DESOBRIGACAO");
  const sustainings = agenda.chamados.filter((item) => item.tipo === "APOIO");
  const anuncios = parseAnuncios(agenda.anuncios);

  return (
    <div className="presentation-root">
      <header className="presentation-header">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="ala-day-sidebar rounded-md">
              <span className="ala-day-sidebar-label">{dayLabel}</span>
              <span className="ala-day-sidebar-value">{dayNumber}</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#f0ddb8]">
                A Igreja de Jesus Cristo dos Santos dos Últimos Dias
              </p>
              <h1 className="font-display mt-0.5 text-xl font-bold text-white md:text-2xl">
                Agenda Sacramental
                <span className="font-script ml-2 text-base font-normal text-[#f0ddb8] md:text-lg">
                  Ala Novo Hamburgo
                </span>
              </h1>
              <p className="mt-1.5 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-text-muted">
                {isTestimonyMeeting ? "Reunião de testemunhos" : "Reunião dominical"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-5 md:border-r md:border-white/20 md:pr-4">
              <div>
                <p className="presentation-header-stat-label">Data</p>
                <p className="presentation-header-stat-value">
                  {formatCalendarDate(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="presentation-header-stat-label">Frequência</p>
                <p className="presentation-header-stat-value-gold">
                  {agenda.frequencia != null ? agenda.frequencia : "—"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/bispado/agendas-sacramentais/${agenda.id}`} className="presentation-btn">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                </svg>
                Editar
              </Link>
              <Link href="/bispado/agendas-sacramentais" className="presentation-btn">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m9 0-3-3m3 3-3 3" />
                </svg>
                Sair
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="presentation-body">
        <section className="presentation-section">
          <h2 className="presentation-section-title">Abertura</h2>
          <dl className="presentation-grid-2col">
            <Field label="Presidida por" value={agenda.presididaPor} />
            <Field label="Dirigida por" value={agenda.dirigidaPor} />
            <AutoridadesField label="Reconhecimento de autoridades" value={agenda.reconhecimentoAutoridades} />
            <Field label="Visitantes ou novos membros" value={agenda.reconhecimentoVisitantes} />
          </dl>
          <div className="mt-5">
            <h3 className="presentation-label mb-2">Anúncios</h3>
            {anuncios.length > 0 ? (
              <ul className="presentation-anuncios-list">
                {anuncios.map((item, index) => (
                  <li key={index} className="presentation-anuncio">
                    <span className="presentation-anuncio-icon" aria-hidden>
                      📣
                    </span>
                    <div className="presentation-anuncio-body">
                      <span className="presentation-anuncio-texto">{item.texto}</span>
                      {(item.data || item.hora || item.local) && (
                        <div className="presentation-anuncio-meta">
                          {(item.data || item.hora) && (
                            <span className="presentation-anuncio-when">
                              <span aria-hidden>🗓️</span>
                              {[item.data && formatAnuncioDate(item.data), item.hora]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          )}
                          {item.local && (
                            <span className="presentation-anuncio-local">
                              <span aria-hidden>📍</span> {item.local}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="presentation-field presentation-field-empty presentation-value-empty px-4 py-3">
                Nenhum anúncio registrado
              </p>
            )}
          </div>
          <dl className="presentation-grid mt-5">
            <Field label="Regente" value={agenda.regente} />
            <Field label="Organista" value={agenda.organista} />
            <HymnField label="Hino de abertura" value={agenda.hinoAbertura} />
            <Field label="1ª Oração" value={agenda.primeiraOracao} />
          </dl>
        </section>

        <section className="presentation-section">
          <h2 className="presentation-section-title">
            Chamados, apoios, desobrigações, votos de plena aceitação
          </h2>
          {agenda.chamados.length > 0 ? (
            <div className="presentation-chamados-grid">
              {releases.length > 0 && (
                <div className="presentation-chamados-group presentation-chamados-release">
                  <h3><span aria-hidden="true">↓</span> Desobrigações</h3>
                  <ul>
                    {releases.map((item, index) => (
                      <li key={`${item.pessoa}-${index}`} className="presentation-chamado">
                        <strong>{item.pessoa}</strong>
                        <span className="presentation-chamado-meta">
                          <span className="presentation-chamado-cargo">{item.chamado}</span>
                          {organizacaoLabel(item.organizacao) && (
                            <span className="presentation-chamado-org">
                              {organizacaoLabel(item.organizacao)}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sustainings.length > 0 && (
                <div className="presentation-chamados-group presentation-chamados-support">
                  <h3><span aria-hidden="true">↑</span> Apoios</h3>
                  <ul>
                    {sustainings.map((item, index) => (
                      <li key={`${item.pessoa}-${index}`} className="presentation-chamado">
                        <strong>{item.pessoa}</strong>
                        <span className="presentation-chamado-meta">
                          <span className="presentation-chamado-cargo">{item.chamado}</span>
                          {organizacaoLabel(item.organizacao) && (
                            <span className="presentation-chamado-org">
                              {organizacaoLabel(item.organizacao)}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="presentation-field presentation-field-empty presentation-value-empty px-4 py-3">
              Nenhum chamado registrado
            </p>
          )}
        </section>

        <section className="presentation-section">
          <h2 className="presentation-section-title">Sacramento</h2>
          <dl className="presentation-grid">
            <HymnField label="Hino sacramental" value={agenda.hinoSacramental} />
          </dl>
        </section>

        {!isTestimonyMeeting && (
          <section className="presentation-section">
            <h2 className="presentation-section-title">Discursos — 1ª parte</h2>
            <dl className="presentation-grid">
              <Field label="1º Orador(a)" value={agenda.primeiroOrador} />
              <Field label="2º Orador(a)" value={agenda.segundoOrador} />
              <HymnField label="Hino especial (intervalo)" value={agenda.hinoEspecial} />
            </dl>
          </section>
        )}

        <section className="presentation-section">
          <h2 className="presentation-section-title">
            {isTestimonyMeeting ? "Encerramento" : "Último orador e encerramento"}
          </h2>
          <dl className="presentation-grid">
            {!isTestimonyMeeting && <Field label="Último orador(a)" value={agenda.ultimoOrador} />}
            <HymnField label="Hino de encerramento" value={agenda.hinoEncerramento} />
            <Field label="Oração de encerramento" value={agenda.oracaoEncerramento} />
          </dl>
        </section>
      </div>
    </div>
  );
}
