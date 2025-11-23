import { Link } from 'react-router-dom';
import type { Transaction } from '../types/Transaction';

export const ExpenseTransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-2">
    <div>
      <p className="text-gray-900">
        <span className="font-bold text-teal-700">{transaction.payer.name}</span> paid{" "}
        <span className="font-bold">${transaction.amount}</span> for{" "}
        {transaction.participants?.length} people
      </p>
      <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()} : {transaction.description}</p>
    </div>
    {/* On retire 'expense-' de l'ID pour l'URL */}
    <Link 
      to={`/expenses/${transaction.id.replace('expense-', '')}`} 
      className="text-sm font-medium text-teal-600 hover:text-teal-800 border border-teal-200 px-3 py-1 rounded hover:bg-teal-50"
    >
      Details
    </Link>
  </div>
);

export const TransferTransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg mb-2">
    <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-3 uppercase">
      Transfer
    </div>
    <p className="text-gray-700">
      <span className="font-bold">{transaction.payer.name}</span> transferred{" "}
      <span className="font-bold text-green-600">${transaction.amount}</span> to{" "}
      <span className="font-bold">{transaction.participants[0]?.name}</span> on{" "}
      {new Date(transaction.date).toLocaleDateString()}.
    </p>
  </div>
);