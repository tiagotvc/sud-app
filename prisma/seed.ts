import "dotenv/config";
import { startOfWeek } from "date-fns";
import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma/client";
import { EVENTOS_SEMANA_ALA } from "@/lib/calendario-data";
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
      role: UserRole.BISPADO,
      ativo: true,
    },
    create: {
      nome,
      email,
      passwordHash,
      role: UserRole.BISPADO,
      ativo: true,
    },
  });

  const bispado = await prisma.usuario.findUniqueOrThrow({ where: { email } });

  const conselheirosSeed = [
    {
      email: process.env.SEED_CONSELHEIRO1_EMAIL ?? "conselheiro1@zionconnect.local",
      password: process.env.SEED_CONSELHEIRO1_PASSWORD ?? "cons123",
      nome: process.env.SEED_CONSELHEIRO1_NOME ?? "Gilberto",
    },
    {
      email: process.env.SEED_CONSELHEIRO2_EMAIL ?? "conselheiro2@zionconnect.local",
      password: process.env.SEED_CONSELHEIRO2_PASSWORD ?? "cons123",
      nome: process.env.SEED_CONSELHEIRO2_NOME ?? "Marinaldo",
    },
  ];

  const conselheiroIds: string[] = [];

  for (const c of conselheirosSeed) {
    const hash = await bcrypt.hash(c.password, 12);
    const user = await prisma.usuario.upsert({
      where: { email: c.email },
      update: { nome: c.nome, passwordHash: hash, role: UserRole.CONSELHEIRO, ativo: true },
      create: {
        nome: c.nome,
        email: c.email,
        passwordHash: hash,
        role: UserRole.CONSELHEIRO,
        ativo: true,
      },
    });
    conselheiroIds.push(user.id);
  }

  await prisma.disponibilidadeEntrevista.deleteMany({
    where: {
      usuarioId: { in: [bispado.id, ...conselheiroIds] },
    },
  });

  await prisma.disponibilidadeEntrevista.createMany({
    data: [
      // Bispo — terça e quinta à noite
      { usuarioId: bispado.id, diaSemana: 2, horaInicio: "19:00", horaFim: "21:00", duracaoMin: 30 },
      { usuarioId: bispado.id, diaSemana: 4, horaInicio: "19:00", horaFim: "21:00", duracaoMin: 30 },
      // Gilberto — segunda e sexta à noite
      { usuarioId: conselheiroIds[0], diaSemana: 1, horaInicio: "19:00", horaFim: "21:00", duracaoMin: 30 },
      { usuarioId: conselheiroIds[0], diaSemana: 5, horaInicio: "19:00", horaFim: "21:00", duracaoMin: 30 },
      // Marinaldo — quarta à noite e sábado de manhã
      { usuarioId: conselheiroIds[1], diaSemana: 3, horaInicio: "19:00", horaFim: "21:00", duracaoMin: 30 },
      { usuarioId: conselheiroIds[1], diaSemana: 6, horaInicio: "10:00", horaFim: "12:00", duracaoMin: 30 },
    ],
  });

  const semanaInicio = startOfWeek(new Date(), { weekStartsOn: 0 });

  await prisma.conteudoSemanal.upsert({
    where: { semanaInicio },
    update: {
      mensagemBispo:
        "<p>Queridos irmãos e irmãs, esta semana temos o <strong>São João da Ala no sábado às 15h</strong> — todos estão convidados! Preparemos o coração para a reunião sacramental de domingo.</p>",
      hinoSemana: "73 — Onde encontrar a paz",
      versiculoTexto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      versiculoRef: "Mateus 11:28",
      tituloJornal: "Calendário Semanal — Ala Novo Hamburgo",
      ativo: true,
    },
    create: {
      semanaInicio,
      mensagemBispo:
        "<p>Queridos irmãos e irmãs, esta semana temos o <strong>São João da Ala no sábado às 15h</strong> — todos estão convidados! Preparemos o coração para a reunião sacramental de domingo.</p>",
      hinoSemana: "73 — Onde encontrar a paz",
      versiculoTexto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      versiculoRef: "Mateus 11:28",
      tituloJornal: "Calendário Semanal — Ala Novo Hamburgo",
      ativo: true,
    },
  });

  await prisma.eventoCalendario.deleteMany();
  await prisma.eventoCalendario.createMany({
    data: EVENTOS_SEMANA_ALA.map((evento) => ({
      diaSemana: evento.diaSemana,
      titulo: evento.titulo,
      horario: evento.horario ?? null,
      ordem: evento.ordem,
      ativo: true,
    })),
  });

  await prisma.aviso.upsert({
    where: { id: "seed-sao-joao-2026" },
    update: {
      titulo: "São João da Ala — Sábado às 15h",
      conteudo:
        "<p>Todos os membros e amigos da ala estão convidados para o <strong>São João da Ala</strong> neste sábado, às <strong>15h</strong>. Traga sua família e venha participar!</p>",
      tipo: "EVENTO",
      publicado: true,
      destaque: true,
      publicadoEm: new Date(),
    },
    create: {
      id: "seed-sao-joao-2026",
      titulo: "São João da Ala — Sábado às 15h",
      conteudo:
        "<p>Todos os membros e amigos da ala estão convidados para o <strong>São João da Ala</strong> neste sábado, às <strong>15h</strong>. Traga sua família e venha participar!</p>",
      tipo: "EVENTO",
      publicado: true,
      destaque: true,
      publicadoEm: new Date(),
    },
  });

  const avisoExists = await prisma.aviso.findFirst({
    where: { titulo: "Bem-vindos ao Zion Connect" },
  });

  if (!avisoExists) {
    await prisma.aviso.create({
      data: {
        titulo: "Bem-vindos ao Zion Connect",
        conteudo:
          "<p>Este é o canal oficial de avisos da Ala Novo Hamburgo. Acompanhe o calendário semanal e fique atento às novidades publicadas aqui.</p>",
        tipo: "NOVIDADE",
        publicado: true,
        destaque: false,
        publicadoEm: new Date(),
      },
    });
  }

  console.log(`Usuário Bispado seed: ${email}`);
  console.log(
    `Conselheiros seed: ${conselheirosSeed.map((c) => `${c.nome} (${c.email})`).join(", ")}`,
  );
  console.log(`Calendário: ${EVENTOS_SEMANA_ALA.length} eventos da semana cadastrados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
