-- CreateEnum
CREATE TYPE "ModoEntrevista" AS ENUM ('PRESENCIAL', 'ONLINE');

-- AlterTable
ALTER TABLE "ReservaEntrevista" ADD COLUMN "modoEntrevista" "ModoEntrevista" NOT NULL DEFAULT 'PRESENCIAL';
