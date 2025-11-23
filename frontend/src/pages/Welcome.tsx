import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div className="text-center p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-teal-800 mb-6">Bienvenue dans l'Expense Tracker</h1>
            <p className="text-gray-600 mb-2">Cette application vous permet de gérer vos dépenses partagées avec vos amis.</p>
            <p className="text-gray-600 mb-8">Suivez qui a payé quoi et calculez facilement qui doit de l'argent à qui.</p>
            
            <div className="flex gap-4 justify-center">
                {/* Lien mis à jour vers la nouvelle page de transactions */}
                <Link to="/transactions">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md">
                        Voir les transactions
                    </button>
                </Link>
                
                {/* Lien vers la nouvelle fonctionnalité de transfert */}
                <Link to="/transfers/new">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md">
                        Nouveau virement
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Welcome;