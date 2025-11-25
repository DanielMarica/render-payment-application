import '@/common/utils/envConfig'; // Charge les variables d'env
import { pdfWorker } from './pdfWorker';

// Gestion propre de l'arrêt (Ctrl+C)
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing workers...');
  await pdfWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing workers...');
  await pdfWorker.close();
  process.exit(0);
});