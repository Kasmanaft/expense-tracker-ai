'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ExportHistoryItem } from '@/types';
import CloudExportService from '@/lib/cloudExportService';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

export function ExportHistory() {
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);

  useEffect(() => {
    setHistory(CloudExportService.getInstance().getExportHistory());

    // Listen for export status changes
    const handleStatusChange = (event: CustomEvent) => {
      const { exportId, status } = event.detail;
      setHistory(prev =>
        prev.map(item =>
          item.id === exportId
            ? { ...item, status }
            : item
        )
      );
    };

    window.addEventListener('exportStatusChange', handleStatusChange as EventListener);
    return () => {
      window.removeEventListener('exportStatusChange', handleStatusChange as EventListener);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircleIcon;
      case 'failed': return XCircleIcon;
      case 'processing': return ArrowPathIcon;
      default: return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      email: 'bg-purple-100 text-purple-800',
      'cloud-sync': 'bg-blue-100 text-blue-800',
      'share-link': 'bg-green-100 text-green-800',
      'qr-code': 'bg-orange-100 text-orange-800'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No exports yet</h3>
        <p className="mt-1 text-gray-500">
          Your export history will appear here once you start sharing your data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Export History
        </h3>
        <p className="text-gray-600 mb-6">
          Track all your data exports and shares with real-time status updates.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <ul className="divide-y divide-gray-200">
          {history.map((item) => {
            const StatusIcon = getStatusIcon(item.status);

            return (
              <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                      <StatusIcon className={`h-5 w-5 ${item.status === 'processing' ? 'animate-spin' : ''}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {item.template.replace('-', ' ')} Export
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMethodBadge(item.method)}`}>
                          {item.method.replace('-', ' ')}
                        </span>
                        {item.provider && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {item.provider}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.recordCount} records</span>
                        <span>{formatCurrency(item.totalAmount)}</span>
                        <span>{format(item.createdAt, 'MMM d, yyyy h:mm a')}</span>
                      </div>

                      {item.recipientEmail && (
                        <p className="text-sm text-gray-500 mt-1">
                          Sent to: {item.recipientEmail}
                        </p>
                      )}

                      {item.errorMessage && (
                        <p className="text-sm text-red-600 mt-1">
                          Error: {item.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.shareLink && item.status === 'completed' && (
                      <button
                        onClick={() => navigator.clipboard.writeText(item.shareLink!)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Copy Link
                      </button>
                    )}

                    {item.downloadUrl && item.status === 'completed' && (
                      <a
                        href={item.downloadUrl}
                        download
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {history.filter(h => h.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Successful Exports</div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {history.reduce((sum, h) => sum + h.recordCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Records Exported</div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(history.reduce((sum, h) => sum + h.totalAmount, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Amount Exported</div>
        </div>
      </div>
    </div>
  );
}
