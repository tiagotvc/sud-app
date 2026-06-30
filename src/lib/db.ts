import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

/** Evita client em cache no hot reload sem os modelos novos do schema */
function isPrismaClientReady(client: PrismaClient): boolean {
  const c = client as PrismaClient & {
    conteudoSemanal?: { findFirst?: unknown };
    eventoCalendario?: { findMany?: unknown };
    aviso?: { findMany?: unknown };
    disponibilidadeEntrevista?: { findMany?: unknown };
    reservaEntrevista?: { findMany?: unknown };
  };

  return (
    typeof c.conteudoSemanal?.findFirst === "function" &&
    typeof c.eventoCalendario?.findMany === "function" &&
    typeof c.aviso?.findMany === "function" &&
    typeof c.disponibilidadeEntrevista?.findMany === "function" &&
    typeof c.reservaEntrevista?.findMany === "function"
  );
}

let prismaInstance = globalForPrisma.prisma;

if (!prismaInstance || !isPrismaClientReady(prismaInstance)) {
  prismaInstance = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
