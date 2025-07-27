import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/types';
import Link from 'next/link';

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No expenses yet</p>
          <Link
            href="/add"
            className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
          >
            Add your first expense
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
        <Link
          href="/expenses"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {CATEGORY_ICONS[expense.category]}
              </div>
              <div>
                <p className="font-medium text-gray-900 truncate max-w-40">
                  {expense.description}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(expense.date)} • {expense.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
