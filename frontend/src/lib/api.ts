import type { Expense } from "../types/Expense";
import type { Transaction } from "../types/Transaction";
import type { NewTransferPayload, Transfer } from "../types/Transfer";
import type { User } from "../types/User";

// 1. On s'assure que l'URL ne termine PAS par '/' pour éviter les doubles slashs
// 2. On force http://localhost:3000 si la variable est vide
let API_HOST = import.meta.env.VITE_API_URL || "http://localhost:3000";
if (API_HOST.endsWith("/")) {
    API_HOST = API_HOST.slice(0, -1);
}

// 3. Correction du problème "Double API" : 
// Si l'utilisateur a mis "http://localhost:3000/api" dans son .env, on retire le "/api" final
if (API_HOST.endsWith("/api")) {
    API_HOST = API_HOST.slice(0, -4);
}

const sendApiRequest = async (
  method: string = "GET",
  path: string,
  body?: unknown
) => {
  try {
    // L'URL finale sera toujours : http://localhost:3000/api/users
    const url = `${API_HOST}/api/${path}`;
    console.log(`📡 Fetching: ${url}`); // Ce log t'aidera à vérifier dans la console du navigateur

    const response = await fetch(url, {
      method: method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error; // On relance l'erreur pour que le Loader la capture
  }
};

const getUsers = (): Promise<User[]> => 
  sendApiRequest("GET", "users");

const getTransactions = (): Promise<Transaction[]> => 
  sendApiRequest("GET", "transactions");

const getExpenseById = (id: number): Promise<Expense> => 
  sendApiRequest("GET", `expenses/${id}`);

const createTransfer = (payload: NewTransferPayload): Promise<Transfer> => 
  sendApiRequest("POST", "transfers", payload);

export const ApiClient = {
  getUsers,
  getTransactions,
  getExpenseById,
  createTransfer,
};

export default ApiClient;