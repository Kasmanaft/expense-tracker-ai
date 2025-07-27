import {
  CloudExportOptions,
  ExportHistoryItem,
  CloudIntegration,
  ShareableLink,
  ExportTemplate,
  CloudProvider,
  EXPORT_TEMPLATES,
  CLOUD_PROVIDERS
} from '@/types';
import { ExpenseStorage } from './storage';
import { format } from 'date-fns';

class CloudExportService {
  private static instance: CloudExportService;
  private exportHistory: ExportHistoryItem[] = [];
  private cloudIntegrations: CloudIntegration[] = [...CLOUD_PROVIDERS];
  private shareableLinks: ShareableLink[] = [];

  static getInstance(): CloudExportService {
    if (!CloudExportService.instance) {
      CloudExportService.instance = new CloudExportService();
    }
    return CloudExportService.instance;
  }

  // Generate QR Code (simulated)
  private generateQRCode(url: string): string {
    // In a real app, you'd use a QR code generation library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  }

  // Generate shareable link
  generateShareableLink(exportId: string, options: CloudExportOptions): ShareableLink {
    const linkId = crypto.randomUUID();
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://expense-tracker.com';
    const url = `${baseUrl}/shared/${linkId}`;

    const shareableLink: ShareableLink = {
      id: linkId,
      url,
      qrCode: this.generateQRCode(url),
      isActive: true,
      viewCount: 0,
      createdAt: new Date(),
      expiresAt: options.shareSettings?.expiresAt
    };

    this.shareableLinks.push(shareableLink);
    return shareableLink;
  }

  // Simulate email export
  async simulateEmailExport(options: CloudExportOptions): Promise<ExportHistoryItem> {
    const exportId = crypto.randomUUID();
    const expenses = ExpenseStorage.getExpenses();

    const historyItem: ExportHistoryItem = {
      id: exportId,
      template: options.template,
      method: 'email',
      createdAt: new Date(),
      status: 'pending',
      recordCount: expenses.length,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      recipientEmail: options.emailAddress
    };

    this.exportHistory.unshift(historyItem);

    // Simulate processing
    setTimeout(() => {
      historyItem.status = 'processing';
      this.notifyStatusChange(exportId, 'processing');
    }, 1000);

    setTimeout(() => {
      historyItem.status = 'completed';
      this.notifyStatusChange(exportId, 'completed');
    }, 3000);

    return historyItem;
  }

  // Simulate cloud provider sync
  async simulateCloudSync(options: CloudExportOptions): Promise<ExportHistoryItem> {
    const exportId = crypto.randomUUID();
    const expenses = ExpenseStorage.getExpenses();

    const historyItem: ExportHistoryItem = {
      id: exportId,
      template: options.template,
      method: 'cloud-sync',
      provider: options.provider,
      createdAt: new Date(),
      status: 'pending',
      recordCount: expenses.length,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0)
    };

    this.exportHistory.unshift(historyItem);

    // Simulate cloud sync process
    setTimeout(() => {
      historyItem.status = 'processing';
      const integration = this.cloudIntegrations.find(i => i.provider === options.provider);
      if (integration) {
        integration.status = 'syncing';
      }
      this.notifyStatusChange(exportId, 'processing');
    }, 500);

    setTimeout(() => {
      historyItem.status = 'completed';
      const integration = this.cloudIntegrations.find(i => i.provider === options.provider);
      if (integration) {
        integration.status = 'connected';
        integration.lastSyncAt = new Date();
      }
      this.notifyStatusChange(exportId, 'completed');
    }, 2500);

    return historyItem;
  }

  // Create shareable link export
  async createShareableExport(options: CloudExportOptions): Promise<{ historyItem: ExportHistoryItem; shareableLink: ShareableLink }> {
    const exportId = crypto.randomUUID();
    const expenses = ExpenseStorage.getExpenses();

    const shareableLink = this.generateShareableLink(exportId, options);

    const historyItem: ExportHistoryItem = {
      id: exportId,
      template: options.template,
      method: 'share-link',
      createdAt: new Date(),
      status: 'completed',
      recordCount: expenses.length,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      shareLink: shareableLink.url
    };

    this.exportHistory.unshift(historyItem);
    return { historyItem, shareableLink };
  }

  // Get export template by ID
  getTemplate(templateId: ExportTemplate) {
    return EXPORT_TEMPLATES.find(t => t.id === templateId);
  }

  // Get all export templates
  getTemplates() {
    return EXPORT_TEMPLATES;
  }

  // Get export history
  getExportHistory(): ExportHistoryItem[] {
    return this.exportHistory;
  }

  // Get cloud integrations
  getCloudIntegrations(): CloudIntegration[] {
    return this.cloudIntegrations;
  }

  // Connect to cloud provider (simulated)
  async connectCloudProvider(provider: CloudProvider): Promise<boolean> {
    const integration = this.cloudIntegrations.find(i => i.provider === provider);
    if (!integration) return false;

    // Simulate OAuth flow
    integration.status = 'syncing';

    return new Promise((resolve) => {
      setTimeout(() => {
        integration.isConnected = true;
        integration.status = 'connected';
        integration.lastSyncAt = new Date();
        resolve(true);
      }, 2000);
    });
  }

