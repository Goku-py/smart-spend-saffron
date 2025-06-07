
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import AddExpenseModal from "@/components/AddExpenseModal";
import { sampleExpenses, categories } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/contexts/TranslationContext";

const Expenses = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState(sampleExpenses);
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  const handleAddExpense = (expenseData: any) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExpense, ...prev]);
    toast({
      title: t('expenseAddedSuccessfully'),
      description: `${formatCurrency(expenseData.amount)} for ${expenseData.description}`,
    });
  };

  const handleEditExpense = (id: number) => {
    console.log('Editing expense with ID:', id);
    toast({
      title: t('editFeature'),
      description: t('editFunctionalityWillBeImplemented'),
    });
  };

  const handleDeleteExpense = (id: number) => {
    console.log('Deleting expense with ID:', id);
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: t('expenseDeleted'),
      description: t('expenseHasBeenRemoved'),
      variant: "destructive",
    });
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
            onClick={() => setShowAddExpense(true)}
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
                        {category}
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
                        {expense.merchant} • {expense.category}
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
                        onClick={() => handleEditExpense(expense.id)}
                      >
                        {t('edit')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        {t('delete')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddExpenseModal 
        open={showAddExpense} 
        onClose={() => setShowAddExpense(false)}
        onExpenseAdded={handleAddExpense}
      />
    </Layout>
  );
};

export default Expenses;
