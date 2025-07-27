'use client';

import { useState } from 'react';
import { QrCodeIcon, LinkIcon, EyeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export function ShareableExport() {
  const [shareLink] = useState('https://expense-tracker.com/shared/abc123');
  const [qrCode] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A//expense-tracker.com/shared/abc123');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Share Your Data
        </h3>
        <p className="text-gray-600 mb-6">
          Create secure, shareable links for your expense data with custom permissions and expiration dates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Share Link */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <LinkIcon className="h-6 w-6 text-blue-600" />
            <h4 className="text-lg font-semibold">Shareable Link</h4>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-mono text-gray-800 break-all">{shareLink}</p>
            </div>

            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Copy Link
            </button>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-4 w-4" />
                <span>127 views</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="h-4 w-4" />
                <span>34 unique viewers</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <QrCodeIcon className="h-6 w-6 text-purple-600" />
            <h4 className="text-lg font-semibold">QR Code</h4>
          </div>

          <div className="text-center">
            <img
              src={qrCode}
              alt="QR Code"
              className="mx-auto mb-4 border rounded-lg"
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Download QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Sharing Analytics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
        <h4 className="text-lg font-semibold mb-4">📊 Sharing Analytics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">127</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">34</div>
            <div className="text-sm text-gray-600">Unique Viewers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">65%</div>
            <div className="text-sm text-gray-600">Mobile Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-gray-600">Downloads</div>
          </div>
        </div>
      </div>
    </div>
  );
}
