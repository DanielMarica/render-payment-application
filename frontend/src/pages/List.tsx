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
        <div>
            <h2>Expense List</h2>
            
            <button onClick={handleReset}>Reset Data</button>
            
            <div>
                {expenses.length === 0 ? (
                    <p>No expenses recorded.</p>
                ) : (
                   
                        <tbody>
                            {expenses.map((expense) => (
                                <ExpenseItem key={expense.id} expense={expense} />
                            ))}
                        </tbody>
            
                )}
            </div>
        </div>
    );
};

export default List;
