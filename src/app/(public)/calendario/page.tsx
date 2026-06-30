import {
  getAvisosDestaque,
  getConteudoSemanaAtual,
  getEventosCalendarioPublico,
} from "@/lib/comunicacao-public";
import { formatSemanaLabel, getSemanaRange } from "@/components/public/CalendarioLista";
import { CalendarioHome } from "@/components/public/CalendarioHome";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const [conteudo, avisosDestaque, dias] = await Promise.all([
    getConteudoSemanaAtual(),
    getAvisosDestaque(),
    getEventosCalendarioPublico(),
  ]);

  const { inicio, fim } = getSemanaRange();
  const semanaLabel = formatSemanaLabel(inicio, fim);

  return (
    <>
      <CalendarioHome
        dias={dias}
        semanaLabel={semanaLabel}
        conteudo={
          conteudo
            ? {
                mensagemBispo: conteudo.mensagemBispo,
                hinoSemana: conteudo.hinoSemana,
                versiculoTexto: conteudo.versiculoTexto,
                versiculoRef: conteudo.versiculoRef,
                linkJornal: conteudo.linkJornal,
                tituloJornal: conteudo.tituloJornal,
              }
            : null
        }
        avisosDestaque={avisosDestaque.map((aviso) => ({
          id: aviso.id,
          titulo: aviso.titulo,
          conteudo: aviso.conteudo,
          tipo: aviso.tipo,
          publicadoEm: aviso.publicadoEm?.toISOString() ?? null,
        }))}
      />
    </>
  );
}
