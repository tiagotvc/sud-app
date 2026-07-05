DELETE FROM "Pessoa" AS legacy
WHERE legacy."nome" ~* '^\s*(Desobrigar|Desobrigação|Apoiar|Apoio)\s*:'
  AND EXISTS (
    SELECT 1
    FROM "Pessoa" AS clean
    WHERE clean."nome" = regexp_replace(
      legacy."nome",
      '^\s*(Desobrigar|Desobrigação|Apoiar|Apoio)\s*:\s*',
      '',
      'i'
    )
  );

UPDATE "Pessoa"
SET "nome" = regexp_replace(
  "nome",
  '^\s*(Desobrigar|Desobrigação|Apoiar|Apoio)\s*:\s*',
  '',
  'i'
)
WHERE "nome" ~* '^\s*(Desobrigar|Desobrigação|Apoiar|Apoio)\s*:';
