import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import schema from "./schema";
// Nouveaux imports
import type { GraphQLContext } from "../types/GraphQlContext"; // Adapte le chemin si besoin
import { verifyToken } from "../api/auth/authService"; // Adapte le chemin si besoin

import { formatError } from "./errorFormatter";

const server = new ApolloServer({ 
  schema,
  formatError, // <--- AJOUTER CETTE LIGNE
});

await server.start();

// On configure le middleware pour remplir le contexte
const graphqlMiddleware = expressMiddleware(server, {
  context: async ({ req }): Promise<GraphQLContext> => {
    // 1. Récupérer le header "Authorization"
    const authHeader = req.headers.authorization || '';
    
    // 2. Nettoyer le format "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : '';

    // 3. Vérifier le token
    if (token) {
      try {
        const user = verifyToken(token);
        // Si valide, on met l'utilisateur dans le contexte !
        return { user };
      } catch (error) {
        // Si invalide (expiré, faux...), on continue en mode "anonyme"
        return {};
      }
    }
    
    // Pas de token = Utilisateur anonyme
    return {};
  },
});

export default graphqlMiddleware;