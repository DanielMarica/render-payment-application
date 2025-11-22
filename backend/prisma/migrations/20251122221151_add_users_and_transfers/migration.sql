/* ÉTAPE 0 : Simulation de données (Car ta base est vide après le reset)
  On insère des dépenses au "vieux format" pour voir la migration opérer.
*/
INSERT INTO "Expense" ("description", "amount", "date", "payer")
VALUES 
('Welcome Dinner', 85.0, NOW(), 'Alice'),
('Taxi to Hotel', 25.50, NOW(), 'Bob'),
('Breakfast', 15.0, NOW(), 'Alice');


/* ÉTAPE 1 : Création des nouvelles tables
*/
-- CreateTable "User"
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bankAccount" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Transfer"
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable Join Table "_ParticipantExpenses"
CREATE TABLE "_ParticipantExpenses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ParticipantExpenses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_ParticipantExpenses_B_index" ON "_ParticipantExpenses"("B");


/* ÉTAPE 2 : Migration des données (La Magie !)
*/

-- 1. On crée les Users à partir des noms trouvés dans Expense
INSERT INTO "User" ("name", "email")
SELECT DISTINCT 
    "payer" as "name",
    LOWER(REGEXP_REPLACE("payer", '[^a-zA-Z0-9]', '.', 'g')) || '@expenso.dev' as "email"
FROM "Expense"
WHERE "payer" IS NOT NULL;

-- 2. On ajoute la colonne payerId (vide pour l'instant)
ALTER TABLE "Expense" ADD COLUMN "payerId" INTEGER;

-- 3. On remplit payerId en cherchant le bon User correspondant au nom
UPDATE "Expense" SET "payerId" = "User"."id"
FROM "User"
WHERE "User"."email" = LOWER(REGEXP_REPLACE("Expense"."payer", '[^a-zA-Z0-9]', '.', 'g')) || '@expenso.dev';

-- 4. Maintenant que c'est rempli, on peut dire que c'est OBLIGATOIRE (Not Null)
ALTER TABLE "Expense" ALTER COLUMN "payerId" SET NOT NULL;

-- 5. On supprime l'ancienne colonne texte
ALTER TABLE "Expense" DROP COLUMN "payer";


/* ÉTAPE 3 : Création des contraintes (Foreign Keys)
*/

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantExpenses" ADD CONSTRAINT "_ParticipantExpenses_A_fkey" FOREIGN KEY ("A") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantExpenses" ADD CONSTRAINT "_ParticipantExpenses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;