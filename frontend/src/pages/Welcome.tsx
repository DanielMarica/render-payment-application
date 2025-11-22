import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div>
            <h1>Bienvenue dans l'Expense Tracker</h1>
            <p>Cette application vous permet de gérer vos dépenses partagées avec vos amis.</p>
            <p>Suivez qui a payé quoi et calculez facilement qui doit de l'argent à qui.</p>
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/list">
                    <button>Voir la liste des dépenses</button>
                </Link>
                <Link to="/add">
                    <button>Ajouter une dépense</button>
                </Link>
                
            </div>
        </div>
    );
};

export default Welcome;
