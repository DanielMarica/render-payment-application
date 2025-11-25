import builder from "./builder";

// On importera les modules ici
import augmentExpenseSchema from "../api/expense/augmentGraphqlQSchema";
import augmentUserSchema from "../api/user/augmentGraphqlSchema";
import augmentReportSchema from '../api/report/augmentgGraphqlScema';

// On applique les modifications
augmentExpenseSchema();
augmentUserSchema();
augmentReportSchema(builder);

const schema = builder.toSchema();
export default schema;