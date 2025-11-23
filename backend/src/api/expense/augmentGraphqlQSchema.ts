import builder from "../../graphql/builder";
import * as expenseRepository from "./expenseRepository";

const augmentSchema = () => {
  // 1. Définition de l'Objet Expense
  const ExpenseRef = builder.prismaObject("Expense", {
    fields: (t) => ({
      id: t.exposeID("id"),
      description: t.exposeString("description"),
      amount: t.exposeFloat("amount"),
      // Pothos gère automatiquement les relations Prisma !
      payer: t.relation("payer"), 
      participants: t.relation("participants"),
      date: t.field({
        type: "Date",
        resolve: (parent) => parent.date,
      }),
    }),
  });

  // 2. Ajout de la Query (Lecture)
  builder.queryField("expense", (t) =>
    t.field({
      type: ExpenseRef,
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (_root, args) => {
        return expenseRepository.getExpenseById(args.id);
      },
    })
  );

  // 3. Ajout de la Mutation (Création)
  builder.mutationField("createExpense", (t) =>
    t.field({
      type: ExpenseRef,
      args: {
        description: t.arg.string({ required: true }),
        amount: t.arg.float({ required: true }),
        date: t.arg({ type: "Date", required: true }),
        payerId: t.arg.int({ required: true }),
        participantIds: t.arg({ type: ["Int"], required: true }),
      },
      resolve: async (_parent, args) => {
        const { description, amount, date, payerId, participantIds } = args;
        return expenseRepository.createExpense({
          description,
          amount,
          date,
          payerId,
          participantIds,
        });
      },
    })
  );
};

export default augmentSchema;