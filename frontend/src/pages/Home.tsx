import { useState, useEffect, useCallback } from 'react';
import ExpenseItem from '../components/ExpenseItem';
import UserItem from '../components/UserItem';
import type { Expense, ExpenseData, User } from '../types/type';
import ExpenseAdd from '../components/ExpenseAdd';

const host = import.meta.env.VITE_API_URL || 'http://unknown-api-url.com';

const users : User[] =[
  {
    id: 'u1',
    name: 'Alice',
  },
  {
    id: 'u2',
    name: 'Bob',
  },
  {
    id: 'u3',
    name: 'Charlie',
  },
]

const Home = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${host}/expenses`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAdd = async (newExpense: ExpenseData ) => {
    try {
      const response = await fetch(`${host}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
      await fetchExpenses(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${host}/expenses/reset`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to reset data');
      }
      await fetchExpenses(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <ExpenseAdd handleAdd={handleAdd} />
      <button onClick={handleReset} style={{ marginLeft: '10px' }}>Reset Data</button>
      
      {loading && <p>Loading expenses...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
      
      <h1>User List</h1>
      {users.map((user)=>(
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default Home;
