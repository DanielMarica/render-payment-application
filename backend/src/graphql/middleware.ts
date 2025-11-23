import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
// On importe ton repository existant pour réutiliser la logique d'accès à la BDD
import * as expenseRepository from "@/api/expense/expenseRepository";

// 1. Le Schéma (La Carte du restaurant)
// On définit à quoi ressemblent nos données pour le client
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String
  }

  type Expense {
    id: ID!
    description: String!
    amount: Float!
    date: String!
    payer: User!
    participants: [User!]!
  }

  type Query {
    # On définit une requête qui demande un ID (Entier) et renvoie une Expense
    expense(id: Int!): Expense
  }
`;

// 2. Les Resolvers (Le Cuisinier)
// On fait le lien entre la requête GraphQL et la fonction TypeScript
const resolvers = {
  Query: {
    expense: async (_parent: any, args: { id: number }, _context: any) => {
      // On appelle la méthode que tu as codée dans la leçon précédente !
      return expenseRepository.getExpenseById(args.id);
    },
  },
};

// 3. Initialisation
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

const graphqlMiddleware = expressMiddleware(server);

export default graphqlMiddleware;