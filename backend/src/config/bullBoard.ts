import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from '@bull-board/express';
import { pdfQueue } from '../queues/pdfQueue'; // Adapte le chemin si besoin

// 1. Créer l'adaptateur pour Express
export const serverAdapter = new ExpressAdapter();

// 2. Définir l'URL où le tableau de bord sera visible
serverAdapter.setBasePath('/admin/queues');

// 3. Initialiser le tableau de bord avec nos files d'attente
createBullBoard({
  queues: [
    new BullMQAdapter(pdfQueue),
    // Si tu as d'autres files plus tard, tu les ajoutes ici
  ],
  serverAdapter,
});