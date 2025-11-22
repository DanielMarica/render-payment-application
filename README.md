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
- **En développement** : Base de données Prisma Dev locale (`localhost:51213`)
- **En production** : Base de données sur Render (accessible via une URL externe)

---

## ⚠️ Problème résolu : Bug avec `npx prisma dev`

Si vous rencontrez l'erreur `Cannot read properties of undefined (reading 'prototype')` avec `npx prisma dev`, utilisez cette version corrigée :

**Solution** : Ajouter ce script dans `backend/package.json` :
```json
"scripts": {
  "prisma:start_db": "npx prisma dev @0.0.0-dev.202509301625"
}
```

**Lancer la base de données** :
```bash
cd backend
npm run prisma:start_db
```

Plus d'infos sur le bug : https://github.com/prisma/prisma/issues/28133

---

## 🔷 Commandes Prisma utilisées

**⚠️ Important** : Toutes les commandes Prisma doivent être exécutées depuis le dossier `backend` !

```bash
# TOUJOURS exécuter depuis le dossier backend !
cd backend

# Installer Prisma en tant que dépendance de développement
npm install prisma --save-dev

# Initialiser Prisma dans le projet
npx prisma init

# Démarrer la base de données Prisma Dev (version corrigée)
npm run prisma:start_db

# Créer/mettre à jour les tables dans la base de données à partir du schema.prisma
npx prisma db push

# Réinitialiser la DB et pusher (supprime toutes les données !)
npx prisma db push --force-reset

# Récupérer la structure de la base de données et mettre à jour schema.prisma
npx prisma db pull

# Ouvrir Prisma Studio (interface graphique pour visualiser/éditer les données)
npx prisma studio

# Générer le Prisma Client (pour utiliser Prisma dans le code)
npx prisma generate

# Tester la lecture des données
node db-read.js

# Peupler la base de données
node db-populate.js
```

---

## 🔷 Comment configurer Prisma Dev (base de données locale) ?

### Étape 1 : Installer Prisma et initialiser

```bash
cd backend
npm install prisma --save-dev
npx prisma init
```

Cela crée :
- `prisma/schema.prisma` - Fichier de configuration des modèles
- `.env` - Fichier avec l'URL de la base de données

### Étape 2 : Ajouter le script de démarrage corrigé

Dans `backend/package.json`, ajouter :

```json
"scripts": {
  "prisma:start_db": "npx prisma dev @0.0.0-dev.202509301625"
}
```

### Étape 3 : Démarrer la base de données Prisma Dev

```bash
cd backend
npm run prisma:start_db
```

Vous devriez voir : `Your _prisma dev_ server default is ready and listening on ports 51213-51215`

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
