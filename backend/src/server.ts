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
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
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
// graph ql 
app.use("/graphql", graphqlMiddleware);
// Error handlers
app.use(errorHandler());

export { app, logger };