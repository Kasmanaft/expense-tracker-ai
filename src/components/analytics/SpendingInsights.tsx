'use client';

import { DashboardStats, Expense } from '@/types';
import { formatCurrency, getMonthlyExpenses } from '@/lib/utils';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface SpendingInsightsProps {
  stats: DashboardStats;
  expenses: Expense[];
}

export function SpendingInsights({ stats, expenses }: SpendingInsightsProps) {
  // Calculate previous month data for comparison
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

  const currentMonthExpenses = getMonthlyExpenses(expenses, currentDate);
  const lastMonthExpenses = getMonthlyExpenses(expenses, lastMonth);

  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyChange = lastMonthTotal > 0
    ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  // Calculate average transaction amount
  const avgTransactionAmount = expenses.length > 0
    ? stats.totalExpenses / expenses.length
    : 0;

  // Find the highest single expense
  const highestExpense = expenses.reduce((max, expense) =>
    expense.amount > max.amount ? expense : max,
    expenses[0] || { amount: 0, description: 'N/A', category: 'Other' as any }
  );

  // Calculate spending frequency
  const daysWithExpenses = new Set(
    expenses.map(expense => expense.date.toDateString())
  ).size;

  const totalDays = Math.max(
    Math.ceil(
      (new Date().getTime() - new Date(Math.min(...expenses.map(e => e.date.getTime()))).getTime())
      / (1000 * 60 * 60 * 24)
    ),
    1
  );

  const spendingFrequency = expenses.length > 0 ? (daysWithExpenses / totalDays) * 100 : 0;

  const insights = [
    {
      title: 'Monthly Comparison',
      value: formatCurrency(currentMonthTotal),
      change: monthlyChange,
      description: `vs last month (${formatCurrency(lastMonthTotal)})`,
      isPositive: monthlyChange <= 0 // Lower spending is positive
    },
    {
      title: 'Average Transaction',
      value: formatCurrency(avgTransactionAmount),
      description: `across ${expenses.length} transactions`,
      info: 'Average amount per expense'
    },
    {
      title: 'Highest Single Expense',
      value: formatCurrency(highestExpense.amount),
      description: highestExpense.description.length > 20
        ? highestExpense.description.substring(0, 20) + '...'
        : highestExpense.description,
      info: `Category: ${highestExpense.category}`
    },
    {
      title: 'Spending Frequency',
      value: `${spendingFrequency.toFixed(1)}%`,
      description: `${daysWithExpenses} days out of ${totalDays} days`,
      info: 'Percentage of days with expenses'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Spending Insights</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-600">{insight.title}</h4>
              {'change' in insight && insight.change !== undefined && (
                <div className={`flex items-center ${
                  insight.isPositive
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {insight.isPositive ? (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(insight.change).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            <p className="text-2xl font-bold text-gray-900">{insight.value}</p>

            <p className="text-sm text-gray-500">{insight.description}</p>

            {insight.info && (
              <p className="text-xs text-gray-400">{insight.info}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-3">💡 Quick Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyChange > 10 && (
            <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
              Your spending increased by {monthlyChange.toFixed(1)}% this month. Consider reviewing your largest expense categories.
            </div>
          )}

          {stats.categorySummary[0]?.percentage > 50 && (
            <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
              {stats.categorySummary[0].category} accounts for {stats.categorySummary[0].percentage.toFixed(1)}% of your spending. Consider setting a budget for this category.
            </div>
          )}

          {avgTransactionAmount > 100 && (
            <div className="text-sm text-purple-700 bg-purple-50 p-3 rounded-lg">
              Your average transaction is ${avgTransactionAmount.toFixed(0)}. Look for opportunities to reduce larger purchases.
            </div>
          )}

          {spendingFrequency > 80 && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
              You're tracking expenses consistently! Keep up the good habit of recording your spending.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
