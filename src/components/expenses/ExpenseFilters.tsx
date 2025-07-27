'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/types';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ExpenseFiltersProps {
  filters: {
    category: ExpenseCategory | 'All';
    dateFrom?: Date;
    dateTo?: Date;
    searchTerm: string;
  };
  onFiltersChange: (filters: any) => void;
  totalCount: number;
  filteredCount: number;
}

export function ExpenseFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount
}: ExpenseFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'All',
      dateFrom: undefined,
      dateTo: undefined,
      searchTerm: ''
    });
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.searchTerm !== '';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col space-y-4">
        {/* Search and Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Quick Filter */}
          <div className="sm:w-48">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <DatePicker
                  selected={filters.dateFrom}
                  onChange={(date: Date | null) => handleFilterChange('dateFrom', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select start date"
                  maxDate={new Date()}
                  isClearable
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <DatePicker
                  selected={filters.dateTo}
                  onChange={(date: Date | null) => handleFilterChange('dateTo', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select end date"
                  minDate={filters.dateFrom}
                  maxDate={new Date()}
                  isClearable
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Summary and Clear Filters */}
        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-4">
          <span>
            Showing {filteredCount} of {totalCount} expenses
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
