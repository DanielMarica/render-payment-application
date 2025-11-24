import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "../../prisma/pothos-types";
import { PrismaClient } from "@prisma/client";
import type { GraphQLContext } from "../types/GraphQlContext";

const prisma = new PrismaClient();

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
  Context: GraphQLContext;
}>({
  // 1. On retire RelayPlugin de la liste
  plugins: [PrismaPlugin],
  
  // 2. On retire relayOptions (ce qui causait ton erreur rouge)
  
  prisma: {
    client: prisma,
  },
});

builder.scalarType("Date", {
  serialize: (date) => date.toISOString(),
  parseValue: (value) => {
    return new Date(value as string);
  },
});

builder.queryType({});
builder.mutationType({});

export default builder;