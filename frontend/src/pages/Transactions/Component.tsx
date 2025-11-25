import { useLoaderData } from 'react-router-dom';
import { ExpenseTransactionItem, TransferTransactionItem } from '../../components/TransactionItems';
import type { LoaderData } from './loader';
import { RequestReportButton } from '@/components/RequestReportButton';

export default function Transactions() {
  const data = useLoaderData() as LoaderData;
  
  // CORRECTION ICI : Si 'data' ou 'transactions' est vide, on utilise une liste vide []
  const transactions = data?.transactions || [];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Transactions</h2>
      <RequestReportButton />
      {/* Petit bonus : message si la liste est vide */}
      {transactions.length === 0 ? (
        <p className="text-gray-500 italic">No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li key={tx.id}>
                {tx.kind === 'expense' ? (
                  <ExpenseTransactionItem transaction={tx} />
                ) : (
                  <TransferTransactionItem transaction={tx} />
                )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}