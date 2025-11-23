import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 shadow-lg z-50">
            <div className="container mx-auto flex justify-center space-x-6">
                <Link 
                    to="/" 
                    className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Accueil
                </Link>
                <Link 
                    to="/list" 
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Liste
                </Link>
                <Link 
                    to="/add" 
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Ajouter
                </Link>
                
            </div>
        </nav>
    );
};

export default NavBar;
