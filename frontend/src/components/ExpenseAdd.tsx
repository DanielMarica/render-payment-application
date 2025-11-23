import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ExpenseInput } from '../types/type';

interface ExpenseAddProps {
    onAdd: (expense: ExpenseInput) => void;
}

// 🔷 Schéma de validation Zod
// Zod valide les données du formulaire AVANT qu'elles soient envoyées à l'API
const expenseSchema = z.object({
    payer: z.string().refine((val) => val === 'Alice' || val === 'Bob', {
        message: 'Le payer doit être Alice ou Bob',
    }),
    date: z.string().min(1, { message: 'La date est requise' }),
    description: z
        .string()
        .max(200, { message: 'La description ne peut pas dépasser 200 caractères' })
        .optional(),
    amount: z
        .number({ message: 'Le montant doit être un nombre' })
        .positive({ message: 'Le montant doit être positif' }),
});

const ExpenseAdd = ({ onAdd }: ExpenseAddProps) => {
    // 🎯 useForm avec zodResolver pour la validation Zod
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ExpenseInput>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            payer: 'Alice',
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: 0,
        },
    });

    // 📝 onSubmit : Appelée UNIQUEMENT si Zod valide avec succès
    const onSubmit = (data: ExpenseInput) => {
        console.log('✅ Validation Zod réussie ! Données:', data);
        onAdd(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
            {/* 
                🔹 Payer Field (Select)
                - register('payer') : lie ce champ au formulaire
                - required : validation obligatoire
            */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                    Payer:
                </label>
                <select 
                    {...register('payer')}
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none transition-colors"
                >
                    <option value="Alice">Alice</option>
                    <option value="Bob">Bob</option>
                </select>
                {errors.payer && <span className="text-sm text-primary-600 font-medium">⚠️ {errors.payer.message}</span>}
            </div>

            {/* 
                🔹 Date Field
                - required : validation obligatoire
            */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                    Date:
                </label>
                <input 
                    type="date" 
                    {...register('date')}
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none transition-colors"
                />
                {errors.date && <span className="text-sm text-primary-600 font-medium">⚠️ {errors.date.message}</span>}
            </div>

            {/* 
                🔹 Description Field
                - required : validation obligatoire
                - minLength : longueur minimale de 3 caractères
            */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                    Description:
                </label>
                <input 
                    type="text" 
                    {...register('description')} 
                    placeholder="Enter description"
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none transition-colors"
                />
                {errors.description && <span className="text-sm text-primary-600 font-medium">⚠️ {errors.description.message}</span>}
            </div>

            {/* 
                🔹 Amount Field
                - required : validation obligatoire
                - min : valeur minimale de 0.01
                - valueAsNumber : convertit automatiquement la string en number
            */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                    Amount:
                </label>
                <input 
                    type="number" 
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })} 
                    placeholder="Enter amount"
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none transition-colors"
                />
                {errors.amount && <span className="text-sm text-primary-600 font-medium">⚠️ {errors.amount.message}</span>}
            </div>

            <button 
                type="submit"
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
                Add Expense
            </button>
        </form>
    );
};

export default ExpenseAdd;
