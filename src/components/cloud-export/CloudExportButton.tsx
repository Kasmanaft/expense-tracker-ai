'use client';

import { useState } from 'react';
import { CloudIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CloudExportHub } from './CloudExportHub';

export function CloudExportButton() {
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
        className="group relative inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
        <div className="relative flex items-center">
          <CloudIcon className="h-6 w-6 mr-2" />
          <span className="flex items-center">
            Cloud Export
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white/20 text-white">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Pro
            </span>
          </span>
        </div>
      </button>

      <CloudExportHub isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
