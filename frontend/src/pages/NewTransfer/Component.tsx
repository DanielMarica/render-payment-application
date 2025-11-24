import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ApiClient from '../../lib/api';
// MODIFICATION 1 : On change la source de l'utilisateur
import { useAuth } from '../../context/AuthContext'; 
import type { User } from '../../types/User';

interface TransferFormInputs {
    amount: number;
    targetId: string;
}

export default function NewTransfer() {
    const { users } = useLoaderData() as { users: User[] };
    
    // MODIFICATION 2 : On utilise le nouveau hook global
    // On renomme 'user' en 'currentUser' pour ne pas casser le reste du code
    const { user: currentUser } = useAuth(); 
    
    const navigate = useNavigate();
    const navigation = useNavigation();
    
    const { register, handleSubmit, setError, formState: { errors } } = useForm<TransferFormInputs>();
    const isSubmitting = navigation.state === "submitting";

    const onSubmit = async (data: TransferFormInputs) => {
        if (!currentUser) return;
        try {
            // Note: currentUser.id ou currentUser.userId selon ton type User
            // Dans le AuthContext, on a défini 'userId', mais ton type 'User' global a 'id'.
            // Adapte selon le besoin (ici on normalise l'objet sans utiliser `any`)
            const typedCurrentUser = currentUser as User & { userId?: number | string };
            const sourceId = typedCurrentUser.id ?? typedCurrentUser.userId;

            await ApiClient.createTransfer({
                amount: Number(data.amount),
                sourceId: Number(sourceId), 
                targetId: Number(data.targetId),
                date: new Date().toISOString()
            });
            navigate('/transactions');
        } catch (err) {
            console.error(err);
            setError("root", { message: "Failed to create transfer." });
        }
    };

    if (!currentUser) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-700">
                <p className="font-bold">Login Required</p>
                <p>Please login to make a transfer.</p>
            </div>
        );
    }

    // On filtre pour ne pas s'afficher soi-même (en comparant les IDs ou emails)
    const possibleTargets = users.filter(u => u.email !== currentUser.email);

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">💸 New Transfer</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Reste du formulaire inchangé... */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <div className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600 font-medium cursor-not-allowed">
                        {/* On affiche le nom s'il existe, sinon l'email */}
                        {((currentUser as unknown as User).name) || (currentUser as unknown as { email?: string }).email}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select 
                        {...register("targetId", { required: "Please select a recipient" })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                        <option value="">Select a friend...</option>
                        {possibleTargets.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    {errors.targetId && <p className="text-red-500 text-sm mt-1">{errors.targetId.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        {...register("amount", { required: true, min: 0.01 })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                </div>

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