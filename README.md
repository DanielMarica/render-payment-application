# render-payment-application
# how to create a project frontend 
npm create vite@latest frontend -- --template react-ts
# how to create a node js backend 
npx express-generator --no-view backend


# technologie utilisé 
typescript + React
node.js
primsa orm 
React Hook 
Zod 
# Leçon 2 : Avantages des technologies utilisées et descriptions

## 🔷 Prisma ORM - C'est quoi ?

**Prisma** est un ORM (Object-Relational Mapping) moderne pour Node.js et TypeScript. Il permet de :
- **Gérer la base de données depuis le code** : On définit nos modèles dans `schema.prisma` et Prisma crée les tables automatiquement
- **Auto-complétion et sécurité des types** : Grâce à TypeScript, on évite les erreurs de requêtes
- **Simplifier les requêtes SQL** : Au lieu d'écrire du SQL brut, on utilise des méthodes JavaScript intuitives
- **Migrations faciles** : Prisma garde un historique des changements de la base de données

**Exemple** : Au lieu d'écrire `SELECT * FROM Expense WHERE id = 1`, on écrit simplement `prisma.expense.findUnique({ where: { id: 1 } })`

---

## 🔷 Pourquoi créer une base de données PostgreSQL locale ?

### Avantages :
1. **Développement plus rapide** : Pas besoin de connexion internet, tout est sur votre machine
2. **Gratuit et illimité** : Contrairement aux bases de données cloud gratuites qui ont des limites
3. **Isolation** : Vos tests en développement n'affectent pas la base de données de production
4. **Apprentissage** : Vous comprenez mieux comment fonctionne une vraie base de données
5. **Travail hors ligne** : Vous pouvez coder même sans internet

### Architecture :
- **En développement** : Base de données locale PostgreSQL (`localhost:5432`)
- **En production** : Base de données sur Render (accessible via une URL externe)

---

## 🔷 Commandes Prisma utilisées

```bash
# Installer Prisma en tant que dépendance de développement
npm install prisma --save-dev

# Initialiser Prisma dans le projet
npx prisma init

# Créer/mettre à jour les tables dans la base de données à partir du schema.prisma
npx prisma db push

# Récupérer la structure de la base de données et mettre à jour schema.prisma
npx prisma db pull

# Ouvrir Prisma Studio (interface graphique pour visualiser/éditer les données)
npx prisma studio

# Générer le Prisma Client (pour utiliser Prisma dans le code)
npx prisma generate
```

---

## 🔷 Comment configurer la base de données PostgreSQL locale ?

### Étape 1 : Installer PostgreSQL sur macOS

```bash
# Installer PostgreSQL avec Homebrew
brew install postgresql@14

# Démarrer PostgreSQL
brew services start postgresql@14

# Vérifier que PostgreSQL fonctionne
brew services list | grep postgresql
```

### Étape 2 : Créer une base de données pour le projet

```bash
# Créer une nouvelle base de données
createdb expenses_db

# Vérifier que la base est créée
psql -l
```

### Étape 3 : Configurer le fichier `.env` dans le backend

Créer/modifier le fichier `backend/.env` avec l'URL de connexion :

```env
DATABASE_URL="postgresql://VOTRE_USERNAME@localhost:5432/expenses_db?schema=public"
```

💡 **Remplacez `VOTRE_USERNAME`** par votre nom d'utilisateur macOS (visible avec la commande `whoami`)

### Étape 4 : Vérifier la connexion

```bash
cd backend
npx prisma db pull
```

Si vous voyez "The introspected database was empty", c'est bon ! La connexion fonctionne.

### Étape 5 : Créer votre premier modèle

Ajouter dans `backend/prisma/schema.prisma` :

```prisma
model Expense {
  id          Int      @id @default(autoincrement())
  date        DateTime @default(now())
  description String
  payer       String
  amount      Float
}
```

### Étape 6 : Synchroniser avec la base de données

```bash
npx prisma db push
```

✅ La table `Expense` est maintenant créée !

### Étape 7 : Visualiser avec Prisma Studio

```bash
npx prisma studio
```

Ouvrir http://localhost:5555 dans votre navigateur 🎉

---

## 🔷 Prisma Studio - C'est quoi ?

**Prisma Studio** est une interface graphique web qui permet de :
- 📊 **Visualiser toutes vos tables et données** dans un navigateur
- ✏️ **Modifier les données directement** sans écrire de SQL
- ➕ **Ajouter de nouvelles entrées** facilement
- 🔍 **Filtrer et rechercher** dans vos données
- ✅ **Valider votre schéma** et vérifier que tout fonctionne

**Accessible sur** : `http://localhost:5555` après avoir lancé `npx prisma studio`

💡 **Avantage** : C'est comme avoir phpMyAdmin mais en plus moderne et spécialement conçu pour Prisma !

React Hook Forms c'est quoi ? 

Zod c'est quoi ? 
