const { PrismaClient } = require('./generated/prisma');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  // Lire les données du fichier JSON
  const data = JSON.parse(fs.readFileSync('./data/expenses.json', 'utf8'));

  console.log(`Populating database with ${data.length} expenses...`);

  // Créer les expenses dans la base de données
  for (const expense of data) {
    await prisma.expense.create({
      data: {
        date: new Date(expense.date),
        description: expense.description,
        payer: expense.payer,
        amount: expense.amount
      }
    });
  }

  console.log('✅ Database populated successfully!');

  // Vérifier les données créées
  const allExpenses = await prisma.expense.findMany();
  console.log(`Total expenses in database: ${allExpenses.length}`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
