-- CreateEnum
CREATE TYPE "TipoAviso" AS ENUM ('AVISO', 'NOVIDADE', 'JORNAL', 'EVENTO');

-- CreateTable
CREATE TABLE "Aviso" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoAviso" NOT NULL DEFAULT 'AVISO',
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "linkExterno" TEXT,
    "publicadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aviso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConteudoSemanal" (
    "id" TEXT NOT NULL,
    "semanaInicio" TIMESTAMP(3) NOT NULL,
    "mensagemBispo" TEXT,
    "hinoSemana" TEXT,
    "versiculoTexto" TEXT,
    "versiculoRef" TEXT,
    "linkJornal" TEXT,
    "tituloJornal" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConteudoSemanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoCalendario" (
    "id" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "horario" TEXT,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventoCalendario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConteudoSemanal_semanaInicio_key" ON "ConteudoSemanal"("semanaInicio");

-- CreateIndex
CREATE INDEX "EventoCalendario_diaSemana_ordem_idx" ON "EventoCalendario"("diaSemana", "ordem");
