import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import schema from "./schema";
import type { GraphQLContext } from "../types/GraphQlContext"; // Vérifie la majuscule QL
import { verifyToken } from "../api/auth/authService";
import { formatError } from "./errorFormatter";

const server = new ApolloServer({ 
  schema,
  formatError, 
});

await server.start();

// Middleware avec les logs de débogage
const graphqlMiddleware = expressMiddleware(server, {
  context: async ({ req }): Promise<GraphQLContext> => {
    // --- DÉBUT DU DEBUG ---
    console.log("------------------------------------------------");
    console.log("🔍 [Debug Auth] Header complet :", req.headers.authorization);

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : '';

    console.log("🔍 [Debug Auth] Token extrait :", token ? `${token.substring(0, 15)}...` : "AUCUN");

    if (token) {
      try {
        const user = verifyToken(token);
        console.log("✅ [Debug Auth] SUCCÈS ! User ID :", user.userId);
        console.log("------------------------------------------------");
        return { user };
      } catch (error) {
        console.error("❌ [Debug Auth] ÉCHEC vérification :", (error as Error).message);
      }
    } else {
      console.log("⚠️ [Debug Auth] Pas de token trouvé -> Mode Anonyme");
    }
    console.log("------------------------------------------------");
    // --- FIN DU DEBUG ---

    return {};
  },
});

export default graphqlMiddleware;