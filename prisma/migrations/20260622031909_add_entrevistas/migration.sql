-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CONSELHEIRO';

-- CreateTable
CREATE TABLE "DisponibilidadeEntrevista" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "duracaoMin" INTEGER NOT NULL DEFAULT 30,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisponibilidadeEntrevista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaEntrevista" (
    "id" TEXT NOT NULL,
    "entrevistadorId" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "nomeMembro" TEXT NOT NULL,
    "emailMembro" TEXT,
    "telefoneMembro" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReservaEntrevista_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DisponibilidadeEntrevista_usuarioId_diaSemana_idx" ON "DisponibilidadeEntrevista"("usuarioId", "diaSemana");

-- CreateIndex
CREATE INDEX "ReservaEntrevista_entrevistadorId_inicio_idx" ON "ReservaEntrevista"("entrevistadorId", "inicio");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaEntrevista_entrevistadorId_inicio_key" ON "ReservaEntrevista"("entrevistadorId", "inicio");

-- AddForeignKey
ALTER TABLE "DisponibilidadeEntrevista" ADD CONSTRAINT "DisponibilidadeEntrevista_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaEntrevista" ADD CONSTRAINT "ReservaEntrevista_entrevistadorId_fkey" FOREIGN KEY ("entrevistadorId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
