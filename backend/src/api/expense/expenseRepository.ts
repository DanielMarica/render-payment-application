import { PrismaClient } from '@prisma/client'; // Ou '../../generated/prisma' si ton setup est spécifique
const prisma = new PrismaClient();

export async function getAllExpenses() {
  return prisma.expense.findMany({
    include: {
      payer: true,
      participants: true,
    },
    orderBy: { date: 'desc' }
  });
}

export async function getExpenseById(id: number) {
  return prisma.expense.findUnique({
    where: { id },
    include: {
      payer: true,
      participants: true,
    },
  });
}

export async function createExpense({
  description,
  amount,
  date,
  payerId,
  participantIds,
}: {
  description: string;
  amount: number;
  date: Date;
  payerId: number;
  participantIds: number[];
}) {
  return prisma.expense.create({
    data: {
      description,
      amount,
      date,
      // Connecte l'utilisateur existant via son ID
      payer: { connect: { id: payerId } },
      // Connecte la liste des participants
      participants: { connect: participantIds.map((id) => ({ id })) },
    },
  });
}