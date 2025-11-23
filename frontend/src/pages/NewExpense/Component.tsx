import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { gql } from '@apollo/client'; // Import nécessaire pour GraphQL
import graphqlClient from '../../lib/graph-ql.client'; // Notre client Apollo
import { useCurrentUser } from '../Layout';
import type { User } from '../../types/User';

// Définition de la Mutation GraphQL
// Note: On utilise String! pour la date pour correspondre à ton backend
const CREATE_EXPENSE_GQL = gql`
  mutation CreateExpense($description: String!, $amount: Float!, $date: String!, $payerId: Int!, $participantIds: [Int!]!) {
    createExpense(description: $description, amount: $amount, date: $date, payerId: $payerId, participantIds: $participantIds) {
      id
      description
    }
  }
`;

interface ExpenseFormInputs {
    description: string;
    amount: number;
    date: string;
    participantIds: string[]; // Les checkboxes renvoient des strings
}

export default function NewExpense() {
    const { users } = useLoaderData() as { users: User[] };
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const navigation = useNavigation();
    
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ExpenseFormInputs>();
    const isSubmitting = navigation.state === "submitting";

    const onSubmit = async (data: ExpenseFormInputs) => {
        if (!currentUser) return;

        try {
            // APPEL GRAPHQL ICI (Au lieu de l'API REST)
            await graphqlClient.mutate({
                mutation: CREATE_EXPENSE_GQL,
                variables: {
                    description: data.description,
                    amount: Number(data.amount),
                    date: new Date(data.date).toISOString(), // Format ISO pour le backend
                    payerId: Number(currentUser.id),
                    // Conversion des IDs de string[] vers number[]
                    participantIds: data.participantIds.map(id => Number(id)),
                },
            });
            
            // Redirection vers la liste
            navigate('/transactions');
        } catch (err) {
            console.error(err);
            setError("root", { message: "Error creating expense via GraphQL." });
        }
    };

    if (!currentUser) {
        return <div className="p-4 text-yellow-700 bg-yellow-50 border-l-4 border-yellow-500">Please select a user in the navigation bar.</div>;
    }

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🧾 New Expense</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Qui paie ? */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Payer</label>
                    <div className="mt-1 p-2 bg-gray-100 border rounded text-gray-600">
                        {currentUser.name}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input 
                        type="text" 
                        {...register("description", { required: "Description is required" })}
                        className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="Dinner, Taxi, etc."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                {/* Montant */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        {...register("amount", { required: "Amount is required", min: 0.01 })}
                        className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input 
                        type="date" 
                        {...register("date", { required: "Date is required" })}
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                </div>

                {/* Participants (Checkboxes) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Split with (Participants)</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                        {users.map(u => (
                            <div key={u.id} className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    value={u.id}
                                    {...register("participantIds", { required: "Select at least one participant" })}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 text-gray-700">{u.name}</label>
                            </div>
                        ))}
                    </div>
                    {errors.participantIds && <p className="text-red-500 text-sm">Select at least one participant</p>}
                </div>

                {errors.root && <div className="text-red-500 text-center">{errors.root.message}</div>}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 disabled:bg-teal-300 transition-colors"
                >
                    {isSubmitting ? 'Creating...' : 'Create Expense'}
                </button>
            </form>
        </div>
    );
}