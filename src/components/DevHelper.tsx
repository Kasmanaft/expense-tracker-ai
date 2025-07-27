'use client';

import { useState } from 'react';
import { addSampleData, clearAllData } from '@/lib/sampleData';

export function DevHelper() {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-3 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        🔧 Dev
      </button>
    );
  }

  const handleAddSampleData = () => {
    addSampleData();
    window.location.reload();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg min-w-48">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Dev Tools</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleAddSampleData}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          Add Sample Data
        </button>

        <button
          onClick={handleClearData}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          Clear All Data
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Development only
      </p>
    </div>
  );
}
