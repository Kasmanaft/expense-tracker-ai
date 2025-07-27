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

// Cloud Export Types
export type CloudProvider = 'google-sheets' | 'dropbox' | 'onedrive' | 'airtable' | 'notion';
export type ExportTemplate = 'tax-report' | 'monthly-summary' | 'category-analysis' | 'expense-detail' | 'budget-tracker';
export type ExportMethod = 'email' | 'cloud-sync' | 'share-link' | 'qr-code' | 'webhook';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface CloudExportOptions {
  template: ExportTemplate;
  method: ExportMethod;
  provider?: CloudProvider;
  emailAddress?: string;
  shareSettings?: ShareSettings;
  schedule?: ScheduleSettings;
  filters?: ExpenseFilters;
}

export interface ShareSettings {
  isPublic: boolean;
  password?: string;
  expiresAt?: Date;
  allowDownload: boolean;
  allowComments: boolean;
  viewerEmails?: string[];
}

export interface ScheduleSettings {
  frequency: ScheduleFrequency;
  startDate: Date;
  endDate?: Date;
  timezone: string;
  isActive: boolean;
}

export interface ExportHistoryItem {
  id: string;
  template: ExportTemplate;
  method: ExportMethod;
  provider?: CloudProvider;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordCount: number;
  totalAmount: number;
  shareLink?: string;
  downloadUrl?: string;
  recipientEmail?: string;
  errorMessage?: string;
}

export interface CloudIntegration {
  provider: CloudProvider;
  name: string;
  icon: string;
  isConnected: boolean;
  lastSyncAt?: Date;
  permissions: string[];
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
}

export interface ExportTemplateConfig {
  id: ExportTemplate;
  name: string;
  description: string;
  icon: string;
  recommendedFor: string[];
  includesMetadata: boolean;
  defaultFormat: 'csv' | 'xlsx' | 'pdf' | 'json';
  customFields?: string[];
}

export interface ShareableLink {
  id: string;
  url: string;
  qrCode: string;
  isActive: boolean;
  viewCount: number;
  lastViewedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
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

export const EXPORT_TEMPLATES: ExportTemplateConfig[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'Optimized for tax preparation with deductible expense categorization',
    icon: '📊',
    recommendedFor: ['Tax season', 'Accountants', 'Business expenses'],
    includesMetadata: true,
    defaultFormat: 'xlsx',
    customFields: ['Tax Category', 'Deductible Amount', 'Receipt Status']
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'High-level overview of monthly spending patterns',
    icon: '📅',
    recommendedFor: ['Personal budgeting', 'Monthly reviews', 'Quick insights'],
    includesMetadata: false,
    defaultFormat: 'pdf',
    customFields: ['Budget vs Actual', 'Trend Analysis']
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Deep dive into spending by category with trends and insights',
    icon: '🎯',
    recommendedFor: ['Budget optimization', 'Spending analysis', 'Financial planning'],
    includesMetadata: false,
    defaultFormat: 'xlsx',
    customFields: ['Category Budget', 'Variance', 'Trend Direction']
  },
  {
    id: 'expense-detail',
    name: 'Expense Detail',
    description: 'Complete transaction log with all available data',
    icon: '📋',
    recommendedFor: ['Audit trails', 'Detailed analysis', 'Record keeping'],
    includesMetadata: true,
    defaultFormat: 'csv',
    customFields: ['Receipt URL', 'Approval Status', 'Payment Method']
  },
  {
    id: 'budget-tracker',
    name: 'Budget Tracker',
    description: 'Budget vs actual spending with variance analysis',
    icon: '🎯',
    recommendedFor: ['Budget monitoring', 'Financial goals', 'Variance tracking'],
    includesMetadata: false,
    defaultFormat: 'xlsx',
    customFields: ['Budget Amount', 'Remaining Budget', 'Days Left in Period']
  }
];

export const CLOUD_PROVIDERS: CloudIntegration[] = [
  {
    provider: 'google-sheets',
    name: 'Google Sheets',
    icon: '📊',
    isConnected: false,
    permissions: ['read', 'write', 'create_spreadsheets'],
    status: 'disconnected'
  },
  {
    provider: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    isConnected: false,
    permissions: ['files.content.write', 'files.content.read'],
    status: 'disconnected'
  },
  {
    provider: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    isConnected: false,
    permissions: ['Files.ReadWrite', 'Sites.ReadWrite.All'],
    status: 'disconnected'
  },
  {
    provider: 'airtable',
    name: 'Airtable',
    icon: '🗂️',
    isConnected: false,
    permissions: ['data:read', 'data:write', 'schema:read'],
    status: 'disconnected'
  },
  {
    provider: 'notion',
    name: 'Notion',
    icon: '📝',
    isConnected: false,
    permissions: ['read_content', 'update_content', 'insert_content'],
    status: 'disconnected'
  }
];
