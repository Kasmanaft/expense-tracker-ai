export interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface ExpenseFormData {
  date: Date;
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'All';
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  categorySummary: CategorySummary[];
  recentExpenses: Expense[];
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyData {
  month: string;
  amount: number;
}

// Advanced Export Types
export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  categories: ExpenseCategory[] | null; // null means all categories
  includeMetadata: boolean;
}

export interface ExportSummary {
  recordCount: number;
  totalAmount: number;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  categoryBreakdown: Record<ExpenseCategory, number>;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#EF4444',
  Transportation: '#3B82F6',
  Entertainment: '#8B5CF6',
  Shopping: '#EC4899',
  Bills: '#F59E0B',
  Other: '#6B7280'
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: '🍽️',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📝'
};
