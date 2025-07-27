'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import {
  XMarkIcon,
  CloudIcon,
  ShareIcon,
  ClockIcon,
  ChartBarIcon,
  EnvelopeIcon,
  LinkIcon,
  QrCodeIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  CloudExportOptions,
  ExportTemplate,
  ExportMethod,
  CloudProvider,
  EXPORT_TEMPLATES
} from '@/types';
import CloudExportService from '@/lib/cloudExportService';
import { ExportTemplateSelector } from './ExportTemplateSelector';
import { CloudIntegrations } from './CloudIntegrations';
import { ExportHistory } from './ExportHistory';
import { ShareableExport } from './ShareableExport';
import { ScheduledExports } from './ScheduledExports';

interface CloudExportHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CloudExportHub({ isOpen, onClose }: CloudExportHubProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('monthly-summary');
  const [selectedMethod, setSelectedMethod] = useState<ExportMethod>('email');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('google-sheets');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const cloudService = CloudExportService.getInstance();
  const templates = cloudService.getTemplates();
  const integrations = cloudService.getCloudIntegrations();

  // Handle export based on selected method
  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const options: CloudExportOptions = {
        template: selectedTemplate,
        method: selectedMethod,
        provider: selectedMethod === 'cloud-sync' ? selectedProvider : undefined,
        emailAddress: selectedMethod === 'email' ? emailAddress : undefined
      };

      let result;
      switch (selectedMethod) {
        case 'email':
          result = await cloudService.simulateEmailExport(options);
          break;
        case 'cloud-sync':
          result = await cloudService.simulateCloudSync(options);
          break;
        case 'share-link':
          result = await cloudService.createShareableExport(options);
          break;
        default:
          throw new Error('Unsupported export method');
      }

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getMethodIcon = (method: ExportMethod) => {
    switch (method) {
      case 'email': return EnvelopeIcon;
      case 'cloud-sync': return CloudIcon;
      case 'share-link': return LinkIcon;
      case 'qr-code': return QrCodeIcon;
      default: return ShareIcon;
    }
  };

  const getMethodDescription = (method: ExportMethod) => {
    switch (method) {
      case 'email': return 'Send directly to your inbox';
      case 'cloud-sync': return 'Sync to your cloud storage';
      case 'share-link': return 'Create a shareable link';
      case 'qr-code': return 'Generate QR code for easy sharing';
      default: return 'Share your data';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <CloudIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold">
                          Cloud Export Hub
                        </Dialog.Title>
                        <p className="text-blue-100 mt-1">
                          Share and sync your expense data across platforms
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-white/70 hover:text-white focus:outline-none"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <Tab.Group selectedIndex={currentTab} onChange={setCurrentTab}>
                  <div className="border-b border-gray-200 bg-gray-50">
                    <Tab.List className="flex space-x-8 px-6">
                      {[
                        { name: 'Export', icon: ShareIcon },
                        { name: 'Integrations', icon: CloudIcon },
                        { name: 'History', icon: ClockIcon },
                        { name: 'Sharing', icon: LinkIcon },
                        { name: 'Schedule', icon: CogIcon }
                      ].map((tab, index) => (
                        <Tab key={tab.name} as={Fragment}>
                          {({ selected }) => (
                            <button
                              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                selected
                                  ? 'border-blue-500 text-blue-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <tab.icon className="h-5 w-5" />
                              <span>{tab.name}</span>
                            </button>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>

                  <Tab.Panels className="p-6">
                    {/* Export Panel */}
                    <Tab.Panel>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Template Selection */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Choose Export Template
                            </h3>
                            <ExportTemplateSelector
                              templates={templates}
                              selectedTemplate={selectedTemplate}
                              onTemplateSelect={setSelectedTemplate}
                            />
                          </div>
                        </div>

                        {/* Right Column: Export Method */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Select Export Method
                            </h3>
                            <div className="space-y-3">
                              {(['email', 'cloud-sync', 'share-link'] as ExportMethod[]).map((method) => {
                                const Icon = getMethodIcon(method);
                                return (
                                  <div
                                    key={method}
                                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                                      selectedMethod === method
                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                                        : 'border-gray-300 bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedMethod(method)}
                                  >
                                    <div className="flex w-full items-center justify-between">
                                      <div className="flex items-center">
                                        <Icon className="h-6 w-6 text-gray-600 mr-3" />
                                        <div className="text-sm">
                                          <p className="font-medium text-gray-900 capitalize">
                                            {method.replace('-', ' ')}
                                          </p>
                                          <p className="text-gray-500">
                                            {getMethodDescription(method)}
                                          </p>
                                        </div>
                                      </div>
                                      {selectedMethod === method && (
                                        <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Method-specific options */}
                          {selectedMethod === 'email' && (
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                                placeholder="Enter your email address"
                              />
                            </div>
                          )}

                          {selectedMethod === 'cloud-sync' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cloud Provider
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {integrations.slice(0, 4).map((integration) => (
                                  <div
                                    key={integration.provider}
                                    className={`relative flex cursor-pointer rounded-lg border p-3 focus:outline-none ${
                                      selectedProvider === integration.provider
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedProvider(integration.provider)}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center">
                                        <span className="text-2xl mr-2">{integration.icon}</span>
                                        <span className="text-sm font-medium">{integration.name}</span>
                                      </div>
                                      {integration.isConnected && (
                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Export Button */}
                          <div className="pt-4">
                            <button
                              onClick={handleExport}
                              disabled={isExporting || (selectedMethod === 'email' && !emailAddress)}
                              className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                isExporting || (selectedMethod === 'email' && !emailAddress)
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500'
                              }`}
                            >
                              {isExporting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : exportSuccess ? (
                                <>
                                  <CheckCircleIcon className="-ml-1 mr-3 h-5 w-5" />
                                  Export Successful!
                                </>
                              ) : (
                                <>
                                  <ShareIcon className="-ml-1 mr-3 h-5 w-5" />
                                  Start Export
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Cloud Integrations Panel */}
                    <Tab.Panel>
                      <CloudIntegrations />
                    </Tab.Panel>

                    {/* Export History Panel */}
                    <Tab.Panel>
                      <ExportHistory />
                    </Tab.Panel>

                    {/* Sharing Panel */}
                    <Tab.Panel>
                      <ShareableExport />
                    </Tab.Panel>

                    {/* Scheduled Exports Panel */}
                    <Tab.Panel>
                      <ScheduledExports />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
