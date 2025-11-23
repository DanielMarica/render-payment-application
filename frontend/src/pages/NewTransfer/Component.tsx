import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ApiClient from '../../lib/api';
import { useCurrentUser } from '../Layout'; // On utilise notre hook ici
import type { User } from '../../types/User';

interface TransferFormInputs {
    amount: number;
    targetId: string;
}

export default function NewTransfer() {
    const { users } = useLoaderData() as { users: User[] };
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const navigation = useNavigation();
    
    // Setup React Hook Form
    const { register, handleSubmit, setError, formState: { errors } } = useForm<TransferFormInputs>();
    const isSubmitting = navigation.state === "submitting";

    const onSubmit = async (data: TransferFormInputs) => {
        if (!currentUser) return;
        try {
            await ApiClient.createTransfer({
                amount: Number(data.amount),
                sourceId: currentUser.id,
                targetId: Number(data.targetId),
                date: new Date().toISOString()
            });
            // Redirection vers la liste en cas de succès
            navigate('/transactions');
        } catch (err) {
            console.error(err);
            // Affichage de l'erreur sur le formulaire
            setError("root", { message: "Failed to create transfer. Please try again." });
        }
    };

    // Si aucun utilisateur n'est sélectionné dans le Layout
    if (!currentUser) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-700">
                <p className="font-bold">Login Required</p>
                <p>Please select a user in the top navigation bar (top right) to make a transfer.</p>
            </div>
        );
    }

    // On ne peut pas se virer de l'argent à soi-même
    const possibleTargets = users.filter(u => u.id !== currentUser.id);

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">💸 New Transfer</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Champ "De la part de" (Lecture seule) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <div className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600 font-medium cursor-not-allowed">
                        {currentUser.name}
                    </div>
                </div>

                {/* Champ "Pour qui" */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select 
                        {...register("targetId", { required: "Please select a recipient" })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    >
                        <option value="">Select a friend...</option>
                        {possibleTargets.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    {errors.targetId && <p className="text-red-500 text-sm mt-1">{errors.targetId.message}</p>}
                </div>

                {/* Champ "Montant" */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        {...register("amount", { 
                            required: "Amount is required", 
                            min: { value: 0.01, message: "Amount must be positive" } 
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        placeholder="0.00"
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                </div>

                {/* Message d'erreur global API */}
                {errors.root && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center font-medium">
                        {errors.root.message}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 disabled:bg-teal-300 transition-colors"
                >
                    {isSubmitting ? 'Processing...' : 'Send Money'}
                </button>
            </form>
        </div>
    );
}