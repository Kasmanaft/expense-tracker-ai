'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, RadioGroup, Tab } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { ExpenseStorage } from '@/lib/storage';
import { Expense, ExportFormat, ExportOptions, ExportSummary, EXPENSE_CATEGORIES, ExpenseCategory, CATEGORY_COLORS } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  // Export options state
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState(`expenses-${format(new Date(), 'yyyy-MM-dd')}`);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [includeMetadata, setIncludeMetadata] = useState(false);

  // UI state
  const [currentTab, setCurrentTab] = useState(0);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [exportSummary, setExportSummary] = useState<ExportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Load filtered expenses based on current options
  useEffect(() => {
    const options: ExportOptions = {
      format: exportFormat,
      filename,
      dateRange: {
        startDate,
        endDate,
      },
      categories: selectedCategories.length > 0 ? selectedCategories : null,
      includeMetadata,
    };

    try {
      const expenses = ExpenseStorage.getFilteredExpenses(options);
      setFilteredExpenses(expenses);

      const summary = ExpenseStorage.getExportSummary(options);
      setExportSummary(summary);
    } catch (error) {
      console.error('Error filtering expenses:', error);
    }
  }, [exportFormat, filename, startDate, endDate, selectedCategories, includeMetadata]);

  // Toggle category selection
  const toggleCategory = (category: ExpenseCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Select all categories
  const selectAllCategories = () => {
    setSelectedCategories([...EXPENSE_CATEGORIES]);
  };

  // Clear all categories
  const clearCategories = () => {
    setSelectedCategories([]);
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const options: ExportOptions = {
        format: exportFormat,
        filename,
        dateRange: {
          startDate,
          endDate,
        },
        categories: selectedCategories.length > 0 ? selectedCategories : null,
        includeMetadata,
      };

      ExpenseStorage.downloadExport(options);
      setExportSuccess(true);

      // Close modal after successful export with a delay
      setTimeout(() => {
        onClose();
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
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
          <div className="fixed inset-0 bg-black/30" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Export Expenses
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <Tab.Group selectedIndex={currentTab} onChange={setCurrentTab}>
                  <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg flex items-center justify-center
                            ${selected ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'}`}
                        >
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          Export Options
                        </button>
                      )}
                    </Tab>
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg flex items-center justify-center
                            ${selected ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'}`}
                        >
                          <TableCellsIcon className="h-5 w-5 mr-2" />
                          Data Preview
                        </button>
                      )}
                    </Tab>
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg flex items-center justify-center
                            ${selected ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'}`}
                        >
                          <ChartPieIcon className="h-5 w-5 mr-2" />
                          Summary
                        </button>
                      )}
                    </Tab>
                  </Tab.List>

                  <Tab.Panels>
                    {/* Export Options Panel */}
                    <Tab.Panel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          {/* Format Selection */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Export Format</h3>
                            <RadioGroup value={exportFormat} onChange={setExportFormat} className="mt-2">
                              <div className="grid grid-cols-3 gap-3">
                                {(['csv', 'json', 'pdf'] as ExportFormat[]).map((format) => (
                                  <RadioGroup.Option
                                    key={format}
                                    value={format}
                                    className={({ active, checked }) =>
                                      `${active ? 'ring-2 ring-blue-500' : ''}
                                      ${checked ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}
                                      relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                                    }
                                  >
                                    {({ checked }) => (
                                      <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                          <div className="text-sm">
                                            <RadioGroup.Label
                                              as="p"
                                              className={`font-medium uppercase ${checked ? 'text-white' : 'text-gray-900'}`}
                                            >
                                              {format}
                                            </RadioGroup.Label>
                                          </div>
                                        </div>
                                        {checked && (
                                          <div className="shrink-0 text-white">
                                            <CheckCircleIcon className="h-6 w-6" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Filename */}
                          <div>
                            <label htmlFor="filename" className="block text-lg font-medium text-gray-900 mb-3">
                              Filename
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="filename"
                                id="filename"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                placeholder="expenses-export"
                              />
                              <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                .{exportFormat === 'pdf' ? 'html' : exportFormat}
                              </span>
                            </div>
                          </div>

                          {/* Include Metadata */}
                          <div className="flex items-center">
                            <input
                              id="include-metadata"
                              name="include-metadata"
                              type="checkbox"
                              checked={includeMetadata}
                              onChange={(e) => setIncludeMetadata(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="include-metadata" className="ml-2 block text-sm text-gray-900">
                              Include metadata (ID, created/updated dates)
                            </label>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Date Range */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Date Range</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                                  Start Date
                                </label>
                                <DatePicker
                                  id="start-date"
                                  selected={startDate}
                                  onChange={setStartDate}
                                  selectsStart
                                  startDate={startDate}
                                  endDate={endDate}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                  placeholderText="Select start date"
                                />
                              </div>
                              <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                                  End Date
                                </label>
                                <DatePicker
                                  id="end-date"
                                  selected={endDate}
                                  onChange={setEndDate}
                                  selectsEnd
                                  startDate={startDate}
                                  endDate={endDate}
                                  minDate={startDate}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                  placeholderText="Select end date"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Categories */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                              <div className="space-x-2">
                                <button
                                  type="button"
                                  onClick={selectAllCategories}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Select All
                                </button>
                                <button
                                  type="button"
                                  onClick={clearCategories}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {EXPENSE_CATEGORIES.map((category) => (
                                <div
                                  key={category}
                                  className={`flex items-center p-2 rounded-md cursor-pointer border ${
                                    selectedCategories.includes(category)
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-300'
                                  }`}
                                  onClick={() => toggleCategory(category)}
                                >
                                  <div
                                    className="h-4 w-4 rounded-full mr-2"
                                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                                  ></div>
                                  <span className="text-sm font-medium text-gray-900">{category}</span>
                                  {selectedCategories.includes(category) && (
                                    <CheckCircleIcon className="h-5 w-5 text-blue-500 ml-auto" />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              {selectedCategories.length === 0
                                ? 'All categories will be included'
                                : `${selectedCategories.length} ${
                                    selectedCategories.length === 1 ? 'category' : 'categories'
                                  } selected`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Data Preview Panel */}
                    <Tab.Panel>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            Data Preview
                          </h3>
                          <span className="text-sm text-gray-500">
                            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'record' : 'records'} selected
                          </span>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                                  {includeMetadata && (
                                    <>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Updated</th>
                                    </>
                                  )}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredExpenses.length > 0 ? (
                                  filteredExpenses.slice(0, 10).map((expense) => (
                                    <tr key={expense.id}>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {format(expense.date, 'yyyy-MM-dd')}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className="flex items-center">
                                          <span
                                            className="h-2 w-2 rounded-full mr-2"
                                            style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                                          ></span>
                                          {expense.category}
                                        </span>
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {formatCurrency(expense.amount)}
                                      </td>
                                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {expense.description}
                                      </td>
                                      {includeMetadata && (
                                        <>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {expense.id.slice(0, 8)}...
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {format(expense.createdAt, 'yyyy-MM-dd')}
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {format(expense.updatedAt, 'yyyy-MM-dd')}
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={includeMetadata ? 7 : 4}
                                      className="px-3 py-4 text-sm text-gray-500 text-center"
                                    >
                                      No expenses match your filter criteria
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          {filteredExpenses.length > 10 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                              <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">10</span> of{' '}
                                <span className="font-medium">{filteredExpenses.length}</span> records
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Summary Panel */}
                    <Tab.Panel>
                      {exportSummary && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                              <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                  Total Records
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                  {exportSummary.recordCount}
                                </dd>
                              </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                              <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                  Total Amount
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                  {formatCurrency(exportSummary.totalAmount)}
                                </dd>
                              </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                              <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                  Date Range
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                  {exportSummary.dateRange.startDate
                                    ? format(exportSummary.dateRange.startDate, 'MMM d, yyyy')
                                    : 'All time'}{' '}
                                  {exportSummary.dateRange.startDate && exportSummary.dateRange.endDate && '→'}{' '}
                                  {exportSummary.dateRange.endDate &&
                                    format(exportSummary.dateRange.endDate, 'MMM d, yyyy')}
                                </dd>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Category Breakdown</h3>
                            <div className="bg-white shadow overflow-hidden rounded-md">
                              <ul className="divide-y divide-gray-200">
                                {Object.entries(exportSummary.categoryBreakdown).map(([category, amount]) => (
                                  <li key={category} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div
                                          className="h-4 w-4 rounded-full mr-3"
                                          style={{ backgroundColor: CATEGORY_COLORS[category as ExpenseCategory] }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-900">{category}</span>
                                      </div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(amount)}
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <div className="bg-gray-200 rounded-full h-2.5">
                                        <div
                                          className="h-2.5 rounded-full"
                                          style={{
                                            width: `${(amount / exportSummary.totalAmount) * 100}%`,
                                            backgroundColor: CATEGORY_COLORS[category as ExpenseCategory],
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="mr-4 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting || filteredExpenses.length === 0}
                    className={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isExporting || filteredExpenses.length === 0
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                  >
                    {isExporting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exporting...
                      </>
                    ) : exportSuccess ? (
                      <>
                        <CheckCircleIcon className="-ml-1 mr-2 h-4 w-4" />
                        Exported!
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="-ml-1 mr-2 h-4 w-4" />
                        Export {filteredExpenses.length} {filteredExpenses.length === 1 ? 'Record' : 'Records'}
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
