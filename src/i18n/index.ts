
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      expenses: "Expenses",
      budgets: "Budgets",
      reports: "Reports",
      notifications: "Notifications",
      profile: "Profile",
      
      // Common
      namaste: "Namaste",
      monthlyBudget: "Monthly Budget",
      remaining: "remaining",
      spent: "Spent",
      budget: "Budget",
      addExpense: "Add Expense",
      setBudget: "Set Budget",
      recentTransactions: "Recent Transactions",
      aiInsights: "AI Insights",
      
      // Auth
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      signInWithGoogle: "Sign in with Google",
      createAccount: "Create Account",
      
      // Budget
      createBudget: "Create Budget",
      editBudget: "Edit Budget",
      deleteBudget: "Delete Budget",
      budgetName: "Budget Name",
      budgetAmount: "Budget Amount",
      category: "Category",
      
      // Categories
      "Food & Dining": "Food & Dining",
      "Kirana": "Groceries",
      "Travel": "Travel",
      "Utilities": "Utilities",
      "Healthcare": "Healthcare",
      "Shopping": "Shopping",
      "Entertainment": "Entertainment",
      "Education": "Education",
      
      // Messages
      budgetCreated: "Budget created successfully!",
      budgetUpdated: "Budget updated successfully!",
      budgetDeleted: "Budget deleted successfully!",
      confirmDelete: "Are you sure you want to delete this budget?",
      
      // Landing page
      heroTitle: "Master Your Money with Smart Spending",
      heroSubtitle: "Take control of your finances with AI-powered insights, smart budgeting tools, and personalized recommendations designed specifically for Indian users.",
      getStarted: "Get Started Free",
      watchDemo: "Watch Demo",
      whyChoose: "Why Choose Smart Spend?",
      testimonials: "What Our Users Say",
      aboutUs: "About Smart Spend",
      ourMission: "Our Mission"
    }
  },
  hi: {
    translation: {
      // Navigation
      dashboard: "डैशबोर्ड",
      expenses: "खर्च",
      budgets: "बजट",
      reports: "रिपोर्ट",
      notifications: "सूचनाएं",
      profile: "प्रोफ़ाइल",
      
      // Common
      namaste: "नमस्ते",
      monthlyBudget: "मासिक बजट",
      remaining: "बचा हुआ",
      spent: "खर्च किया गया",
      budget: "बजट",
      addExpense: "खर्च जोड़ें",
      setBudget: "बजट सेट करें",
      recentTransactions: "हाल के लेनदेन",
      aiInsights: "AI अंतर्दृष्टि",
      
      // Auth
      signIn: "साइन इन",
      signUp: "साइन अप",
      signOut: "साइन आउट",
      email: "ईमेल",
      password: "पासवर्ड",
      signInWithGoogle: "Google से साइन इन करें",
      createAccount: "खाता बनाएं",
      
      // Budget
      createBudget: "बजट बनाएं",
      editBudget: "बजट संपादित करें",
      deleteBudget: "बजट हटाएं",
      budgetName: "बजट का नाम",
      budgetAmount: "बजट राशि",
      category: "श्रेणी",
      
      // Categories
      "Food & Dining": "खाना और भोजन",
      "Kirana": "किराना",
      "Travel": "यात्रा",
      "Utilities": "उपयोगिताएं",
      "Healthcare": "स्वास्थ्य सेवा",
      "Shopping": "खरीदारी",
      "Entertainment": "मनोरंजन",
      "Education": "शिक्षा",
      
      // Messages
      budgetCreated: "बजट सफलतापूर्वक बनाया गया!",
      budgetUpdated: "बजट सफलतापूर्वक अपडेट किया गया!",
      budgetDeleted: "बजट सफलतापूर्वक हटाया गया!",
      confirmDelete: "क्या आप वाकई इस बजट को हटाना चाहते हैं?",
      
      // Landing page
      heroTitle: "स्मार्ट खर्च के साथ अपने पैसे को नियंत्रित करें",
      heroSubtitle: "AI-संचालित अंतर्दृष्टि, स्मार्ट बजटिंग टूल्स, और भारतीय उपयोगकर्ताओं के लिए विशेष रूप से डिज़ाइन की गई व्यक्तिगत सिफारिशों के साथ अपने वित्त पर नियंत्रण रखें।",
      getStarted: "मुफ्त शुरुआत करें",
      watchDemo: "डेमो देखें",
      whyChoose: "स्मार्ट स्पेंड क्यों चुनें?",
      testimonials: "हमारे उपयोगकर्ता क्या कहते हैं",
      aboutUs: "स्मार्ट स्पेंड के बारे में",
      ourMission: "हमारा मिशन"
    }
  },
  es: {
    translation: {
      // Navigation
      dashboard: "Panel",
      expenses: "Gastos",
      budgets: "Presupuestos",
      reports: "Informes",
      notifications: "Notificaciones",
      profile: "Perfil",
      
      // Common
      namaste: "Hola",
      monthlyBudget: "Presupuesto Mensual",
      remaining: "restante",
      spent: "Gastado",
      budget: "Presupuesto",
      addExpense: "Agregar Gasto",
      setBudget: "Establecer Presupuesto",
      recentTransactions: "Transacciones Recientes",
      aiInsights: "Perspectivas de IA",
      
      // Auth
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      signOut: "Cerrar Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      signInWithGoogle: "Iniciar sesión con Google",
      createAccount: "Crear Cuenta",
      
      // Budget
      createBudget: "Crear Presupuesto",
      editBudget: "Editar Presupuesto",
      deleteBudget: "Eliminar Presupuesto",
      budgetName: "Nombre del Presupuesto",
      budgetAmount: "Cantidad del Presupuesto",
      category: "Categoría",
      
      // Categories
      "Food & Dining": "Comida y Restaurantes",
      "Kirana": "Comestibles",
      "Travel": "Viajes",
      "Utilities": "Servicios Públicos",
      "Healthcare": "Atención Médica",
      "Shopping": "Compras",
      "Entertainment": "Entretenimiento",
      "Education": "Educación",
      
      // Messages
      budgetCreated: "¡Presupuesto creado exitosamente!",
      budgetUpdated: "¡Presupuesto actualizado exitosamente!",
      budgetDeleted: "¡Presupuesto eliminado exitosamente!",
      confirmDelete: "¿Estás seguro de que quieres eliminar este presupuesto?",
      
      // Landing page
      heroTitle: "Domina tu Dinero con Gasto Inteligente",
      heroSubtitle: "Toma control de tus finanzas con perspectivas impulsadas por IA, herramientas de presupuesto inteligente y recomendaciones personalizadas diseñadas específicamente para usuarios indios.",
      getStarted: "Comenzar Gratis",
      watchDemo: "Ver Demo",
      whyChoose: "¿Por qué elegir Smart Spend?",
      testimonials: "Lo que dicen nuestros usuarios",
      aboutUs: "Acerca de Smart Spend",
      ourMission: "Nuestra Misión"
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
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
