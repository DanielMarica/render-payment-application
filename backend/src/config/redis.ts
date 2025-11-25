import { ConnectionOptions } from 'bullmq';
import { env } from '../common/utils/envConfig'; // Ou process.env si tu n'as pas envConfig

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD, // Optionnel en local
  // Options recommandées pour la production par BullMQ :
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};