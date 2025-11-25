import { env } from "@/common/utils/envConfig";
// On importe httpServer au lieu de app pour le démarrage
import { app, logger, httpServer } from "@/server"; 

// Gestion des signaux d'arrêt
const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  // On ferme httpServer
  httpServer.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);

// DÉMARRAGE : On utilise httpServer.listen
const server = httpServer.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});