import type { ExpenseData } from '../types/type';

interface ExpenseAddProps {
    handleAdd: (expense: ExpenseData ) => void;
}

const ExpenseAdd = ({ handleAdd }: ExpenseAddProps) => {
    const onAdd = () => {
        const newExpense: ExpenseData  = {
            date: new Date().toISOString().split('T')[0],
            description: 'Random Expense',
            payer: Math.random() > 0.5 ? 'Alice' : 'Bob',
            amount: parseFloat((Math.random() * 100).toFixed(2)),
        };
        handleAdd(newExpense);
    };

    return (
        <button onClick={onAdd}>
            Add
        </button>
    );
};

export default ExpenseAdd;
