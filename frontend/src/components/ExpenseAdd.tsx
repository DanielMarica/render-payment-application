import React, { useState } from 'react';
import type { ExpenseData } from '../types/type';

interface ExpenseAddProps {
    handleAdd: (expense: ExpenseData ) => void;
}

const ExpenseAdd = ({ handleAdd }: ExpenseAddProps) => {
    const [payer, setPayer] = useState('Alice');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const newExpense: ExpenseData = {
            date,
            description,
            payer,
            amount,
        };
        console.log('Submitting expense:', newExpense);
        
        // Appeler l'API pour créer l'expense
        handleAdd(newExpense);
        
        // Réinitialiser le formulaire
        setDescription('');
        setAmount(0);
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Payer:
                <select value={payer} onChange={(e) => setPayer(e.target.value)}>
                    <option value="Alice">Alice</option>
                    <option value="Bob">Bob</option>
                </select>
            </label>
            <label>
                Date:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
                Amount:
                <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
            </label>
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default ExpenseAdd;
