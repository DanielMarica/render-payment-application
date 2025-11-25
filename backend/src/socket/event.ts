import { io } from '../server'; // Assure-toi que l'import pointe vers ton export 'io' dans server.ts

// Types des événements (Contrats)
export interface ExpenseCreatedEvent {
  expenseId: number;
  description: string;
  amount: number;
  payerId: number;
  payerName: string;
  participantIds: number[];
}

export interface ExpenseUpdatedEvent {
  expenseId: number;
  description: string;
  amount: number;
}

export interface ReportReadyEvent {
  reportId: string;
  userId: number;
  downloadUrl: string;
}
// Fonction pour émettre "Nouvelle Dépense"
export function emitExpenseCreated(event: ExpenseCreatedEvent) {
  console.log(`📢 Diffusion : Nouvelle dépense ${event.expenseId}`);
  
  // On notifie chaque participant individuellement
  event.participantIds.forEach((participantId) => {
    // On envoie dans la "room" spécifique de l'utilisateur (créée lors de la connexion socket)
    io.to(`user-${participantId}`).emit('expense:created', event);
  });
}

// Fonction pour émettre "Rapport Prêt"
export function emitReportReady(event: ReportReadyEvent) {
  console.log(`📢 Diffusion : Rapport prêt pour User ${event.userId}`);
  io.to(`user-${event.userId}`).emit('report:ready', event);
}