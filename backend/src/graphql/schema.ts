import builder from "./builder";

// On importera les modules ici
import augmentExpenseSchema from "../api/expense/augmentGraphqlQSchema";
import augmentUserSchema from "../api/user/augmentGraphqlSchema";

// On applique les modifications
augmentExpenseSchema();
augmentUserSchema();

const schema = builder.toSchema();
export default schema;