// Type de base pour tous les objets avec un ID
export interface Identifiable {
  id: string | number;
}

// Ce qu'on envoie à l'API pour créer une expense (sans id)
export interface ExpenseInput {
  date: string;
  description?: string; // Optionnel
  payer: string;
  amount: number;
}

// Ce qu'on reçoit de l'API (avec id)
export interface Expense extends Identifiable {
  date: string;
  description: string;
  payer: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
}