# 💰 Expense Tracker AI

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Track your personal finances with an intuitive interface, powerful analytics, and comprehensive expense management features.

## ✨ Features

### Core Functionality
- **Add Expenses**: Easy-to-use form with date picker, amount validation, and category selection
- **View & Manage**: Comprehensive expense list with search, filtering, and sorting
- **Edit & Delete**: Full CRUD operations with confirmation dialogs
- **Categories**: Pre-defined categories (Food, Transportation, Entertainment, Shopping, Bills, Other)

### Dashboard & Analytics
- **Dashboard Overview**: Summary cards showing total expenses, monthly spending, and key metrics
- **Visual Charts**: Pie charts for category breakdown and line charts for monthly trends
- **Spending Insights**: Advanced analytics with month-over-month comparisons and smart tips
- **Recent Activity**: Quick view of your latest expenses

### Data Management
- **Local Storage**: All data persists locally in your browser
- **CSV Export**: Download your expenses in CSV format for external analysis
- **Sample Data**: Development helper to populate test data

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Smooth loading indicators and error handling
- **Accessibility**: Built with accessibility best practices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the source code
   cd expense-tracker-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Getting Started

1. **Add Your First Expense**
   - Click "Add Expense" in the navigation or use the button on the dashboard
   - Fill in the date, amount, category, and description
   - Click "Add Expense" to save

2. **View Your Expenses**
   - Go to the "Expenses" page to see all your transactions
   - Use the search bar to find specific expenses
   - Filter by category or date range using the filters

3. **Explore Analytics**
   - Visit the "Analytics" page for detailed insights
   - View spending by category with interactive pie charts
   - Track monthly trends with line charts
   - Get personalized spending tips and insights

### Key Features

#### Dashboard
- **Summary Cards**: Overview of total expenses, monthly spending, categories, and transactions
- **Recent Expenses**: Quick view of your latest 5 expenses
- **Category Breakdown**: Visual representation of spending by category

#### Adding Expenses
- **Date Picker**: Select any date up to today
- **Amount Validation**: Ensures positive numbers with proper formatting
- **Category Selection**: Choose from 6 predefined categories
- **Description**: Add details about your expense (required, up to 200 characters)

#### Managing Expenses
- **Search**: Find expenses by description
- **Filter**: Filter by category, date range, or combination
- **Edit**: Click the edit icon to modify any expense
- **Delete**: Remove expenses with confirmation
- **Export**: Download all (or filtered) expenses as CSV

#### Analytics
- **Spending Insights**: Month-over-month comparisons and key metrics
- **Category Charts**: Visual breakdown of spending by category
- **Monthly Trends**: Track spending patterns over time
- **Smart Tips**: Personalized recommendations based on your spending habits

### Development Features

When running in development mode, you'll see a "🔧 Dev" button in the bottom-right corner with options to:
- **Add Sample Data**: Populate the app with realistic test expenses
- **Clear All Data**: Remove all expenses for fresh testing

## 🛠️ Technical Details

### Built With
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling and validation
- **React DatePicker**: Date selection component
- **Recharts**: Chart library for data visualization
- **Headless UI**: Accessible UI components
- **Heroicons**: Beautiful SVG icons

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── add/               # Add expense page
│   ├── expenses/          # Expenses list page
│   ├── analytics/         # Analytics page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── analytics/         # Chart components
│   ├── dashboard/         # Dashboard components
│   ├── expenses/          # Expense management components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                   # Utility functions
│   ├── storage.ts         # LocalStorage utilities
│   ├── utils.ts           # Helper functions
│   └── sampleData.ts      # Test data
└── types/                 # TypeScript type definitions
```

### Data Storage
All expense data is stored locally in your browser's localStorage. This means:
- ✅ Your data stays private and secure
- ✅ No need for account creation or authentication
- ✅ Works offline
- ⚠️ Data is tied to your browser and device
- ⚠️ Clearing browser data will remove expenses

## 🎯 Features Overview

### ✅ Completed Features
- [x] Modern, responsive UI design
- [x] Add/Edit/Delete expenses
- [x] Category management with icons
- [x] Search and filter functionality
- [x] Dashboard with summary cards
- [x] Visual analytics with charts
- [x] CSV export functionality
- [x] Form validation and error handling
- [x] Local data persistence
- [x] Mobile-responsive design
- [x] Loading states and user feedback

### 🚀 Potential Enhancements
- [ ] Budget setting and tracking
- [ ] Recurring expense templates
- [ ] Data backup/restore functionality
- [ ] Multiple currency support
- [ ] Expense categories customization
- [ ] Receipt photo attachments
- [ ] Spending goals and alerts

## 🐛 Troubleshooting

### Common Issues

**Data not persisting:**
- Ensure JavaScript is enabled in your browser
- Check that localStorage is not disabled
- Try refreshing the page

**Charts not displaying:**
- Ensure you have expenses added
- Try adding sample data using the dev tools
- Check browser console for any errors

**Form validation errors:**
- Amount must be a positive number
- Description is required and must be under 200 characters
- Date cannot be in the future

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

This is a demo application, but feel free to fork and enhance it for your own use!

---

**Enjoy tracking your expenses! 💸**
