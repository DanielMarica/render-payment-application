import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "../../prisma/pothos-types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

// On apprend à GraphQL ce qu'est une "Date" Javascript
builder.scalarType("Date", {
  serialize: (date) => date.toISOString(),
  parseValue: (value) => {
    return new Date(value as string);
  },
});

// On initialise les types Query et Mutation ici pour pouvoir les étendre ailleurs
builder.queryType({});
builder.mutationType({});

export default builder;