import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Assure-toi d'avoir fait npm install bcrypt

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du nettoyage...');
  await prisma.transfer.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Création des utilisateurs avec mots de passe...');

  // On crée un mot de passe hashé par défaut (ex: "password123")
  const hashedPassword = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@expenso.dev',
      password: hashedPassword, // <--- NOUVEAU
      bankAccount: 'US12 3456 7890',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@expenso.dev',
      password: hashedPassword, // <--- NOUVEAU
      bankAccount: 'FR76 5432 1098',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie',
      email: 'charlie@expenso.dev',
      password: hashedPassword, // <--- NOUVEAU
    },
  });

  console.log('✅ Utilisateurs créés (Mot de passe par défaut: "password123")');

  // ... Le reste (Dépenses, Transferts) ne change pas ...
  const pizza = await prisma.expense.create({
    data: {
      description: 'Pizza Party',
      amount: 45.50,
      date: new Date(),
      payerId: alice.id,
      participants: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: charlie.id }],
      },
    },
  });
  
  await prisma.transfer.create({
    data: {
      amount: 15.00,
      date: new Date(),
      sourceId: bob.id,
      targetId: alice.id,
    },
  });

  console.log('🚀 Seed terminé !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });