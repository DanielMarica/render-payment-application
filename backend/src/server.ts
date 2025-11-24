import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import userRouter from "@/api/user/userRouter";
import expenseRouter from "@/api/expense/expenseRouter";
// AJOUTER CES IMPORTS :
import transferRouter from "@/api/transfer/transferRouter";
import transactionRouter from "@/api/transaction/trasnsactionRouter";

import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import authRouter from "@/api/auth/authRouter";

// ... tes autres imports
// @ts-ignore: module resolution for 'ruru/server' doesn't match current tsconfig; add proper types or update moduleResolution later
import { ruruHTML } from "ruru/server"; // Pour l'interface graphique
import graphqlMiddleware from "./graphql/server";
const logger = pino({ name: "server start" });
const app: Express = express();


// --- DÉBUT AJOUT GRAPHQL ---
if (env.isDevelopment) {
    const config = { endpoint: "/graphql" };

    // 1. Route pour afficher l'interface Ruru (le "Swagger" de GraphQL)
    app.get("/ruru", (req, res) => {
        res.format({
            html: () => res.status(200).send(ruruHTML(config)),
            default: () => res.status(406).send("Not Acceptable"),
        });
    });
}

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 2. Configuration CORS (Qui a le droit de nous appeler ?)
app.use(cors({
  // On utilise la variable d'environnement ou localhost par défaut
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Autorise les cookies/sessions
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // On autorise les scripts inline seulement en dev (nécessaire pour Ruru parfois)
      scriptSrc: ["'self'", "'unsafe-inline'"], 
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Utile pour le dev avec ressources externes
  hsts: {
    maxAge: 31536000, // 1 an : Force le navigateur à utiliser HTTPS
    includeSubDomains: true,
    preload: true,
  },
}));

app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);

// AJOUTER CES LIGNES :
app.use("/api/transfers", transferRouter);
app.use("/api/transactions", transactionRouter);
app.use("/auth", authRouter);
// graph ql 
app.use("/graphql", graphqlMiddleware);
// Error handlers
app.use(errorHandler());

export { app, logger };