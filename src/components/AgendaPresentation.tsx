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

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <div className="presentation-field">
      <dt className="presentation-label">{label}</dt>
      <dd className="presentation-value">{value}</dd>
    </div>
  );
}

function HymnField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <div className="presentation-field presentation-hymn">
      <dt className="presentation-label">{label}</dt>
      <dd className="presentation-value">{value}</dd>
    </div>
  );
}

export function AgendaPresentation({ agenda }: AgendaPresentationProps) {
  return (
    <div className="presentation-root min-h-screen bg-white text-slate-900">
      <header className="presentation-header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              A Igreja de Jesus Cristo dos Santos dos Últimos Dias
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Agenda Sacramental
            </h1>
            <p className="mt-1 text-sm text-blue-100">Ala Novo Hamburgo</p>
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

        <div className="mt-6 flex flex-wrap gap-6 border-t border-white/20 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200">Data</p>
            <p className="mt-1 text-lg font-semibold capitalize text-white">
              {format(agenda.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          {agenda.frequencia != null && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200">
                Frequência
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{agenda.frequencia}</p>
            </div>
          )}
        </div>
      </header>

      <div className="presentation-body mx-auto max-w-5xl px-6 py-8 md:px-10">
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
          {agenda.anuncios && (
            <div className="mt-4">
              <h3 className="presentation-label mb-2">Anúncios</h3>
              <div
                className="presentation-announcements prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: agenda.anuncios }}
              />
            </div>
          )}
        </section>

        {agenda.chamados.length > 0 && (
          <section className="presentation-section">
            <h2 className="presentation-section-title">
              Chamados, apoios, desobrigações, votos de plena aceitação
            </h2>
            <ul className="space-y-2">
              {agenda.chamados.map((item, index) => (
                <li key={index} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="font-semibold text-slate-900">{item.pessoa}</span>
                  <span className="text-slate-500"> — </span>
                  <span className="text-slate-700">{item.chamado}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

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
