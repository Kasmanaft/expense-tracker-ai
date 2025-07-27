'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ExpenseFormData, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types';
import { validateExpenseAmount, validateExpenseDescription } from '@/lib/utils';
import { CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ExpenseFormData>;
}

export function ExpenseForm({
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Submit',
  initialData
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: initialData?.date || new Date(),
    amount: initialData?.amount || '',
    category: initialData?.category || 'Other',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState<{
    amount?: string;
    description?: string;
  }>({});

  const [touched, setTouched] = useState<{
    amount?: boolean;
    description?: boolean;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const amountError = validateExpenseAmount(formData.amount);
    if (amountError) newErrors.amount = amountError;

    const descriptionError = validateExpenseDescription(formData.description);
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      amount: true,
      description: true
    });

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, amount: value }));
    if (touched.amount) {
      const error = validateExpenseAmount(value);
      setErrors(prev => ({ ...prev, amount: error || undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
    if (touched.description) {
      const error = validateExpenseDescription(value);
      setErrors(prev => ({ ...prev, description: error || undefined }));
    }
  };

  const handleAmountBlur = () => {
    setTouched(prev => ({ ...prev, amount: true }));
    const error = validateExpenseAmount(formData.amount);
    setErrors(prev => ({ ...prev, amount: error || undefined }));
  };

  const handleDescriptionBlur = () => {
    setTouched(prev => ({ ...prev, description: true }));
    const error = validateExpenseDescription(formData.description);
    setErrors(prev => ({ ...prev, description: error || undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Field */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <div className="relative">
          <DatePicker
            selected={formData.date}
            onChange={(date: Date | null) =>
              setFormData(prev => ({ ...prev, date: date || new Date() }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dateFormat="MMMM d, yyyy"
            maxDate={new Date()}
            placeholderText="Select date"
          />
          <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Amount Field */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onBlur={handleAmountBlur}
            className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
            required
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          onBlur={handleDescriptionBlur}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter expense description..."
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.description.length}/200 characters
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
