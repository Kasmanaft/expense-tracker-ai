import { CategorySummary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types';

interface CategoryBreakdownProps {
  categories: CategorySummary[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No expenses to categorize yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{CATEGORY_ICONS[category.category]}</span>
                <span className="font-medium text-gray-900">{category.category}</span>
                <span className="text-sm text-gray-500">({category.count} transactions)</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(category.amount)}
                </div>
                <div className="text-sm text-gray-500">
                  {category.percentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="rounded-full h-2 transition-all duration-300"
                style={{
                  width: `${Math.max(category.percentage, 2)}%`,
                  backgroundColor: CATEGORY_COLORS[category.category]
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {categories.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Showing top {categories.length} categories
          </p>
        </div>
      )}
    </div>
  );
}
