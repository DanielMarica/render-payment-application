export interface Expense {
  id: string;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

export type ExpenseData = Omit<Expense, 'id'>;

export interface User {
  id: string;
  name: string;
}