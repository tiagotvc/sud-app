/** Calendário semanal — Ala Novo Hamburgo (baseado no cartaz oficial) */

export type EventoCalendarioSeed = {
  diaSemana: number;
  titulo: string;
  horario?: string | null;
  ordem: number;
};

export const NOTAS_CALENDARIO = [
  "* Confira os horários das Aulas do Instituto no Instagram @instituto_canoas",
  "** Precisamos de voluntários do Sacerdócio de Melquisedeque para acompanhar as aulas do English Connect.",
  "Consulte os líderes de organização para locais e detalhes atualizados.",
];

/** Eventos da semana conforme calendário da ala */
export const EVENTOS_SEMANA_ALA: EventoCalendarioSeed[] = [
  {
    diaSemana: 0,
    titulo: "Reunião sacramental",
    horario: "9h",
    ordem: 0,
  },
  {
    diaSemana: 2,
    titulo: "Aula do Seminário On-line – Sacerdócio Aarônico e Moças (14-17 anos)",
    horario: "19:30 - 20:30",
    ordem: 0,
  },
  {
    diaSemana: 2,
    titulo: "Aula do Instituto * – Jovens Adultos (18-35 anos)",
    ordem: 1,
  },
  {
    diaSemana: 3,
    titulo: "Aula do Instituto * – Jovens Adultos (18-35 anos)",
    ordem: 0,
  },
  {
    diaSemana: 3,
    titulo: "English Connect ** – Turma Adultos e Teen",
    horario: "19:30 - 21h",
    ordem: 1,
  },
  {
    diaSemana: 3,
    titulo: "Ensaio do Coral da Ala",
    horario: "20 - 21h",
    ordem: 2,
  },
  {
    diaSemana: 4,
    titulo: "Aula do Instituto * – Jovens Adultos (18-35 anos)",
    ordem: 0,
  },
  {
    diaSemana: 4,
    titulo: "English Connect **",
    horario: "19:30 - 21h",
    ordem: 1,
  },
  {
    diaSemana: 5,
    titulo: "Aula do Seminário – Moças e Sacerdócio Aarônico (14-17 anos)",
    horario: "19:30 - 20:30",
    ordem: 0,
  },
  {
    diaSemana: 5,
    titulo: "Aula do Instituto * – Jovens Adultos (18-35 anos)",
    ordem: 1,
  },
  {
    diaSemana: 6,
    titulo: "São João da Ala – Todos convidados",
    horario: "15h",
    ordem: 0,
  },
  {
    diaSemana: 6,
    titulo: "Aulas do Instituto * – Jovens Adultos (18-35 anos)",
    ordem: 1,
  },
];
