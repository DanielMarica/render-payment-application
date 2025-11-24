import { createBrowserRouter, RouterProvider } from "react-router";

import { ApolloProvider } from "@apollo/client/react";
import client from "./lib/graph-ql.client";
import { AuthProvider } from "../src/context/AuthContext";
import Layout, { loader as layoutLoader } from "./pages/Layout";
import Welcome from "./pages/Welcome";
import Transactions, {
  loader as transactionsLoader,
} from "./pages/Transactions";
import ExpenseDetail, {
  loader as expenseDetailLoader,
} from "./pages/ExpenseDetails";
import NewTransfer, { loader as NewTransferLoader } from "./pages/NewTransfer";
import NewExpense, { loader as NewExpenseLoader } from "./pages/NewExpense";
import { Toaster } from 'sonner';
import Login from "./pages/Login/Component";
import ProtectedRoute from '@/components/ProtectedRoute';

const router = createBrowserRouter([
  // 1. Route Publique : Le Login (Accessible sans être connecté)
  {
    path: "/login",
    Component: Login,
  },
  
  // 2. Routes Protégées : Tout le reste de l'application
  {
    path: "/",
    // C'est ICI qu'on applique la protection.
    // Si pas connecté -> Redirection vers /login
    // Si connecté -> Affiche le Layout
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    loader: layoutLoader,
    id: "layout",
    children: [
      { 
        index: true, 
        Component: Welcome 
      },
      {
        path: "transactions",
        Component: Transactions,
        loader: transactionsLoader,
      },
      {
        path: "expenses/:id",
        Component: ExpenseDetail,
        loader: expenseDetailLoader,
      },
      {
        path: "transfers/new",
        Component: NewTransfer,
        loader: NewTransferLoader,
      },
      {
        path: "expenses/new",
        Component: NewExpense,
        loader: NewExpenseLoader,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;