/* eslint-disable */
import type { Prisma, User, Expense, Transfer } from "@prisma/client";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "paidExpenses" | "transfersOut" | "transfersIn" | "participatedExpenses";
        ListRelations: "paidExpenses" | "transfersOut" | "transfersIn" | "participatedExpenses";
        Relations: {
            paidExpenses: {
                Shape: Expense[];
                Name: "Expense";
                Nullable: false;
            };
            transfersOut: {
                Shape: Transfer[];
                Name: "Transfer";
                Nullable: false;
            };
            transfersIn: {
                Shape: Transfer[];
                Name: "Transfer";
                Nullable: false;
            };
            participatedExpenses: {
                Shape: Expense[];
                Name: "Expense";
                Nullable: false;
            };
        };
    };
    Expense: {
        Name: "Expense";
        Shape: Expense;
        Include: Prisma.ExpenseInclude;
        Select: Prisma.ExpenseSelect;
        OrderBy: Prisma.ExpenseOrderByWithRelationInput;
        WhereUnique: Prisma.ExpenseWhereUniqueInput;
        Where: Prisma.ExpenseWhereInput;
        Create: {};
        Update: {};
        RelationName: "payer" | "participants";
        ListRelations: "participants";
        Relations: {
            payer: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            participants: {
                Shape: User[];
                Name: "User";
                Nullable: false;
            };
        };
    };
    Transfer: {
        Name: "Transfer";
        Shape: Transfer;
        Include: Prisma.TransferInclude;
        Select: Prisma.TransferSelect;
        OrderBy: Prisma.TransferOrderByWithRelationInput;
        WhereUnique: Prisma.TransferWhereUniqueInput;
        Where: Prisma.TransferWhereInput;
        Create: {};
        Update: {};
        RelationName: "source" | "target";
        ListRelations: never;
        Relations: {
            source: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            target: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
}
export function getDatamodel(): PothosPrismaDatamodel;