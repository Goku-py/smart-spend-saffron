import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Layout from "@/components/Layout";
import ExpenseModal from "@/components/ExpenseModal";
import { sampleExpenses, categories } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  merchant: string;
  method: string;
  date: string;
}

const Expenses = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  const handleAddExpense = (expenseData: any) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...expenseData,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExpense, ...prev]);
    toast({
      title: t('expenseAddedSuccessfully'),
      description: `${formatCurrency(expenseData.amount)} for ${expenseData.description}`,
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setModalMode('edit');
    setShowExpenseModal(true);
  };

  const handleUpdateExpense = (id: string, updatedData: any) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id 
        ? { ...expense, ...updatedData }
        : expense
    ));
    toast({
      title: "Expense Updated! ✅",
      description: `${formatCurrency(updatedData.amount)} expense updated successfully`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      setExpenses(prev => prev.filter(expense => expense.id !== expenseToDelete));
      toast({
        title: t('expenseDeleted'),
        description: t('expenseHasBeenRemoved'),
        variant: "destructive",
      });
      setShowDeleteDialog(false);
      setExpenseToDelete(null);
    }
  };

  const openAddModal = () => {
    setSelectedExpense(null);
    setModalMode('add');
    setShowExpenseModal(true);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTimeFilter = true;
    const expenseDate = new Date(expense.date);
    const today = new Date();
    
    if (filter === 'today') {
      matchesTimeFilter = expenseDate.toDateString() === today.toDateString();
    } else if (filter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesTimeFilter = expenseDate >= weekAgo;
    } else if (filter === 'month') {
      matchesTimeFilter = expenseDate.getMonth() === today.getMonth() && 
                         expenseDate.getFullYear() === today.getFullYear();
    }
    
    return matchesCategory && matchesSearch && matchesTimeFilter;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('expenses')}</h1>
            <p className="text-gray-600">{t('trackAndManageTransactions')}</p>
          </div>
          <Button 
            onClick={openAddModal}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white"
          >
            {t('addExpense')}
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalExpenses)}</div>
                <div className="text-sm text-gray-600">{t('totalExpenses')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{filteredExpenses.length}</div>
                <div className="text-sm text-gray-600">{t('transactions')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(filteredExpenses.length > 0 ? Math.round(totalExpenses / filteredExpenses.length) : 0)}
                </div>
                <div className="text-sm text-gray-600">{t('avgAmount')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">7</div>
                <div className="text-sm text-gray-600">{t('categories')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{t('filterExpenses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder={t('searchExpenses')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('allCategories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allCategories')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('timePeriod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allTime')}</SelectItem>
                    <SelectItem value="today">{t('today')}</SelectItem>
                    <SelectItem value="week">{t('thisWeek')}</SelectItem>
                    <SelectItem value="month">{t('thisMonth')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentTransactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {expense.category === 'Food & Dining' ? '🍽️' :
                       expense.category === 'Kirana' ? '🛒' :
                       expense.category === 'Travel' ? '🚗' :
                       expense.category === 'Utilities' ? '📱' :
                       expense.category === 'Healthcare' ? '🏥' :
                       expense.category === 'Shopping' ? '🛍️' : '💳'}
                    </div>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-gray-600">
                        {expense.merchant} • {t(expense.category)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {expense.date} • {expense.method}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-red-600">
                      -{formatCurrency(expense.amount)}
                    </div>
                    <div className="flex space-x-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditExpense(expense)}
                        className="p-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 p-2"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredExpenses.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💳</div>
                  <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || categoryFilter !== 'all' || filter !== 'all' 
                      ? 'Try adjusting your filters to see more expenses.'
                      : 'Start tracking your expenses by adding your first transaction.'
                    }
                  </p>
                  {(!searchTerm && categoryFilter === 'all' && filter === 'all') && (
                    <Button onClick={openAddModal} className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      Add Your First Expense
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Modal */}
      <ExpenseModal 
        open={showExpenseModal} 
        onClose={() => setShowExpenseModal(false)}
        onExpenseAdded={handleAddExpense}
        onExpenseUpdated={handleUpdateExpense}
        expense={selectedExpense}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete')} Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteExpense}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Expenses;