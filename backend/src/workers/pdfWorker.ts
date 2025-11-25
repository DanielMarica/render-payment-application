import { Worker, Job } from 'bullmq';
import { redisConnection } from '@/config/redis';
import { PDF_QUEUE_NAME } from '@/queues/pdfQueue';
import { generateExpenseReport } from '@/services/pdfGenerator';
import type { GeneratePdfJobData, PdfJobResult } from '@/types/JobTypes';
// Import pour les notifications temps réel (Étape 8)
import { emitReportReady } from '../socket/event';

export const pdfWorker = new Worker<GeneratePdfJobData, PdfJobResult>(
  PDF_QUEUE_NAME,
  async (job: Job<GeneratePdfJobData>) => {
    console.log(`📄 Processing PDF job ${job.id} for user ${job.data.userId}`);
    
    try {
      // 1. Notification de début
      await job.updateProgress(10);
      
      // 2. Génération du fichier PDF
      // (Cette fonction renvoie le nom du fichier, ex: "report-123.pdf")
      const filename = await generateExpenseReport({
        userId: job.data.userId,
        startDate: job.data.startDate,
        endDate: job.data.endDate,
      });
      
      await job.updateProgress(90);
      console.log(`✅ PDF generated: ${filename}`);
      
      await job.updateProgress(100);
      
      // 3. Retour du résultat (stocké dans Redis)
      return {
        reportId: job.data.reportId,
        filePath: filename, // On stocke juste le nom du fichier
        generatedAt: new Date(),
      };

    } catch (error) {
      console.error(`❌ PDF generation failed for job ${job.id}:`, error);
      throw error; // Important pour marquer le job comme "failed" dans BullMQ
    }
  },
  {
    connection: redisConnection,
    concurrency: 2, // Traite jusqu'à 2 PDFs en même temps
  }
);

// --- ÉCOUTEURS D'ÉVÉNEMENTS ---

pdfWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);

  // ÉTAPE 8 : Notification Temps Réel
  // Si le job a réussi et renvoyé un résultat
  if (job.returnvalue) {
    emitReportReady({
      reportId: job.returnvalue.reportId,
      userId: job.data.userId,
      // On reconstruit l'URL publique pour le frontend
      downloadUrl: `/reports/${job.returnvalue.filePath}`,
    });
  }
});

pdfWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

pdfWorker.on('error', (err) => {
  console.error('❌ Worker error:', err);
});

console.log('🚀 PDF Worker started');