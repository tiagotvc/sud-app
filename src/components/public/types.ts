export type CalendarioDiaPublico = {
  id: string;
  label: string;
  icon: string;
  index: number;
  eventos: string[];
};

export type ConteudoSemanalPublic = {
  mensagemBispo: string | null;
  hinoSemana: string | null;
  versiculoTexto: string | null;
  versiculoRef: string | null;
  linkJornal: string | null;
  tituloJornal: string | null;
};

export type AvisoDestaquePublic = {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  publicadoEm: string | null;
};
