import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1f3d]/5 via-transparent to-[#c9a227]/5" />
        <div className="relative mx-auto w-full px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c9a227]">
              Ala Novo Hamburgo
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0c1f3d] sm:text-5xl lg:text-6xl">
              Organize a ala com{" "}
              <span className="bg-gradient-to-r from-[#1a3a6b] to-[#c9a227] bg-clip-text text-transparent">
                Zion Connect
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Plataforma interna para gestão da ala — avisos, organização e ferramentas
              administrativas em um só lugar.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/login" className="btn-primary">
                Entrar no painel
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full px-4 pb-20 sm:px-6 lg:px-10">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-500">
          Recursos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card hover>
            <CardBody>
              <span className="text-2xl text-[#c9a227]">◉</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Avisos</h3>
              <p className="mt-2 text-sm text-slate-600">
                Comunicados e anúncios da ala para todos os membros.
              </p>
              <span className="mt-4 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Em breve
              </span>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody>
              <span className="text-2xl text-[#1a3a6b]">✦</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Agendas Sacramentais</h3>
              <p className="mt-2 text-sm text-slate-600">
                Criação e registro de agendas de reunião sacramental.
              </p>
              <span className="mt-4 inline-block rounded-full bg-[#0c1f3d]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1a3a6b]">
                Acesso Bispado
              </span>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody>
              <span className="text-2xl text-[#1a3a6b]">◈</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Painel Admin</h3>
              <p className="mt-2 text-sm text-slate-600">
                Ferramentas internas para liderança e organização da ala.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block text-sm font-semibold text-[#1a3a6b] hover:underline"
              >
                Acessar →
              </Link>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-[#0c1f3d]">Sobre o Zion Connect</h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            O Zion Connect é uma ferramenta independente criada para ajudar na organização
            interna da Ala Novo Hamburgo. Não possui vínculo oficial com a instituição
            religiosa — é apenas um meio prático de centralizar informações e processos da ala.
          </p>
        </div>
      </section>
    </>
  );
}
