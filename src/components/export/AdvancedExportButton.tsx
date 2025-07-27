'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ExportModal } from './ExportModal';

export function AdvancedExportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        <span className="flex items-center">
          Export Data
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-200 text-blue-800">
            <ChartBarIcon className="h-3 w-3 mr-1" />
            Advanced
          </span>
        </span>
      </button>

      <ExportModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
