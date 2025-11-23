C'est une excellente question pour démarrer cette leçon \! GraphQL change complètement la manière dont le Frontend (ton appli React) et le Backend (ton serveur) discutent ensemble.

Voici une explication simple avec une analogie pour bien comprendre la différence avec ce que tu as fait jusqu'à présent (REST).

### L'Analogie du Restaurant 🍽️

  * **REST (ce que tu faisais avant)** : C'est comme un **Menu fixe**.

      * Tu commandes le "Menu 1" (GET `/users`), le serveur t'apporte l'assiette complète : nom, email, mot de passe, adresse, date de naissance... même si tu voulais juste connaître le prénom.
      * Si tu veux aussi les dépenses du client, tu dois commander un deuxième plat "Menu 2" (GET `/expenses`).
      * **Problème :** Tu reçois trop de données (surcharge) ou tu dois faire trop d'allers-retours (requêtes multiples).

  * **GraphQL (ce que tu vas faire)** : C'est comme un **Buffet à volonté**.

      * Tu donnes une liste précise au serveur : "Je veux juste le nom du client et le montant de ses dépenses".
      * Le serveur te prépare une assiette avec *exactement* ça, et rien d'autre. Tout tient dans une seule assiette (une seule requête).

-----

### 1\. GraphQL pour le Backend (Apollo Server)

Côté serveur, GraphQL ne consiste plus à créer plein de routes (`/api/users`, `/api/transfers`, etc.). À la place, tu crées un **Schéma** et des **Resolvers**.

  * **Le Schéma (Le "Quoi") :** C'est la carte du restaurant. Tu définis les types de données disponibles.
      * *Exemple :* "Un `User` a un `id` et un `name`. Une `Expense` a un `amount` et un `payer`."
  * **Les Resolvers (Le "Comment") :** C'est le chef cuisinier. Ce sont des fonctions qui expliquent comment aller chercher les données dans ta base de données (Prisma) quand quelqu'un les demande.
  * **Le point d'entrée unique :** Il n'y a plus qu'une seule URL : `/graphql`. Le serveur reçoit une requête complexe, la décortique, exécute les bons resolvers, et renvoie le JSON sur mesure.

**En résumé pour le Backend :** Tu ne construis plus des routes rigides, tu construis un **graphe de données** dans lequel le client peut piocher librement.

### 2\. GraphQL pour le Frontend (Apollo Client)

Côté client (React), tu n'utilises plus `fetch('url')` pour récupérer un bloc de données fixe. Tu utilises **Apollo Client** pour envoyer des demandes précises.

Il y a deux mots clés à retenir ici :

  * **Query (Lecture) :** Au lieu de dire "Donne-moi les users", tu dis :
    ```graphql
    query {
      users {
        name
        email
        # Je ne demande pas l'ID ni le compte bancaire, donc je ne les reçois pas !
      }
    }
    ```
  * **Mutation (Écriture) :** C'est l'équivalent du POST/PUT/DELETE. Tu envoies une mutation pour modifier des données.
      * *Exemple :* `mutation { createExpense(...) { id } }`

**En résumé pour le Frontend :** C'est le Frontend qui a le pouvoir. C'est toi, dans ton code React, qui décides exactement de la forme du JSON que tu vas recevoir. Fini les erreurs `undefined` parce qu'il manque un champ, ou les applications lentes parce qu'on télécharge des méga-octets de données inutiles.

### Pourquoi on fait ça dans la Leçon 5 ?

Dans ton application de dépenses partagées :

1.  Tu as besoin d'afficher une dépense ET le nom de celui qui a payé.
2.  Avec REST, tu devais peut-être faire des jointures complexes ou plusieurs appels.
3.  Avec GraphQL, tu vas simplement demander : "Donne-moi les dépenses, et pour chaque dépense, donne-moi juste le nom du payeur". C'est beaucoup plus naturel pour des données relationnelles (Users \<-\> Expenses).