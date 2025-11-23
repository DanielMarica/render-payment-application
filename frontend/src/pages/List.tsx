import { useState, useEffect, useCallback } from 'react';
import ExpenseItem from '../components/ExpenseItem';

import type { Expense} from '../types/type';

const List = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const host = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host}/expenses`);
            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }
            const data = await response.json();
            setExpenses(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [host]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleReset = async () => {
        if (!confirm("Are you sure you want to reset all expenses?")) {
            return;
        }
        try {
            const response = await fetch(`${host}/expenses/reset`, {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error("Failed to reset");
            }
            await fetchExpenses();
        } catch (err) {
            setError((err as Error).message);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Expense List</h2>
                <button 
                    onClick={handleReset}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    Reset Data
                </button>
            </div>
            
            <div>
                {expenses.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No expenses recorded.</p>
                ) : (
                    <div>
                        {expenses.map((expense) => (
                            <ExpenseItem key={expense.id} expense={expense} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default List;
