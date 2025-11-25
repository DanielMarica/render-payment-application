import builder from "../../graphql/builder";
import * as expenseRepository from "./expenseRepository";
import { emitExpenseCreated } from '../../socket/event';
import { requireAuth } from '@/graphql/authHelpers'; // Import requireAuth

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
      resolve: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        if (user.userId !== args.payerId) {
          throw new Error("You can only create expenses that you paid for"); // Use a standard Error or a custom one if defined
        }

        const { description, amount, date, payerId, participantIds } = args;

        // 1. Création en base de données (On ajoute include pour avoir les noms)
        // ATTENTION : Il faut que ton expenseRepository.createExpense retourne le payer/participants
        // Si ton repo ne le fait pas, on va simuler les données pour l'event
        const expense = await expenseRepository.createExpense({
          description,
          amount,
          date,
          payerId,
          participantIds,
        });

        // 2. Émission de l'événement Temps Réel
        // Note : Comme createExpense ne renvoie pas forcément le nom du payeur,
        // on utilise le nom de l'utilisateur connecté (car c'est lui le payeur)
        emitExpenseCreated({
          expenseId: expense.id,
          description: expense.description,
          amount: expense.amount,
          payerId: expense.payerId,
          payerName: user.email, // Ou user.name si disponible dans le contexte
          participantIds: participantIds,
        });

        return expense;
      },
    })
  );
};

export default augmentSchema;