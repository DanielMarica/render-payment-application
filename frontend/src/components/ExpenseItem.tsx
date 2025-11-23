import type { Expense } from '../types/type';

interface ExpenseItemProps {
  expense: Expense;
}



const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 my-3 flex justify-between items-center hover:shadow-lg transition-shadow">
      <div>
        <p className="text-sm text-gray-500">{expense.date}</p>
        <p className="text-lg font-semibold text-gray-800">{expense.description || 'N/A'}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Paid by {expense.payer}</p>
        <p className="text-xl font-bold text-primary-600">${expense.amount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ExpenseItem;
