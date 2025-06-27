import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
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
      
      // Common actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      update: 'Update',
      create: 'Create',
      
      // Authentication
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      
      // Expense categories
      'Food & Dining': 'Food & Dining',
      'Kirana': 'Groceries',
      'Travel': 'Travel',
      'Utilities': 'Utilities',
      'Healthcare': 'Healthcare',
      'Shopping': 'Shopping',
      'Entertainment': 'Entertainment',
      'Education': 'Education',
      
      // Budget related
      budget: 'Budget',
      spent: 'Spent',
      remaining: 'Remaining',
      createBudget: 'Create Budget',
      budgetName: 'Budget Name',
      budgetAmount: 'Budget Amount',
      monthlyBudget: 'Monthly Budget',
      budgetCreated: 'Budget Created',
      budgetUpdated: 'Budget Updated',
      budgetDeleted: 'Budget Deleted',
      editBudget: 'Edit Budget',
      
      // Expense related
      addExpense: 'Add Expense',
      expenseAddedSuccessfully: 'Expense Added Successfully',
      expenseDeleted: 'Expense Deleted',
      expenseHasBeenRemoved: 'Expense has been removed',
      totalExpenses: 'Total Expenses',
      transactions: 'Transactions',
      avgAmount: 'Avg Amount',
      categories: 'Categories',
      filterExpenses: 'Filter Expenses',
      searchExpenses: 'Search expenses...',
      allCategories: 'All Categories',
      timePeriod: 'Time Period',
      allTime: 'All Time',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      recentTransactions: 'Recent Transactions',
      trackAndManageTransactions: 'Track and manage your transactions',
      
      // Dashboard
      'dashboard.loading': 'Loading your dashboard...',
      'dashboard.accessDenied.title': 'Access Denied',
      'dashboard.accessDenied.description': 'Please sign in to access your dashboard',
      'dashboard.accessDenied.signInButton': 'Sign In',
      
      // Insights
      'insights.highSpendingCategory.title': 'High Spending Category',
      'insights.highSpendingCategory.description': 'Your highest spending category this month',
      'insights.savingOpportunity.title': 'Saving Opportunity',
      'insights.savingOpportunity.description': 'Potential savings identified',
      'insights.upcomingBill.title': 'Upcoming Bill',
      'insights.upcomingBill.description': 'Bill due soon',
      'insights.goalProgress.title': 'Goal Progress',
      'insights.goalProgress.description': 'Savings goal progress',
      'insights.creditCardDue.title': 'Credit Card Due',
      'insights.creditCardDue.description': 'Payment due soon',
      'insights.unusualSpending.title': 'Unusual Spending',
      'insights.unusualSpending.description': 'Spending pattern detected',
      
      // Common
      confirmDelete: 'Are you sure you want to delete this item?',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information'
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
      
      // Common actions
      save: 'सेव करें',
      cancel: 'रद्द करें',
      delete: 'डिलीट करें',
      edit: 'एडिट करें',
      add: 'जोड़ें',
      update: 'अपडेट करें',
      create: 'बनाएं',
      
      // Authentication
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      signOut: 'साइन आउट',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड कन्फर्म करें',
      forgotPassword: 'पासवर्ड भूल गए?',
      
      // Expense categories
      'Food & Dining': 'खाना और भोजन',
      'Kirana': 'किराना',
      'Travel': 'यात्रा',
      'Utilities': 'उपयोगिताएं',
      'Healthcare': 'स्वास्थ्य सेवा',
      'Shopping': 'शॉपिंग',
      'Entertainment': 'मनोरंजन',
      'Education': 'शिक्षा',
      
      // Budget related
      budget: 'बजट',
      spent: 'खर्च किया',
      remaining: 'बचा हुआ',
      createBudget: 'बजट बनाएं',
      budgetName: 'बजट का नाम',
      budgetAmount: 'बजट राशि',
      monthlyBudget: 'मासिक बजट',
      budgetCreated: 'बजट बनाया गया',
      budgetUpdated: 'बजट अपडेट किया गया',
      budgetDeleted: 'बजट डिलीट किया गया',
      editBudget: 'बजट एडिट करें',
      
      // Expense related
      addExpense: 'खर्च जोड़ें',
      expenseAddedSuccessfully: 'खर्च सफलतापूर्वक जोड़ा गया',
      expenseDeleted: 'खर्च डिलीट किया गया',
      expenseHasBeenRemoved: 'खर्च हटा दिया गया है',
      totalExpenses: 'कुल खर्च',
      transactions: 'लेन-देन',
      avgAmount: 'औसत राशि',
      categories: 'श्रेणियां',
      filterExpenses: 'खर्च फिल्टर करें',
      searchExpenses: 'खर्च खोजें...',
      allCategories: 'सभी श्रेणियां',
      timePeriod: 'समय अवधि',
      allTime: 'सभी समय',
      today: 'आज',
      thisWeek: 'इस सप्ताह',
      thisMonth: 'इस महीने',
      recentTransactions: 'हाल के लेन-देन',
      trackAndManageTransactions: 'अपने लेन-देन को ट्रैक और प्रबंधित करें',
      
      // Dashboard
      'dashboard.loading': 'आपका डैशबोर्ड लोड हो रहा है...',
      'dashboard.accessDenied.title': 'पहुंच अस्वीकृत',
      'dashboard.accessDenied.description': 'कृपया अपने डैशबोर्ड तक पहुंचने के लिए साइन इन करें',
      'dashboard.accessDenied.signInButton': 'साइन इन करें',
      
      // Insights
      'insights.highSpendingCategory.title': 'उच्च खर्च श्रेणी',
      'insights.highSpendingCategory.description': 'इस महीने आपकी सबसे ज्यादा खर्च श्रेणी',
      'insights.savingOpportunity.title': 'बचत का अवसर',
      'insights.savingOpportunity.description': 'संभावित बचत की पहचान की गई',
      'insights.upcomingBill.title': 'आगामी बिल',
      'insights.upcomingBill.description': 'बिल जल्द देय है',
      'insights.goalProgress.title': 'लक्ष्य प्रगति',
      'insights.goalProgress.description': 'बचत लक्ष्य प्रगति',
      'insights.creditCardDue.title': 'क्रेडिट कार्ड देय',
      'insights.creditCardDue.description': 'भुगतान जल्द देय है',
      'insights.unusualSpending.title': 'असामान्य खर्च',
      'insights.unusualSpending.description': 'खर्च पैटर्न का पता चला',
      
      // Common
      confirmDelete: 'क्या आप वाकई इस आइटम को डिलीट करना चाहते हैं?',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      info: 'जानकारी'
    }
  }
};

// Language configuration
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
];

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'smartspend_language',
    },
    
    react: {
      useSuspense: false, // Disable suspense to avoid loading issues
    }
  });

export default i18n;