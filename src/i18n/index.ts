import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
];

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      expenses: 'Expenses',
      budgets: 'Budgets',
      reports: 'Reports',
      notifications: 'Notifications',
      profile: 'Profile',
      
      // Common Actions
      addExpense: 'Add Expense',
      setBudget: 'Set Budget',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      
      // Dashboard
      monthlyBudget: 'Monthly Budget',
      recentTransactions: 'Recent Transactions',
      aiInsights: 'AI Insights',
      quickActions: 'Quick Actions',
      totalExpenses: 'Total Expenses',
      remaining: 'Remaining',
      spent: 'Spent',
      budget: 'Budget',
      welcome: 'Welcome',
      namaste: 'Namaste',
      
      // Forms
      amount: 'Amount',
      category: 'Category',
      description: 'Description',
      date: 'Date',
      paymentMethod: 'Payment Method',
      email: 'Email',
      password: 'Password',
      createAccount: 'Create Account',
      signIn: 'Sign In',
      
      // Budget Management
      budgetCreated: 'Budget Created',
      budgetUpdated: 'Budget Updated',
      budgetDeleted: 'Budget Deleted',
      budgetName: 'Budget Name',
      budgetAmount: 'Budget Amount',
      editBudget: 'Edit Budget',
      createBudget: 'Create Budget',
      confirmDelete: 'Are you sure you want to delete this budget?',
      
      // Expense Management
      expenseAddedSuccessfully: 'Expense Added Successfully',
      editFeature: 'Edit Feature',
      editFunctionalityWillBeImplemented: 'Edit functionality will be implemented soon',
      expenseDeleted: 'Expense Deleted',
      expenseHasBeenRemoved: 'The expense has been removed',
      trackAndManageTransactions: 'Track and manage your transactions',
      transactions: 'Transactions',
      avgAmount: 'Avg Amount',
      categories: 'Categories',
      
      // Filters
      filterExpenses: 'Filter Expenses',
      searchExpenses: 'Search expenses...',
      allCategories: 'All Categories',
      timePeriod: 'Time Period',
      allTime: 'All Time',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      
      // Categories
      'Food & Dining': 'Food & Dining',
      'Kirana': 'Groceries',
      'Travel': 'Travel',
      'Utilities': 'Utilities',
      'Healthcare': 'Healthcare',
      'Shopping': 'Shopping',
      'Entertainment': 'Entertainment',
      'Education': 'Education',
      'Festivals': 'Festivals'
    }
  },
  hi: {
    translation: {
      // Navigation
      dashboard: 'डैशबोर्ड',
      expenses: 'खर्च',
      budgets: 'बजट',
      reports: 'रिपोर्ट',
      notifications: 'सूचनाएं',
      profile: 'प्रोफाइल',
      
      // Common Actions
      addExpense: 'खर्च जोड़ें',
      setBudget: 'बजट सेट करें',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      create: 'बनाएं',
      update: 'अपडेट करें',
      
      // Dashboard
      monthlyBudget: 'मासिक बजट',
      recentTransactions: 'हाल के लेनदेन',
      aiInsights: 'एआई इनसाइट्स',
      quickActions: 'त्वरित कार्य',
      totalExpenses: 'कुल खर्च',
      remaining: 'शेष',
      spent: 'खर्च किया गया',
      budget: 'बजट',
      welcome: 'स्वागत है',
      namaste: 'नमस्ते',
      
      // Forms
      amount: 'राशि',
      category: 'श्रेणी',
      description: 'विवरण',
      date: 'तारीख',
      paymentMethod: 'भुगतान विधि',
      email: 'ईमेल',
      password: 'पासवर्ड',
      createAccount: 'खाता बनाएं',
      signIn: 'साइन इन करें',
      
      // Budget Management
      budgetCreated: 'बजट बनाया गया',
      budgetUpdated: 'बजट अपडेट किया गया',
      budgetDeleted: 'बजट हटाया गया',
      budgetName: 'बजट का नाम',
      budgetAmount: 'बजट राशि',
      editBudget: 'बजट संपादित करें',
      createBudget: 'बजट बनाएं',
      confirmDelete: 'क्या आप वाकई इस बजट को हटाना चाहते हैं?',
      
      // Expense Management
      expenseAddedSuccessfully: 'खर्च सफलतापूर्वक जोड़ा गया',
      editFeature: 'संपादन सुविधा',
      editFunctionalityWillBeImplemented: 'संपादन कार्यक्षमता जल्द ही लागू की जाएगी',
      expenseDeleted: 'खर्च हटाया गया',
      expenseHasBeenRemoved: 'खर्च हटा दिया गया है',
      trackAndManageTransactions: 'अपने लेनदेन को ट्रैक और प्रबंधित करें',
      transactions: 'लेनदेन',
      avgAmount: 'औसत राशि',
      categories: 'श्रेणियां',
      
      // Filters
      filterExpenses: 'खर्च फिल्टर करें',
      searchExpenses: 'खर्च खोजें...',
      allCategories: 'सभी श्रेणियां',
      timePeriod: 'समय अवधि',
      allTime: 'सभी समय',
      today: 'आज',
      thisWeek: 'इस सप्ताह',
      thisMonth: 'इस महीने',
      
      // Categories
      'Food & Dining': 'खाना और भोजन',
      'Kirana': 'किराना',
      'Travel': 'यात्रा',
      'Utilities': 'उपयोगिताएं',
      'Healthcare': 'स्वास्थ्य सेवा',
      'Shopping': 'खरीदारी',
      'Entertainment': 'मनोरंजन',
      'Education': 'शिक्षा',
      'Festivals': 'त्योहार'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'smartspend_language'
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;