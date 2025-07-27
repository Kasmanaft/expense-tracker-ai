'use client';

import { useEffect, useState } from 'react';
import { ExpenseStorage } from '@/lib/storage';
import { getDashboardStats } from '@/lib/utils';
import { DashboardStats } from '@/types';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      try {
        const expenses = ExpenseStorage.getExpenses();
        const dashboardStats = getDashboardStats(expenses);
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Error loading dashboard data
        </h2>
        <p className="text-gray-600 mt-2">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your expenses and spending patterns
        </p>
      </div>

      <DashboardOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentExpenses expenses={stats.recentExpenses} />
        <CategoryBreakdown categories={stats.categorySummary} />
      </div>
    </div>
  );
}
