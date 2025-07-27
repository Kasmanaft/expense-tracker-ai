import { Expense, ExportOptions, ExportSummary, ExpenseCategory } from '@/types';
import { format } from 'date-fns';

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

  // Advanced Export Methods
  static getFilteredExpenses(options: ExportOptions): Expense[] {
    let expenses = this.getExpenses();

    // Apply date range filter
    if (options.dateRange.startDate || options.dateRange.endDate) {
      expenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);

        if (options.dateRange.startDate && options.dateRange.endDate) {
          return expenseDate >= options.dateRange.startDate && expenseDate <= options.dateRange.endDate;
        } else if (options.dateRange.startDate) {
          return expenseDate >= options.dateRange.startDate;
        } else if (options.dateRange.endDate) {
          return expenseDate <= options.dateRange.endDate;
        }

        return true;
      });
    }

    // Apply category filter
    if (options.categories && options.categories.length > 0) {
      expenses = expenses.filter(expense => options.categories!.includes(expense.category));
    }

    return expenses;
  }

  static getExportSummary(options: ExportOptions): ExportSummary {
    const filteredExpenses = this.getFilteredExpenses(options);

    // Calculate total amount
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate category breakdown
    const categoryBreakdown = filteredExpenses.reduce((breakdown, expense) => {
      if (!breakdown[expense.category]) {
        breakdown[expense.category] = 0;
      }
      breakdown[expense.category] += expense.amount;
      return breakdown;
    }, {} as Record<ExpenseCategory, number>);

    return {
      recordCount: filteredExpenses.length,
      totalAmount,
      dateRange: options.dateRange,
      categoryBreakdown
    };
  }

  static exportToFormat(options: ExportOptions): string | Blob {
    const filteredExpenses = this.getFilteredExpenses(options);

    switch (options.format) {
      case 'csv':
        return this.generateCsv(filteredExpenses, options);
      case 'json':
        return this.generateJson(filteredExpenses, options);
      case 'pdf':
        return this.generatePdf(filteredExpenses, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  static generateCsv(expenses: Expense[], options: ExportOptions): string {
    const headers = ['Date', 'Amount', 'Category', 'Description'];

    // Add metadata headers if requested
    if (options.includeMetadata) {
      headers.push('ID', 'Created At', 'Updated At');
    }

    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => {
        const row = [
          format(expense.date, 'yyyy-MM-dd'),
          expense.amount.toString(),
          `"${expense.category}"`,
          `"${expense.description.replace(/"/g, '""')}"`
        ];

        if (options.includeMetadata) {
          row.push(
            expense.id,
            format(expense.createdAt, 'yyyy-MM-dd HH:mm:ss'),
            format(expense.updatedAt, 'yyyy-MM-dd HH:mm:ss')
          );
        }

        return row.join(',');
      })
    ].join('\n');

    return csvContent;
  }

  static generateJson(expenses: Expense[], options: ExportOptions): string {
    // If metadata is not included, remove those fields
    if (!options.includeMetadata) {
      expenses = expenses.map(({ id, createdAt, updatedAt, ...rest }) => rest) as Expense[];
    }

    return JSON.stringify(expenses, null, 2);
  }

  static generatePdf(expenses: Expense[], options: ExportOptions): Blob {
    // For PDF, we'll create a simple HTML table and convert it to PDF
    // In a real app, you'd use a library like jsPDF or pdfmake
    // For this demo, we'll return a Blob with HTML that could be converted to PDF

    const tableRows = expenses.map(expense => `
      <tr>
        <td>${format(expense.date, 'yyyy-MM-dd')}</td>
        <td>$${expense.amount.toFixed(2)}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        ${options.includeMetadata ? `
          <td>${expense.id}</td>
          <td>${format(expense.createdAt, 'yyyy-MM-dd HH:mm:ss')}</td>
          <td>${format(expense.updatedAt, 'yyyy-MM-dd HH:mm:ss')}</td>
        ` : ''}
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expense Export</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Expense Export</h1>
        <p>Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              ${options.includeMetadata ? `
                <th>ID</th>
                <th>Created At</th>
                <th>Updated At</th>
              ` : ''}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    return new Blob([html], { type: 'text/html' });
  }

  static downloadExport(options: ExportOptions): void {
    const data = this.exportToFormat(options);
    const link = document.createElement('a');

    if (link.download !== undefined) {
      let url;
      let mimeType;

      // Handle different formats
      switch (options.format) {
        case 'csv':
          mimeType = 'text/csv;charset=utf-8;';
          url = URL.createObjectURL(new Blob([data as string], { type: mimeType }));
          break;
        case 'json':
          mimeType = 'application/json;charset=utf-8;';
          url = URL.createObjectURL(new Blob([data as string], { type: mimeType }));
          break;
        case 'pdf':
          // In a real app, this would be a PDF blob
          // For this demo, we're using HTML that could be converted to PDF
          url = URL.createObjectURL(data as Blob);
          mimeType = 'text/html';
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      // Generate filename with extension
      const extension = options.format === 'pdf' ? 'html' : options.format;
      const filename = options.filename ?
        `${options.filename}.${extension}` :
        `expenses-${format(new Date(), 'yyyy-MM-dd')}.${extension}`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
