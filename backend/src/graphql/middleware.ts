import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

// 1. Le Schéma (Type Definitions)
// C'est ici qu'on définit la forme des données (Le Menu)
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// 2. Les Resolvers
// C'est ici qu'on définit comment récupérer les données (Le Cuisinier)
const resolvers = {
  Query: {
    hello: () => "Hello GraphQL!",
  },
};

// 3. Initialisation du serveur
const server = new ApolloServer({ typeDefs, resolvers });

// On démarre le serveur (nécessite top-level await)
await server.start();

// On crée le middleware pour Express
const graphqlMiddleware = expressMiddleware(server);

export default graphqlMiddleware;