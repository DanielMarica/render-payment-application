import type { Socket } from 'socket.io';
import { verifyToken } from '../../src/api/auth/authService'; // Adapte le chemin selon ton projet

// On étend le type Socket pour dire qu'il contient un user
export interface AuthenticatedSocket extends Socket {
  user?: {
    userId: number;
    email: string;
  };
}

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  // Le token est envoyé lors de la connexion initiale dans 'auth'
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    // On vérifie le token
    const user = verifyToken(token);
    // On attache l'user au socket pour l'utiliser plus tard
    (socket as AuthenticatedSocket).user = user;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
}