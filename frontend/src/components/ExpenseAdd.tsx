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
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* 
                🔹 Payer Field (Select)
                - register('payer') : lie ce champ au formulaire
                - required : validation obligatoire
            */}
            <label>
                Payer:
                <select {...register('payer')}>
                    <option value="Alice">Alice</option>
                    <option value="Bob">Bob</option>
                </select>
                {errors.payer && <span className="error">⚠️ {errors.payer.message}</span>}
            </label>

            {/* 
                🔹 Date Field
                - required : validation obligatoire
            */}
            <label>
                Date:
                <input 
                    type="date" 
                    {...register('date')} 
                />
                {errors.date && <span className="error">⚠️ {errors.date.message}</span>}
            </label>

            {/* 
                🔹 Description Field
                - required : validation obligatoire
                - minLength : longueur minimale de 3 caractères
            */}
            <label>
                Description:
                <input 
                    type="text" 
                    {...register('description')} 
                    placeholder="Enter description"
                />
                {errors.description && <span className="error">⚠️ {errors.description.message}</span>}
            </label>

            {/* 
                🔹 Amount Field
                - required : validation obligatoire
                - min : valeur minimale de 0.01
                - valueAsNumber : convertit automatiquement la string en number
            */}
            <label>
                Amount:
                <input 
                    type="number" 
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })} 
                    placeholder="Enter amount"
                />
                {errors.amount && <span className="error">⚠️ {errors.amount.message}</span>}
            </label>

            <button type="submit">Add Expense</button>
        </form>
    );
};

export default ExpenseAdd;
