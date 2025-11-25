import { io, Socket } from 'socket.io-client';

// On utilise la même URL que l'API (http://localhost:3000)
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  // Nettoyage de l'URL si elle contient /api (Socket.io veut la racine)
  const url = SOCKET_URL.endsWith('/api') ? SOCKET_URL.slice(0, -4) : SOCKET_URL;

  console.log("🔌 Tentative de connexion Socket.io sur:", url);

  socket = io(url, {
    auth: { token }, // On envoie le JWT pour s'identifier
    autoConnect: true,
    transports: ['websocket', 'polling'], // Force websocket pour la perf
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Socket connection error:', error.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}