import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseAdd from '../components/ExpenseAdd';
import type { ExpenseInput } from '../types/Expense';

const Add = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const host = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const handleAdd = async (expense: ExpenseInput) => {
        setError(null);
        try {
            const response = await fetch(`${host}/api/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expense),
            });
            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout de la dépense");
            }
            // Redirection vers la liste après ajout réussi
            navigate('/list');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Ajouter une Dépense</h2>
            
            {error && (
                <div className="bg-primary-50 border-2 border-primary-500 text-primary-700 rounded-lg p-4 mb-6 text-center font-medium">
                    Erreur : {error}
                </div>
            )}
            
            <ExpenseAdd onAdd={handleAdd} />
        </div>
    );
};

export default Add;
