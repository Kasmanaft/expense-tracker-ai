import { type ClassValue, clsx } from 'clsx';
import { Expense, CategorySummary, ExpenseCategory, DashboardStats, MonthlyData } from '@/types';
import { startOfMonth, endOfMonth, format, isWithinInterval } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

export function calculateTotalAmount(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function getMonthlyExpenses(expenses: Expense[], date: Date = new Date()): Expense[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return expenses.filter(expense =>
    isWithinInterval(expense.date, { start, end })
  );
}

export function getCategorySummary(expenses: Expense[]): CategorySummary[] {
  const total = calculateTotalAmount(expenses);
  const categoryTotals = new Map<ExpenseCategory, { amount: number; count: number }>();

  expenses.forEach(expense => {
    const current = categoryTotals.get(expense.category) || { amount: 0, count: 0 };
    categoryTotals.set(expense.category, {
      amount: current.amount + expense.amount,
      count: current.count + 1
    });
  });

  return Array.from(categoryTotals.entries()).map(([category, { amount, count }]) => ({
    category,
    amount,
    count,
    percentage: total > 0 ? (amount / total) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);
}

export function getMonthlyData(expenses: Expense[], months: number = 6): MonthlyData[] {
  const now = new Date();
  const monthlyData: MonthlyData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthExpenses = getMonthlyExpenses(expenses, date);
    const amount = calculateTotalAmount(monthExpenses);

    monthlyData.push({
      month: format(date, 'MMM yyyy'),
      amount
    });
  }

  return monthlyData;
}

export function getDashboardStats(expenses: Expense[]): DashboardStats {
  const totalExpenses = calculateTotalAmount(expenses);
  const monthlyExpenses = calculateTotalAmount(getMonthlyExpenses(expenses));
  const categorySummary = getCategorySummary(expenses);
  const recentExpenses = expenses
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return {
    totalExpenses,
    monthlyExpenses,
    categorySummary,
    recentExpenses
  };
}

export function filterExpenses(
  expenses: Expense[],
  filters: {
    category?: ExpenseCategory | 'All';
    dateFrom?: Date;
    dateTo?: Date;
    searchTerm?: string;
  }
): Expense[] {
  return expenses.filter(expense => {
    if (filters.category && filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    if (filters.dateFrom && expense.date < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && expense.date > filters.dateTo) {
      return false;
    }

    if (filters.searchTerm &&
        !expense.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });
}

export function validateExpenseAmount(amount: string): string | null {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return 'Please enter a valid number';
  }

  if (numAmount <= 0) {
    return 'Amount must be greater than 0';
  }

  if (numAmount > 999999) {
    return 'Amount must be less than $1,000,000';
  }

  return null;
}

export function validateExpenseDescription(description: string): string | null {
  if (!description.trim()) {
    return 'Description is required';
  }

  if (description.length > 200) {
    return 'Description must be less than 200 characters';
  }

  return null;
}
