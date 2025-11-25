
import { useMutation } from '@apollo/client/react';
import{gql} from '@apollo/client'
import { toast } from 'sonner';

const REQUEST_REPORT_MUTATION = gql`
  mutation RequestReport($startDate: String, $endDate: String) {
    requestExpenseReport(startDate: $startDate, endDate: $endDate) {
      reportId
      status
    }
  }
`;

type RequestReportData = {
  requestExpenseReport: {
    reportId: string;
    status: string;
  } | null;
};

type RequestReportVars = {
  startDate?: string | null;
  endDate?: string | null;
};

export function RequestReportButton() {
  const [requestReport, { loading }] = useMutation<RequestReportData, RequestReportVars>(REQUEST_REPORT_MUTATION);

  const handleRequest = async () => {
    try {
      const { data } = await requestReport({
        variables: {
          // Optional: specify date range
          // startDate: new Date('2025-01-01').toISOString(),
          // endDate: new Date('2025-12-31').toISOString(),
        },
      });

      const reportId = data?.requestExpenseReport?.reportId ?? 'unknown';

      toast.success('Report generation started!', {
        description: `Report ID: ${reportId}`,
      });
    } catch (error) {
      toast.error('Failed to request report');
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {loading ? 'Requesting...' : 'Generate PDF Report'}
    </button>
  );
}
