import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import * as expenseRepository from "@/api/expense/expenseRepository";

// 1. Le Schéma
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String
    bankAccount: String
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
    expense(id: Int!): Expense
  }

  # NOUVEAU : Définition des actions d'écriture (Mutations)
  type Mutation {
    createExpense(
      description: String!,
      amount: Float!,
      date: String!,
      payerId: Int!,
      participantIds: [Int!]!
    ): Expense!
  }
`;

// 2. Les Resolvers
const resolvers = {
  Query: {
    expense: async (_parent: any, args: { id: number }, _context: any) => {
      return expenseRepository.getExpenseById(args.id);
    },
  },
  
  // NOUVEAU : Implémentation de la création
  Mutation: {
    createExpense: async (_parent: any, args: any, _context: any) => {
      const { description, amount, date, payerId, participantIds } = args;
      
      // Conversion de la date string en objet Date JS
      const parsedDate = new Date(date);
      
      // Appel au repository existant
      return expenseRepository.createExpense({
        description,
        amount,
        date: parsedDate,
        payerId,
        participantIds
      });
    }
  }
};

// 3. Initialisation
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

const graphqlMiddleware = expressMiddleware(server);

export default graphqlMiddleware;