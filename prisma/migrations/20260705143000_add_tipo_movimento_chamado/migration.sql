CREATE TYPE "TipoMovimentoChamado" AS ENUM ('APOIO', 'DESOBRIGACAO');

ALTER TABLE "AgendaChamado"
ADD COLUMN "tipo" "TipoMovimentoChamado" NOT NULL DEFAULT 'APOIO';

UPDATE "AgendaChamado"
SET
  "tipo" = 'DESOBRIGACAO',
  "pessoa" = regexp_replace(
    "pessoa",
    '^\s*(Desobrigar|Desobrigação)\s*:\s*',
    '',
    'i'
  )
WHERE "pessoa" ~* '^\s*(Desobrigar|Desobrigação)\s*:';

UPDATE "AgendaChamado"
SET "pessoa" = regexp_replace("pessoa", '^\s*(Apoiar|Apoio)\s*:\s*', '', 'i')
WHERE "pessoa" ~* '^\s*(Apoiar|Apoio)\s*:';
