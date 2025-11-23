import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du nettoyage de la base de données...');

  // 1. On supprime d'abord les données dépendantes (Transfers, Expenses)
  // pour éviter les erreurs de clés étrangères
  await prisma.transfer.deleteMany();
  await prisma.expense.deleteMany();
  // On supprime les utilisateurs en dernier
  await prisma.user.deleteMany();

  console.log('🧹 Base de données nettoyée.');

  console.log('🌱 Création des utilisateurs...');

  // 2. On crée les utilisateurs
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@expenso.dev',
      bankAccount: 'US12 3456 7890',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@expenso.dev',
      bankAccount: 'FR76 5432 1098',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie',
      email: 'charlie@expenso.dev',
    },
  });

  console.log('✅ Utilisateurs créés avec succès :');
  console.log(`👉 Alice   -> ID: ${alice.id}`);
  console.log(`👉 Bob     -> ID: ${bob.id}`);
  console.log(`👉 Charlie -> ID: ${charlie.id}`);

  // 3. On crée une dépense initiale (Pizza Party payée par Alice)
  const pizza = await prisma.expense.create({
    data: {
      description: 'Pizza Party',
      amount: 45.50,
      date: new Date(),
      payerId: alice.id, // On utilise l'ID dynamique d'Alice
      participants: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: charlie.id }],
      },
    },
  });

  console.log(`✅ Dépense créée : Pizza Party (ID: ${pizza.id})`);

  // 4. On crée un transfert initial (Bob rembourse Alice)
  const transfer = await prisma.transfer.create({
    data: {
      amount: 15.00,
      date: new Date(),
      sourceId: bob.id,
      targetId: alice.id,
    },
  });

  console.log(`✅ Transfert créé : Bob -> Alice (ID: ${transfer.id})`);
  console.log('🚀 Seed terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });