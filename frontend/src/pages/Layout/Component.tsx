import { NavLink, Outlet, useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import type { User } from '../../types/User';
import type { LoaderData } from './loader';

export default function Layout() {
  const data = useLoaderData() as LoaderData;
  // SÉCURITÉ : Si le loader échoue ou renvoie null, on utilise un tableau vide
  const users = data?.users || []; 

  const [currentUser, setCurrentUser] = useState<null | User>(null);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const newCurrentUser = users.find(user => user.id === id) ?? null;
    setCurrentUser(newCurrentUser);
  };

  const outletContext = {
    currentUser,
  };

  return (
    <div>
      <nav className="bg-teal-800 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="text-xl font-bold flex items-center gap-2">
            💸 Expenso
        </div>
        <div className="flex items-center gap-4">
          <NavLink 
            to="/transactions" 
            className={({ isActive }) => 
                isActive ? "text-yellow-300 font-bold border-b-2 border-yellow-300" : "hover:text-teal-200 transition"
            }
          >
            All Transactions
          </NavLink>
          <NavLink 
            to="/transfers/new" 
            className={({ isActive }) => 
                isActive ? "text-yellow-300 font-bold border-b-2 border-yellow-300" : "hover:text-teal-200 transition"
            }
          >
            New Transfer
          </NavLink>
          
          <div className="border-l border-teal-600 pl-4 ml-2">
            <select
                value={currentUser?.id ?? 'none'}
                className="bg-white text-black rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                onChange={handleUserChange}
            >
                <option value="none">— No User —</option>
                {users.map((u: User) => (
                <option key={u.id} value={u.id} >
                    {u.name}
                </option>
                ))}
            </select>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-6">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}