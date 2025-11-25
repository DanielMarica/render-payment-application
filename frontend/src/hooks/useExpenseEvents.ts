import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import type { ExpenseCreatedEvent, ReportReadyEvent } from '@/types/SocketEvents';

export function useExpenseEvents() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle expense created
    const handleExpenseCreated = (event: ExpenseCreatedEvent) => {
      console.log('📥 Expense created event:', event);

      toast.success(
        `New expense: ${event.description}`,
        {
          description: `€${event.amount.toFixed(2)} paid by ${event.payerName}`,
          duration: 5000,
        }
      );
    };

    // Handle report ready
    const handleReportReady = (event: ReportReadyEvent) => {
      console.log('📥 Report ready event:', event);

      toast.success(
        'Your expense report is ready!',
        {
          description: 'Click here to download',
          duration: 10000,
          action: {
            label: 'Download',
            onClick: () => {
              window.open(event.downloadUrl, '_blank');
            },
          },
        }
      );
    };

    // Register listeners
    socket.on('expense:created', handleExpenseCreated);
    socket.on('report:ready', handleReportReady);

    // Cleanup
    return () => {
      socket.off('expense:created', handleExpenseCreated);
      socket.off('report:ready', handleReportReady);
    };
  }, [socket, isConnected]);
}