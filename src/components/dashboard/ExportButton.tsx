'use client';

import { useState } from 'react';
import { ExpenseStorage } from '@/lib/storage';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      // Use the existing storage utility to download expenses as CSV
      ExpenseStorage.downloadCsv();
    } catch (error) {
      console.error('Error exporting expenses:', error);
      alert('Failed to export expenses. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
}
