'use client';

import { useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { CloudIntegration } from '@/types';
import CloudExportService from '@/lib/cloudExportService';
import { formatDistanceToNow } from 'date-fns';

export function CloudIntegrations() {
  const [integrations, setIntegrations] = useState<CloudIntegration[]>(
    CloudExportService.getInstance().getCloudIntegrations()
  );
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  const handleConnect = async (provider: string) => {
    setConnectingProvider(provider);

    try {
      const success = await CloudExportService.getInstance().connectCloudProvider(provider as any);
      if (success) {
        // Update the local state
        setIntegrations(prev =>
          prev.map(integration =>
            integration.provider === provider
              ? { ...integration, isConnected: true, status: 'connected' as const, lastSyncAt: new Date() }
              : integration
          )
        );
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = (provider: string) => {
    const success = CloudExportService.getInstance().disconnectCloudProvider(provider as any);
    if (success) {
      setIntegrations(prev =>
        prev.map(integration =>
          integration.provider === provider
            ? { ...integration, isConnected: false, status: 'disconnected' as const, lastSyncAt: undefined }
            : integration
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'syncing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircleIcon;
      case 'syncing': return ArrowPathIcon;
      case 'error': return ExclamationTriangleIcon;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Cloud Service Integrations
        </h3>
        <p className="text-gray-600 mb-6">
          Connect your cloud services to automatically sync and share your expense data across platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const StatusIcon = getStatusIcon(integration.status);
          const isConnecting = connectingProvider === integration.provider;

          return (
            <div
              key={integration.provider}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">{integration.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {integration.name}
                    </h4>
                    <div className="flex items-center mt-1">
                      {StatusIcon && (
                        <StatusIcon className={`h-4 w-4 mr-1 ${getStatusColor(integration.status)} ${
                          integration.status === 'syncing' ? 'animate-spin' : ''
                        }`} />
                      )}
                      <span className={`text-sm font-medium capitalize ${getStatusColor(integration.status)}`}>
                        {integration.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {integration.isConnected ? (
                    <button
                      onClick={() => handleDisconnect(integration.provider)}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.provider)}
                      disabled={isConnecting}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? (
                        <>
                          <ArrowPathIcon className="animate-spin h-4 w-4 mr-1" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Last Sync Info */}
              {integration.lastSyncAt && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Last synced:</strong> {formatDistanceToNow(integration.lastSyncAt, { addSuffix: true })}
                  </p>
                </div>
              )}

              {/* Permissions */}
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h5>
                <div className="flex flex-wrap gap-1">
                  {integration.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              {/* Integration Benefits */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-2">What you can do:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {integration.provider === 'google-sheets' && (
                    <>
                      <li>• Auto-sync expense data to spreadsheets</li>
                      <li>• Create pivot tables and charts</li>
                      <li>• Share with your accountant</li>
                    </>
                  )}
                  {integration.provider === 'dropbox' && (
                    <>
                      <li>• Backup exports automatically</li>
                      <li>• Access from any device</li>
                      <li>• Share folders with team members</li>
                    </>
                  )}
                  {integration.provider === 'onedrive' && (
                    <>
                      <li>• Integrate with Microsoft Office</li>
                      <li>• Collaborate on Excel files</li>
                      <li>• Enterprise-grade security</li>
                    </>
                  )}
                  {integration.provider === 'airtable' && (
                    <>
                      <li>• Create custom database views</li>
                      <li>• Build workflows and automations</li>
                      <li>• Advanced filtering and sorting</li>
                    </>
                  )}
                  {integration.provider === 'notion' && (
                    <>
                      <li>• Embed in your workspace</li>
                      <li>• Create rich documentation</li>
                      <li>• Link to projects and notes</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Connect Google Sheets for real-time collaborative analysis</li>
          <li>• Use Dropbox for automatic backup of all your exports</li>
          <li>• Airtable is perfect for creating custom expense workflows</li>
          <li>• Notion integration helps you build comprehensive financial dashboards</li>
        </ul>
      </div>
    </div>
  );
}