  // Disconnect cloud provider
  disconnectCloudProvider(provider: CloudProvider): boolean {
    const integration = this.cloudIntegrations.find(i => i.provider === provider);
    if (!integration) return false;

    integration.isConnected = false;
    integration.status = 'disconnected';
    integration.lastSyncAt = undefined;
    return true;
  }

  // Schedule export (simulated)
  scheduleExport(options: CloudExportOptions): string {
    const scheduleId = crypto.randomUUID();
    // In a real app, this would set up cron jobs or cloud functions
    console.log(`Scheduled export created with ID: ${scheduleId}`, options);
    return scheduleId;
  }

  // Generate template-specific export data
  generateTemplateExport(template: ExportTemplate): any {
    const expenses = ExpenseStorage.getExpenses();
    const templateConfig = this.getTemplate(template);

    switch (template) {
      case 'tax-report':
        return this.generateTaxReport(expenses);
      case 'monthly-summary':
        return this.generateMonthlySummary(expenses);
      case 'category-analysis':
        return this.generateCategoryAnalysis(expenses);
      case 'expense-detail':
        return this.generateExpenseDetail(expenses);
      case 'budget-tracker':
        return this.generateBudgetTracker(expenses);
      default:
        return expenses;
    }
  }

  private generateTaxReport(expenses: any[]) {
    return expenses.map(expense => ({
      ...expense,
      taxCategory: this.getTaxCategory(expense.category),
      deductibleAmount: expense.amount * 0.8, // Simulated
      receiptStatus: Math.random() > 0.3 ? 'Available' : 'Missing'
    }));
  }

  private generateMonthlySummary(expenses: any[]) {
    const monthlyData = expenses.reduce((acc, expense) => {
      const month = format(expense.date, 'yyyy-MM');
      if (!acc[month]) {
        acc[month] = { total: 0, count: 0, categories: {} };
      }
      acc[month].total += expense.amount;
      acc[month].count += 1;
      acc[month].categories[expense.category] = (acc[month].categories[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      totalSpent: data.total,
      transactionCount: data.count,
      topCategory: Object.keys(data.categories).reduce((a, b) =>
        data.categories[a] > data.categories[b] ? a : b
      ),
      budgetVariance: (Math.random() - 0.5) * 500 // Simulated
    }));
  }

  private generateCategoryAnalysis(expenses: any[]) {
    const categoryData = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, count: 0, transactions: [] };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      acc[expense.category].transactions.push(expense);
      return acc;
    }, {});

    return Object.entries(categoryData).map(([category, data]: [string, any]) => ({
      category,
      totalSpent: data.total,
      averageTransaction: data.total / data.count,
      transactionCount: data.count,
      budgetAmount: data.total * 1.2, // Simulated budget
      variance: data.total * 0.2, // Simulated variance
      trendDirection: Math.random() > 0.5 ? 'up' : 'down'
    }));
  }

  private generateExpenseDetail(expenses: any[]) {
    return expenses.map(expense => ({
      ...expense,
      receiptUrl: `https://receipts.example.com/${expense.id}`,
      approvalStatus: Math.random() > 0.2 ? 'Approved' : 'Pending',
      paymentMethod: ['Credit Card', 'Cash', 'Bank Transfer'][Math.floor(Math.random() * 3)]
    }));
  }

  private generateBudgetTracker(expenses: any[]) {
    const categoryBudgets = {
      Food: 500,
      Transportation: 200,
      Entertainment: 150,
      Shopping: 300,
      Bills: 800,
      Other: 100
    };

    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(categoryBudgets).map(([category, budget]) => {
      const spent = categorySpending[category] || 0;
      const remaining = budget - spent;
      return {
        category,
        budgetAmount: budget,
        spentAmount: spent,
        remainingBudget: remaining,
        percentageUsed: (spent / budget) * 100,
        daysLeftInPeriod: 30 - new Date().getDate(),
        isOverBudget: spent > budget
      };
    });
  }

  private getTaxCategory(category: string): string {
    const taxCategories = {
      Food: 'Meals & Entertainment',
      Transportation: 'Travel & Transportation',
      Entertainment: 'Meals & Entertainment',
      Shopping: 'Office Supplies',
      Bills: 'Utilities',
      Other: 'Miscellaneous'
    };
    return taxCategories[category] || 'Miscellaneous';
  }

  // Status change notification (for real-time updates)
  private notifyStatusChange(exportId: string, status: string) {
    // In a real app, this would use WebSockets or Server-Sent Events
    console.log(`Export ${exportId} status changed to: ${status}`);

    // Trigger custom event for components to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('exportStatusChange', {
        detail: { exportId, status }
      }));
    }
  }

  // Get sharing analytics (simulated)
  getShareAnalytics(linkId: string) {
    const link = this.shareableLinks.find(l => l.id === linkId);
    if (!link) return null;

    return {
      totalViews: link.viewCount,
      uniqueViewers: Math.floor(link.viewCount * 0.7),
      lastViewedAt: link.lastViewedAt,
      geographicDistribution: [
        { country: 'United States', views: Math.floor(link.viewCount * 0.6) },
        { country: 'Canada', views: Math.floor(link.viewCount * 0.2) },
        { country: 'United Kingdom', views: Math.floor(link.viewCount * 0.2) }
      ],
      deviceTypes: [
        { type: 'Desktop', percentage: 65 },
        { type: 'Mobile', percentage: 30 },
        { type: 'Tablet', percentage: 5 }
      ]
    };
  }
}

export default CloudExportService;
