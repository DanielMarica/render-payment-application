import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Définition précise du contenu du Token (pour éviter le type 'any')
interface JWTPayload {
  userId: number;
  email: string;
  exp?: number; // Timestamp d'expiration (Unix)
  iat?: number; // Issued At
}

interface AuthContextType {
  user: JWTPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  // 2. Logique d'initialisation centralisée pour éviter les redondances
  // Cette fonction vérifie le token ET son expiration dès le chargement
  const getInitialState = () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) return { token: null, user: null };

    try {
      const decoded = jwtDecode<JWTPayload>(storedToken);
      const currentTime = Date.now() / 1000;

      // Si le token a une date d'expiration et qu'elle est passée
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem(TOKEN_KEY);
        return { token: null, user: null };
      }

      return { token: storedToken, user: decoded };
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return { token: null, user: null };
    }
  };

  // On utilise l'état initial calculé une seule fois
  const [initialState] = useState(getInitialState);
  const [token, setToken] = useState<string | null>(initialState.token);
  const [user, setUser] = useState<JWTPayload | null>(initialState.user);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token provided on login", error);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  // 3. useEffect uniquement pour surveiller l'expiration future (optionnel mais recommandé)
  // On ne fait plus de setState synchrone immédiat ici, car c'est géré dans l'état initial.
  useEffect(() => {
    if (token && user?.exp) {
      const expirationTime = user.exp * 1000; // Conversion en millisecondes
      const currentTime = Date.now();

      // Définir un timer pour appeler logout de manière différée afin d'éviter un setState synchrone dans l'effet
      const remaining = expirationTime - currentTime;
      const timer = window.setTimeout(() => {
        logout();
      }, remaining > 0 ? remaining : 0);

      // Nettoyage du timer si token/user changent ou que le composant se démonte
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}