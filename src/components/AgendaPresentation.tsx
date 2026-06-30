"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface AgendaPresentationData {
  id: string;
  data: Date;
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
  chamados: { pessoa: string; chamado: string }[];
}

interface AgendaPresentationProps {
  agenda: AgendaPresentationData;
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
  const dayLabel = format(agenda.data, "EEE", { locale: ptBR }).toUpperCase();
  const dayNumber = format(agenda.data, "d");

  return (
    <div className="presentation-root">
      <header className="presentation-header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="ala-day-sidebar rounded-md">
              <span className="ala-day-sidebar-label">{dayLabel}</span>
              <span className="ala-day-sidebar-value">{dayNumber}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f0ddb8]">
                A Igreja de Jesus Cristo dos Santos dos Últimos Dias
              </p>
              <h1 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
                Agenda Sacramental
              </h1>
              <p className="font-script mt-1 text-2xl text-[#f0ddb8]">Ala Novo Hamburgo</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/bispado/agendas-sacramentais/${agenda.id}`} className="presentation-btn">
              Editar
            </Link>
            <Link href="/bispado/agendas-sacramentais" className="presentation-btn">
              Sair
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-8 border-t border-white/20 pt-4">
          <div>
            <p className="presentation-header-stat-label">Data</p>
            <p className="presentation-header-stat-value">
              {format(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <div>
            <p className="presentation-header-stat-label">Frequência</p>
            <p className="presentation-header-stat-value-gold">
              {agenda.frequencia != null ? agenda.frequencia : "—"}
            </p>
          </div>
        </div>
      </header>

      <div className="presentation-body">
        <section className="presentation-section">
          <h2 className="presentation-section-title">Abertura</h2>
          <dl className="presentation-grid">
            <Field label="Presidida por" value={agenda.presididaPor} />
            <Field label="Dirigida por" value={agenda.dirigidaPor} />
            <Field label="Reconhecimento de autoridades" value={agenda.reconhecimentoAutoridades} />
            <Field label="Visitantes ou novos membros" value={agenda.reconhecimentoVisitantes} />
            <Field label="Regente" value={agenda.regente} />
            <Field label="Organista" value={agenda.organista} />
            <HymnField label="Hino de abertura" value={agenda.hinoAbertura} />
            <Field label="1ª Oração" value={agenda.primeiraOracao} />
          </dl>
          <div className="mt-4">
            <h3 className="presentation-label mb-2">Anúncios</h3>
            {agenda.anuncios?.trim() ? (
              <div
                className="presentation-announcements prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: agenda.anuncios }}
              />
            ) : (
              <p className="presentation-field presentation-field-empty presentation-value-empty px-4 py-3">
                Nenhum anúncio registrado
              </p>
            )}
          </div>
        </section>

        <section className="presentation-section">
          <h2 className="presentation-section-title">
            Chamados, apoios, desobrigações, votos de plena aceitação
          </h2>
          {agenda.chamados.length > 0 ? (
            <ul className="space-y-2">
              {agenda.chamados.map((item, index) => (
                <li key={index} className="presentation-chamado">
                  <span className="font-display font-semibold text-brand-navy-dark">
                    {item.pessoa}
                  </span>
                  <span className="text-brand-text-muted"> — </span>
                  <span className="text-brand-text">{item.chamado}</span>
                </li>
              ))}
            </ul>
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

        <section className="presentation-section">
          <h2 className="presentation-section-title">Discursos — 1ª parte</h2>
          <dl className="presentation-grid">
            <Field label="1º Orador(a)" value={agenda.primeiroOrador} />
            <Field label="2º Orador(a)" value={agenda.segundoOrador} />
            <HymnField label="Hino especial (intervalo)" value={agenda.hinoEspecial} />
          </dl>
        </section>

        <section className="presentation-section">
          <h2 className="presentation-section-title">Último orador e encerramento</h2>
          <dl className="presentation-grid">
            <Field label="Último orador(a)" value={agenda.ultimoOrador} />
            <HymnField label="Hino de encerramento" value={agenda.hinoEncerramento} />
            <Field label="Oração de encerramento" value={agenda.oracaoEncerramento} />
          </dl>
        </section>
      </div>
    </div>
  );
}
