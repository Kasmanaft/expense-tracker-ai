import { Expense } from '@/types';

const STORAGE_KEY = 'expense-tracker-data';

export class ExpenseStorage {
  static getExpenses(): Expense[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const expenses = JSON.parse(data);
      return expenses.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
        createdAt: new Date(expense.createdAt),
        updatedAt: new Date(expense.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  }

  static saveExpenses(expenses: Expense[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }

  static addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const expenses = this.getExpenses();
    expenses.push(newExpense);
    this.saveExpenses(expenses);

    return newExpense;
  }

  static updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): boolean {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(expense => expense.id === id);

    if (index === -1) return false;

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveExpenses(expenses);
    return true;
  }

  static deleteExpense(id: string): boolean {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);

    if (filteredExpenses.length === expenses.length) return false;

    this.saveExpenses(filteredExpenses);
    return true;
  }

  static clearAllExpenses(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  static exportToCsv(): string {
    const expenses = this.getExpenses();
    const headers = ['Date', 'Amount', 'Category', 'Description'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        expense.date.toISOString().split('T')[0],
        expense.amount.toString(),
        `"${expense.category}"`,
        `"${expense.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  static downloadCsv(): void {
    const csvContent = this.exportToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `expenses-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
