// backend/src/scripts/test-pdf.ts
import { queuePdfGeneration } from '../queues/pdfQueue';

async function main() {
  console.log('🧪 Test manuel de la génération PDF...');

  // On simule une demande pour Alice (ID 6 selon ton seed)
  // On génère un faux ID de rapport
  const fakeReportId = `test-report-${Date.now()}`;

  try {
    console.log(`📤 Envoi du job dans la queue pour l'utilisateur 6...`);
    
    await queuePdfGeneration({
      userId: 6, // Assure-toi que cet ID existe dans ta BDD
      reportId: fakeReportId,
      // On peut tester les dates ou laisser vide pour "tout"
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31')
    });

    console.log('✅ Job envoyé avec succès ! Regarde ton terminal "Worker".');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi :', error);
  }
  
  // On laisse le script respirer une seconde puis on coupe
  setTimeout(() => process.exit(0), 1000);
}

main();