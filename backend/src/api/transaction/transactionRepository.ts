import { PrismaClient } from '@prisma/client';
import * as TransactionModel from "./transactionModels";

const prisma = new PrismaClient();

export async function getAllTransactions() : Promise<TransactionModel.Transaction[]> {
  // 1. Récupérer les dépenses avec leurs relations
  const expensesPromise = prisma.expense.findMany({
    include: {
        payer: true,
        participants: true
    }
  });

  // 2. Récupérer les transferts avec leurs relations
  const transfersPromise = prisma.transfer.findMany({
    include: {
        source: true,
        target: true
    }
  });

  // 3. Attendre les deux
  const [expenses, transfers] = await Promise.all([
    expensesPromise,
    transfersPromise,
  ]);

  // 4. Convertir en format "Transaction" unifié
  const normalizedExpenses = expenses.map((expense) =>
    TransactionModel.fromExpense(expense)
  );
  const normalizedTransfers = transfers.map((transfer) =>
    TransactionModel.fromTransfer(transfer)
  );

  // 5. Fusionner et trier par date
  return [...normalizedExpenses, ...normalizedTransfers].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}