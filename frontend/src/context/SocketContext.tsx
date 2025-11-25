import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { connectSocket, disconnectSocket } from '../lib/socket-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Si l'utilisateur n'est pas authentifié, on nettoie tout
    if (!isAuthenticated || !token) {
      disconnectSocket();
      // Déférer la mise à jour du state pour éviter des rendus en cascade
      Promise.resolve().then(() => {
        setSocket(null);
        setIsConnected(false);
      });
      return;
    }

    // 2. Connexion au socket (Singleton)
    const socketInstance = connectSocket(token);

    // 3. CORRECTION CASCADING RENDER : 
    // On ne met à jour le state QUE si l'instance a changé.
    // Si c'est la même instance (ce qui est le cas avec un Singleton), React ne relance pas de rendu.
    // Déférer la mise à jour du state pour éviter des rendus en cascade
    Promise.resolve().then(() => {
      setSocket((prev) => (prev === socketInstance ? prev : socketInstance));
    });

    // 4. Gestionnaires d'événements
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    // 5. Initialisation de l'état connecté (au cas où il est déjà connecté)
    // Déférer la mise à jour du state pour éviter des rendus en cascade
    Promise.resolve().then(() => {
      setIsConnected((prev) => (prev === socketInstance.connected ? prev : socketInstance.connected));
    });

    // 6. Nettoyage lors du démontage ou changement de token
    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}