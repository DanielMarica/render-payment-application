// backend/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // 1. Nettoyer la base (optionnel, pour éviter les doublons si tu relances)
  await prisma.transfer.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.user.deleteMany();

  // 2. Créer les utilisateurs
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@expenso.dev',
      bankAccount: 'BE98 1234 5678 9012'
    }
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@expenso.dev',
      bankAccount: 'FR76 5432 1098 7654'
    }
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie',
      email: 'charlie@expenso.dev'
    }
  });

  console.log(`✅ Utilisateurs créés : ${alice.name}, ${bob.name}, ${charlie.name}`);

  // 3. Créer une dépense (Alice paie pour tout le monde)
  await prisma.expense.create({
    data: {
      description: 'Welcome Dinner',
      amount: 120.00,
      date: new Date(),
      payerId: alice.id,
      participants: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: charlie.id }]
      }
    }
  });

  console.log('✅ Dépense créée');
  console.log('🚀 Base de données prête !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });