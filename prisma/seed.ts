import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

async function main() {
  const email = process.env.SEED_BISPADO_EMAIL ?? "bispado@zionconnect.local";
  const password = process.env.SEED_BISPADO_PASSWORD ?? "bispado123";
  const nome = process.env.SEED_BISPADO_NOME ?? "Bispado";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.usuario.upsert({
    where: { email },
    update: {
      nome,
      passwordHash,
      role: "BISPADO",
      ativo: true,
    },
    create: {
      nome,
      email,
      passwordHash,
      role: "BISPADO",
      ativo: true,
    },
  });

  console.log(`Usuário Bispado seed: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
