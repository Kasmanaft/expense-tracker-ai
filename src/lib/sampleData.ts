import { ExpenseStorage } from './storage';
import { ExpenseCategory } from '@/types';

const sampleExpenses = [
  {
    date: new Date(2024, 11, 15),
    amount: 45.99,
    category: 'Food' as ExpenseCategory,
    description: 'Grocery shopping at Whole Foods'
  },
  {
    date: new Date(2024, 11, 14),
    amount: 12.50,
    category: 'Transportation' as ExpenseCategory,
    description: 'Uber ride to downtown'
  },
  {
    date: new Date(2024, 11, 13),
    amount: 89.99,
    category: 'Entertainment' as ExpenseCategory,
    description: 'Concert tickets'
  },
  {
    date: new Date(2024, 11, 12),
    amount: 156.78,
    category: 'Shopping' as ExpenseCategory,
    description: 'Winter jacket from Amazon'
  },
  {
    date: new Date(2024, 11, 11),
    amount: 125.00,
    category: 'Bills' as ExpenseCategory,
    description: 'Electric bill payment'
  },
  {
    date: new Date(2024, 11, 10),
    amount: 24.99,
    category: 'Food' as ExpenseCategory,
    description: 'Pizza delivery'
  },
  {
    date: new Date(2024, 11, 9),
    amount: 8.75,
    category: 'Transportation' as ExpenseCategory,
    description: 'Subway fare'
  },
  {
    date: new Date(2024, 11, 8),
    amount: 67.50,
    category: 'Food' as ExpenseCategory,
    description: 'Dinner at restaurant'
  },
  {
    date: new Date(2024, 11, 7),
    amount: 299.99,
    category: 'Shopping' as ExpenseCategory,
    description: 'New smartphone case and accessories'
  },
  {
    date: new Date(2024, 11, 6),
    amount: 15.00,
    category: 'Entertainment' as ExpenseCategory,
    description: 'Movie ticket'
  },
  {
    date: new Date(2024, 10, 28),
    amount: 78.90,
    category: 'Food' as ExpenseCategory,
    description: 'Weekly groceries'
  },
  {
    date: new Date(2024, 10, 25),
    amount: 450.00,
    category: 'Bills' as ExpenseCategory,
    description: 'Monthly rent payment'
  },
  {
    date: new Date(2024, 10, 22),
    amount: 32.50,
    category: 'Transportation' as ExpenseCategory,
    description: 'Gas for car'
  },
  {
    date: new Date(2024, 10, 18),
    amount: 89.99,
    category: 'Other' as ExpenseCategory,
    description: 'Annual software subscription'
  },
  {
    date: new Date(2024, 10, 15),
    amount: 123.45,
    category: 'Shopping' as ExpenseCategory,
    description: 'Books and office supplies'
  }
];

export function addSampleData(): void {
  // Check if there's already data
  const existingExpenses = ExpenseStorage.getExpenses();
  if (existingExpenses.length > 0) {
    console.log('Sample data not added - expenses already exist');
    return;
  }

  // Add sample expenses
  sampleExpenses.forEach(expense => {
    ExpenseStorage.addExpense(expense);
  });

  console.log(`Added ${sampleExpenses.length} sample expenses`);
}

export function clearAllData(): void {
  ExpenseStorage.clearAllExpenses();
  console.log('All expense data cleared');
}
