import type { Expense } from '../types/type';

interface ExpenseItemProps {
  expense: Expense;
}



const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  return (
    <div>
      <p>Date: {expense.date}</p>
      <p>Description: {expense.description}</p>
      <p>Payer: {expense.payer}</p>
      <p>Amount: ${expense.amount.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseItem;
