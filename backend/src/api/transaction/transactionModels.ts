import { Prisma } from '@prisma/client';
import { z } from 'zod';

// Types utilitaires Prisma pour récupérer les relations
type ExpenseWithPayerAndParticipants = Prisma.ExpenseGetPayload<{
  include: {
    payer: true;
    participants: true;
  };
}>;

type TransferWithSourceAndTarget = Prisma.TransferGetPayload<{
  include: {
    source: true;
    target: true;
  };
}>;

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  date: z.date(),
  kind: z.enum(['expense', 'transfer']),
  payer: z.any(),
  participants: z.array(z.any()),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export const TransactionArraySchema = z.array(TransactionSchema);

export const fromExpense = (expense: ExpenseWithPayerAndParticipants): Transaction => {
  return TransactionSchema.parse({
    id: `expense-${expense.id}`,
    description: expense.description,
    amount: expense.amount,
    date: expense.date,
    kind: 'expense',
    payer: expense.payer,
    participants: expense.participants,
  });
};

export const fromTransfer = (transfer: TransferWithSourceAndTarget): Transaction => {
  return TransactionSchema.parse({
    id: `transfer-${transfer.id}`,
    description: 'Transfer',
    amount: transfer.amount,
    date: transfer.date,
    kind: 'transfer',
    payer: transfer.source,
    participants: [transfer.target],
  });
};