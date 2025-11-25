import { Queue } from 'bullmq';
import { redisConnection } from './redis';

async function testRedis() {
  console.log('🔌 Tentative de connexion à Redis...');

  // On crée une file d'attente de test
  const testQueue = new Queue('test-connection', { connection: redisConnection });

  try {
    // On essaie d'ajouter un travail dedans
    await testQueue.add('test-job', { message: 'Hello Redis!' });
    console.log('✅ Connexion Redis réussie !');

    const counts = await testQueue.getJobCounts();
    console.log(`📊 Jobs dans la file :`, counts);

    // Nettoyage
    await testQueue.obliterate({ force: true });
    console.log('🧹 File de test nettoyée.');

  } catch (error) {
    console.error('❌ Échec de la connexion Redis :', error);
  } finally {
    // On ferme la connexion proprement
    await testQueue.close();
    process.exit(0);
  }
}

testRedis();