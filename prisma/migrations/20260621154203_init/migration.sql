-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hino" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chamado" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chamado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "frequencia" INTEGER,
    "presididaPor" TEXT,
    "dirigidaPor" TEXT,
    "reconhecimentoAutoridades" TEXT,
    "reconhecimentoVisitantes" TEXT,
    "anuncios" TEXT,
    "regente" TEXT,
    "organista" TEXT,
    "hinoAbertura" TEXT,
    "primeiraOracao" TEXT,
    "hinoSacramental" TEXT,
    "primeiroOrador" TEXT,
    "segundoOrador" TEXT,
    "hinoEspecial" TEXT,
    "ultimoOrador" TEXT,
    "hinoEncerramento" TEXT,
    "oracaoEncerramento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaChamado" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "pessoa" TEXT NOT NULL,
    "chamado" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AgendaChamado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_nome_key" ON "Pessoa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Hino_numero_key" ON "Hino"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Chamado_titulo_key" ON "Chamado"("titulo");

-- AddForeignKey
ALTER TABLE "AgendaChamado" ADD CONSTRAINT "AgendaChamado_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;
