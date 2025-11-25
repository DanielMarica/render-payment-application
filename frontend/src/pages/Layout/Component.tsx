import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useExpenseEvents } from "../../hooks/useExpenseEvents";
export default function Layout() {
  // 1. On récupère l'état d'authentification réel
  const { user, isAuthenticated, logout } = useAuth();
  const { isConnected } = useSocket();

  const navigate = useNavigate();
  useExpenseEvents();
  // 2. Fonction pour se déconnecter
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-teal-800 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="text-xl font-bold flex items-center gap-2">
          💸 Expenso
        </div>

        <div className="flex items-center gap-4">
          {/* --- LIENS DE NAVIGATION --- */}
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold border-b-2 border-yellow-300"
                : "hover:text-teal-200 transition"
            }
          >
            All Transactions
          </NavLink>
          <NavLink
            to="/transfers/new"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold border-b-2 border-yellow-300"
                : "hover:text-teal-200 transition"
            }
          >
            New Transfer
          </NavLink>
          <NavLink
            to="/expenses/new"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold border-b-2 border-yellow-300 ml-4"
                : "hover:text-teal-200 transition ml-4"
            }
          >
            New Expense
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold border-b-2 border-yellow-300 ml-4"
                : "hover:text-teal-200 transition ml-4"
            }
          >
            PDF Reports
          </NavLink>
          {/* --- ZONE AUTHENTIFICATION (Remplacement du Select) --- */}
          <div className="border-l border-teal-600 pl-4 ml-2">
            {isAuthenticated ? (
              // CAS 1 : Utilisateur Connecté
              <div className="flex items-center gap-3">
                {/* INDICATEUR SOCKET */}
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-400 animate-pulse" : "bg-red-500"
                    }`}
                  />
                  <span className="text-teal-100">
                    {isConnected ? "Live" : "Offline"}
                  </span>
                </div>

                <span className="text-sm font-medium bg-teal-900 px-3 py-1 rounded-full border border-teal-700">
                  👤 {user?.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-3 py-1 rounded transition shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              // CAS 2 : Visiteur non connecté
              <button
                onClick={() => navigate("/login")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold px-4 py-2 rounded transition shadow-md"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {/* On n'a plus besoin de passer de contexte ici, car AuthContext est global */}
        <Outlet />
      </main>
    </div>
  );
}
