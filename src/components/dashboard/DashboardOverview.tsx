import { DashboardStats } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface DashboardOverviewProps {
  stats: DashboardStats;
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      icon: CurrencyDollarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All time spending'
    },
    {
      title: `${currentMonth} Expenses`,
      value: formatCurrency(stats.monthlyExpenses),
      icon: CalendarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'This month\'s spending'
    },
    {
      title: 'Categories',
      value: stats.categorySummary.length.toString(),
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Active categories'
    },
    {
      title: 'Total Transactions',
      value: stats.categorySummary.reduce((total, cat) => total + cat.count, 0).toString(),
      icon: ClipboardDocumentListIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'All transactions'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
