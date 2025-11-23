import builder from "../../graphql/builder";
import * as userRepository from "./userRepository";

const augmentSchema = () => {
  // 1. Définition de l'objet User
  const UserRef = builder.prismaObject("User", {
    fields: (t) => ({
      id: t.exposeID("id"),
      name: t.exposeString("name"),
      email: t.exposeString("email"),
      bankAccount: t.exposeString("bankAccount", { nullable: true }),
    }),
  });

  // 2. Query pour lister les utilisateurs
  // (Utilisé par ton frontend pour la liste déroulante)
  builder.queryField("users", (t) =>
    t.field({
      type: [UserRef],
      resolve: async () => {
        return userRepository.getAllUsers();
      },
    })
  );
};

export default augmentSchema;