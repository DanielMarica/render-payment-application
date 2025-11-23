import { useLoaderData, Link } from 'react-router-dom';
import type { Expense } from '../../types/Expense';

export default function ExpenseDetail() {
    const { expense } = useLoaderData() as { expense: Expense };

    // Calcul de la part de chacun
    const share = expense.participants.length > 0 
        ? (expense.amount / expense.participants.length).toFixed(2) 
        : 0;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <Link to="/transactions" className="text-teal-600 hover:underline mb-6 inline-block font-medium">&larr; Back to list</Link>
            
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{expense.description}</h1>
                    <p className="text-gray-500 mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="text-3xl font-bold text-teal-600">${expense.amount}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Paid by</p>
                <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-900 font-bold">{expense.payer.name}</span>
                    <span className="text-gray-500">({expense.payer.email})</span>
                </div>
                {expense.payer.bankAccount && (
                    <p className="text-sm text-gray-500 mt-1">Bank: {expense.payer.bankAccount}</p>
                )}
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-800">Split Details</h3>
            <ul className="space-y-3">
                {expense.participants.map(p => (
                    <li key={p.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700 font-medium">{p.name}</span>
                        <span className="font-mono bg-yellow-50 text-yellow-800 px-3 py-1 rounded text-sm font-bold">
                            owes ${share}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}