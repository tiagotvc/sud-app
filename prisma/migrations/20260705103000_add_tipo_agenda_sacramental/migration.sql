CREATE TYPE "TipoAgendaSacramental" AS ENUM ('NORMA', 'TESTEMUNHO');

ALTER TABLE "Agenda"
ADD COLUMN "tipo" "TipoAgendaSacramental" NOT NULL DEFAULT 'NORMA';
