import { useState, useEffect } from 'react';
// On retire useLoaderData car tu as supprimé le loader
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { Download, FileText, Loader2 } from 'lucide-react';
import graphqlClient from '../../lib/graph-ql.client'; // Vérifie bien ce chemin/nom !

// --- GRAPHQL ---
const REQUEST_EXPENSE_REPORT_GQL = gql`
  mutation RequestExpenseReport($startDate: String, $endDate: String) {
    requestExpenseReport(startDate: $startDate, endDate: $endDate) {
      reportId
      status
      progress
      createdAt
    }
  }
`;

const GET_REPORT_STATUS_GQL = gql`
  query GetReportStatus($reportId: String!) {
    reportJobStatus(reportId: $reportId) {
      reportId
      status
      progress
      downloadUrl
      createdAt
      failedReason
    }
  }
`;

// --- TYPES ---

interface ReportJob {
  reportId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress: number | null;
  downloadUrl?: string;
  createdAt: string;
  failedReason?: string;
}

// Types pour les réponses API (C'est ça qui manquait !)
interface RequestReportResponse {
  requestExpenseReport: ReportJob;
}

interface ReportStatusResponse {
  reportJobStatus: ReportJob;
}

export default function Reports() {
  // États du formulaire et du job
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [reportStatus, setReportStatus] = useState<ReportJob | null>(null);
  
  // États de chargement
  const [isRequesting, setIsRequesting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // 1. Demander la génération (Mutation)
  const requestReport = async () => {
    setIsRequesting(true);
    try {
      // CORRECTION ICI : On ajoute le type <RequestReportResponse>
      const response = await graphqlClient.mutate<RequestReportResponse>({
        mutation: REQUEST_EXPENSE_REPORT_GQL,
        variables: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });

      // Maintenant TypeScript sait que requestExpenseReport existe !
      if (response.data) {
        const reportData = response.data.requestExpenseReport;
        setCurrentReportId(reportData.reportId);
        setReportStatus(reportData);
        toast.success('Génération du PDF lancée !');
      }
    } catch (error) {
      console.error('Failed to request report:', error);
      toast.error('Erreur lors de la demande du rapport');
    } finally {
      setIsRequesting(false);
    }
  };

  // 2. Vérifier le statut (Query)
  const checkReportStatus = async (reportId: string) => {
    try {
      // CORRECTION ICI : On ajoute le type <ReportStatusResponse>
      const response = await graphqlClient.query<ReportStatusResponse>({
        query: GET_REPORT_STATUS_GQL,
        variables: { reportId },
        fetchPolicy: 'network-only',
      });
      
      // Maintenant TypeScript sait que reportJobStatus existe !
      const status = response.data?.reportJobStatus;
      
      if (status) {
        setReportStatus(status);
        
        if (status.status === 'completed') {
          toast.success('Votre PDF est prêt !');
          setIsPolling(false); 
        } else if (status.status === 'failed') {
          toast.error('La génération a échoué.');
          setIsPolling(false); 
        }
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      setIsPolling(false);
    }
  };

  // 3. Effet de Polling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (currentReportId && isPolling) {
      interval = setInterval(() => {
        checkReportStatus(currentReportId);
      }, 1000);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [currentReportId, isPolling]);

  // Déclenche le polling
  useEffect(() => {
    if (currentReportId && reportStatus && 
        reportStatus.status !== 'completed' && 
        reportStatus.status !== 'failed') {
      setIsPolling(true);
    }
  }, [currentReportId, reportStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestReport();
  };

  const handleDownload = () => {
    if (reportStatus?.downloadUrl) {
      const link = document.createElement('a');
      const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
      
      link.href = `${baseUrl}${reportStatus.downloadUrl}`;
      link.download = `expense-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileText className="h-8 w-8 text-teal-700" />
          Rapports PDF
        </h1>
        <p className="text-gray-600 mt-2">Générez et téléchargez un rapport de vos dépenses.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Nouveau Rapport</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Début (Optionnel)</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin (Optionnel)</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isRequesting || isPolling}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold transition-colors"
          >
            {isRequesting ? <Loader2 className="animate-spin" /> : 'Générer le PDF'}
          </button>
        </form>
      </div>

      {reportStatus && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">État du Rapport</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-gray-600 font-mono text-sm">{reportStatus.reportId}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(reportStatus.status)}`}>
                {reportStatus.status}
              </span>
            </div>

            {reportStatus.progress !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progression</span>
                  <span>{reportStatus.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${reportStatus.progress}%` }}></div>
                </div>
              </div>
            )}

            {reportStatus.status === 'completed' && (
              <button onClick={handleDownload} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 font-bold shadow-md transition-transform active:scale-95">
                <Download className="h-5 w-5" />
                Télécharger le PDF
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}