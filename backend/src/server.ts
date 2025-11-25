import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { createServer } from "http"; // <--- NOUVEAU
import { Server as SocketServer } from "socket.io"; // <--- NOUVEAU

import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import userRouter from "@/api/user/userRouter";
import expenseRouter from "@/api/expense/expenseRouter";
import transferRouter from "@/api/transfer/transferRouter";
import transactionRouter from "@/api/transaction/trasnsactionRouter";
import authRouter from "@/api/auth/authRouter"; // Si tu l'as

import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

// @ts-ignore
import { ruruHTML } from "ruru/server";
import graphqlMiddleware from "./graphql/server";
import { serverAdapter } from './config/bullBoard';
import path from 'path';

// Imports Socket
import { authenticateSocket, type AuthenticatedSocket } from "./socket/authMiddleware"; // <--- NOUVEAU

const logger = pino({ name: "server start" });
const app: Express = express();

// --- CRÉATION SERVEUR HTTP (WRAPPER) ---
const httpServer = createServer(app); // <--- NOUVEAU : On enveloppe Express

// --- CONFIG SOCKET.IO ---
const io = new SocketServer(httpServer, { // <--- NOUVEAU
  cors: {
    //origin: process.env.FRONTEND_URL || "http://localhost:5173",
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- MIDDLEWARES SOCKET ---
io.use(authenticateSocket); // <--- NOUVEAU : On sécurise

io.on("connection", (socket: AuthenticatedSocket) => {
  const userId = socket.user?.userId;
  console.log(`🔌 User ${userId} connected: ${socket.id}`);

  // L'utilisateur rejoint sa "chambre" privée
  if (userId) {
    socket.join(`user-${userId}`);
  }

  socket.on("disconnect", (reason) => {
    console.log(`🔌 User ${userId} disconnected: ${socket.id} (${reason})`);
  });
});

// --- LE RESTE DU CODE EXPRESS (Inchangé) ---

// Ruru
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

// GraphQL
app.use("/graphql", graphqlMiddleware);

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mise à jour CORS pour Express
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], 
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"], // IMPORTANT: Autoriser WebSocket
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

app.use(rateLimiter);
app.use(requestLogger);

// Routes API
app.use("/health-check", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/transfers", transferRouter);
app.use("/api/transactions", transactionRouter);
app.use("/auth", authRouter);

// Fichiers statiques (PDF)
app.use('/reports', express.static(path.join(process.cwd(), 'reports')));

app.use(errorHandler());

// IMPORTANT : On exporte io et httpServer maintenant !
export { app, logger, httpServer, io };