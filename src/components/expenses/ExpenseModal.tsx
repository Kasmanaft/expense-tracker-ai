'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Expense, ExpenseFormData } from '@/types';
import { ExpenseStorage } from '@/lib/storage';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/types';
import { ExpenseForm } from '@/components/forms/ExpenseForm';

interface ExpenseModalProps {
  expense: Expense;
  mode: 'view' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function ExpenseModal({ expense, mode, isOpen, onClose, onUpdate }: ExpenseModalProps) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setCurrentMode('edit');
  };

  const handleCancel = () => {
    setCurrentMode('view');
    setError(null);
  };

  const handleSubmit = async (formData: ExpenseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const amount = parseFloat(formData.amount);

      const success = ExpenseStorage.updateExpense(expense.id, {
        date: formData.date,
        amount,
        category: formData.category,
        description: formData.description.trim()
      });

      if (success) {
        onUpdate();
      } else {
        setError('Failed to update expense. Please try again.');
      }
    } catch (err) {
      console.error('Error updating expense:', err);
      setError('Failed to update expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialFormData: ExpenseFormData = {
    date: expense.date,
    amount: expense.amount.toString(),
    category: expense.category,
    description: expense.description
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {currentMode === 'view' ? 'Expense Details' : 'Edit Expense'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {currentMode === 'view' ? (
                  <div className="space-y-4">
                    {/* View Mode */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl">{CATEGORY_ICONS[expense.category]}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                        <p className="text-gray-600">{expense.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Date</label>
                        <p className="text-gray-900">{formatDate(expense.date)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Amount</label>
                        <p className="text-xl font-semibold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Description
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {expense.description}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 border-t pt-3">
                      <p>Created: {formatDate(expense.createdAt)}</p>
                      {expense.updatedAt.getTime() !== expense.createdAt.getTime() && (
                        <p>Updated: {formatDate(expense.updatedAt)}</p>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleEdit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Edit Expense
                      </button>
                      <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Edit Mode */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}

                    <ExpenseForm
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      submitButtonText="Update Expense"
                      initialData={initialFormData}
                    />

                    <div className="flex space-x-3 mt-4 pt-4 border-t">
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
