import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import userRouter from "@/api/user/userRouter";
import expenseRouter from "@/api/expense/expenseRouter";
import transferRouter from "@/api/transfer/transferRouter";
import transactionRouter from "@/api/transaction/trasnsactionRouter"; // Vérifie l'orthographe ici
import authRouter from "@/api/auth/authRouter";

import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

// @ts-ignore
import { ruruHTML } from "ruru/server";
import graphqlMiddleware from "./graphql/server";
import { serverAdapter } from './config/bullBoard';
import path from 'path';

import { authenticateSocket, type AuthenticatedSocket } from "./socket/authMiddleware";

const logger = pino({ name: "server start" });
const app: Express = express();

// --- 1. CONFIGURATION GLOBALE (Tout en haut !) ---
app.set("trust proxy", true);

// A. CORS (Le portier : Doit être le premier !)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// B. Parsing (Comprendre le JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// C. Sécurité (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], 
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:", "http:", "https:"], // Autorise WebSocket et HTTP
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// D. Logs et Rate Limit
app.use(rateLimiter);
app.use(requestLogger);


// --- 2. CONFIGURATION SPÉCIALE (HTTP & SOCKET) ---
const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.use(authenticateSocket);

io.on("connection", (socket: AuthenticatedSocket) => {
  const userId = socket.user?.userId;
  console.log(`🔌 User ${userId} connected: ${socket.id}`);
  if (userId) {
    socket.join(`user-${userId}`);
  }
  socket.on("disconnect", (reason) => {
    console.log(`🔌 User ${userId} disconnected: ${socket.id} (${reason})`);
  });
});


// --- 3. ROUTES & API ---

// Ruru (Interface de dev)
if (env.isDevelopment) {
    const config = { endpoint: "/graphql" };
    app.get("/ruru", (req, res) => {
        res.format({
            html: () => res.status(200).send(ruruHTML(config)),
            default: () => res.status(406).send("Not Acceptable"),
        });
    });
}

// Bull Board
if (env.isDevelopment) {
  app.use('/admin/queues', serverAdapter.getRouter());
}

// GraphQL (MAINTENANT C'EST BON, CORS EST DÉJÀ PASSÉ AVANT)
app.use("/graphql", graphqlMiddleware);

// API REST
app.use("/health-check", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/transfers", transferRouter);
app.use("/api/transactions", transactionRouter);
app.use("/auth", authRouter);

// Fichiers statiques
app.use('/reports', express.static(path.join(process.cwd(), 'reports')));

// Gestion d'erreurs (Toujours en dernier)
app.use(errorHandler());

export { app, logger, httpServer, io };