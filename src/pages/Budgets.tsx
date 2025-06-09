import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2 } from "lucide-react";

interface Budget {
  id: string;
  name: string;
  amount: number;
  category: string;
  spent: number;
  created_at: string;
  updated_at: string;
}

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: '',
    category: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Fetch budgets from Supabase
  const fetchBudgets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'Food & Dining': '🍽️',
      'Kirana': '🛒',
      'Travel': '🚗',
      'Utilities': '📱',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Education': '📚'
    };
    return iconMap[category] || '💳';
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.name || !newBudget.amount || !newBudget.category) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          name: newBudget.name,
          amount: parseFloat(newBudget.amount),
          category: newBudget.category,
          spent: 0
        });

      if (error) throw error;

      setShowCreateBudget(false);
      setNewBudget({ name: '', amount: '', category: '' });
      fetchBudgets();
      
      toast({
        title: t('budgetCreated'),
        description: `₹${newBudget.amount} budget set for ${newBudget.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create budget",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget || !newBudget.name || !newBudget.amount || !newBudget.category) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          name: newBudget.name,
          amount: parseFloat(newBudget.amount),
          category: newBudget.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedBudget.id);

      if (error) throw error;

      setShowEditBudget(false);
      setSelectedBudget(null);
      setNewBudget({ name: '', amount: '', category: '' });
      fetchBudgets();
      
      toast({
        title: t('budgetUpdated'),
        description: `Budget updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update budget",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!selectedBudget) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', selectedBudget.id);

      if (error) throw error;

      setShowDeleteDialog(false);
      setSelectedBudget(null);
      fetchBudgets();
      
      toast({
        title: t('budgetDeleted'),
        description: `Budget deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete budget",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (budget: Budget) => {
    setSelectedBudget(budget);
    setNewBudget({
      name: budget.name,
      amount: budget.amount.toString(),
      category: budget.category
    });
    setShowEditBudget(true);
  };

  const openDeleteDialog = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowDeleteDialog(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('budgets')} Management</h1>
            <p className="text-gray-600">Set and track your spending limits</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
            onClick={() => setShowCreateBudget(true)}
          >
            {t('createBudget')}
          </Button>
        </div>

        {/* Budget Overview */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle>{t('monthlyBudget')} Overview</CardTitle>
            <CardDescription>Your overall budget performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">₹{totalBudget.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total {t('budget')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">₹{totalSpent.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total {t('spent')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">₹{(totalBudget - totalSpent).toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">{t('remaining')}</div>
              </div>
            </div>
            <Progress 
              value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} 
              className="mt-4 h-3"
            />
          </CardContent>
        </Card>

        {/* Category Budgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const remaining = budget.amount - budget.spent;
            const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';
            
            return (
              <Card key={budget.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCategoryIcon(budget.category)}</span>
                      <div>
                        <CardTitle className="text-lg">{budget.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">{t(budget.category)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={status === 'over' ? 'destructive' : status === 'warning' ? 'default' : 'secondary'}
                      >
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>{t('spent')}: ₹{budget.spent.toLocaleString('en-IN')}</span>
                      <span>{t('budget')}: ₹{budget.amount.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${
                        status === 'over' ? 'bg-red-100' : 
                        status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className={`text-sm font-medium ${
                        remaining < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {remaining >= 0 ? `${t('remaining')}: ` : 'Over by: '}
                        ₹{Math.abs(remaining).toLocaleString('en-IN')}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(budget)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDeleteDialog(budget)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                {status === 'over' && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                    OVER BUDGET
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">No budgets yet</h3>
              <p className="text-gray-600 mb-4">Create your first budget to start tracking your expenses</p>
              <Button 
                onClick={() => setShowCreateBudget(true)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
              >
                {t('createBudget')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Budget Modal */}
      <Dialog open={showCreateBudget} onOpenChange={setShowCreateBudget}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('createBudget')}</DialogTitle>
            <DialogDescription>
              Set spending limits for different categories
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateBudget} className="space-y-4">
            
            <div className="space-y-2">
              <Label>{t('budgetName')}</Label>
              <Input
                value={newBudget.name}
                onChange={(e) => setNewBudget(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Monthly Groceries"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('category')}</Label>
              <Select value={newBudget.category} onValueChange={(value) => setNewBudget(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Dining">🍽️ {t('Food & Dining')}</SelectItem>
                  <SelectItem value="Kirana">🛒 {t('Kirana')}</SelectItem>
                  <SelectItem value="Travel">🚗 {t('Travel')}</SelectItem>
                  <SelectItem value="Utilities">📱 {t('Utilities')}</SelectItem>
                  <SelectItem value="Healthcare">🏥 {t('Healthcare')}</SelectItem>
                  <SelectItem value="Shopping">🛍️ {t('Shopping')}</SelectItem>
                  <SelectItem value="Entertainment">🎬 {t('Entertainment')}</SelectItem>
                  <SelectItem value="Education">📚 {t('Education')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">{t('budgetAmount')}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget(prev => ({...prev, amount: e.target.value}))}
                  className="pl-8"
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateBudget(false)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
              >
                {t('createBudget')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Modal */}
      <Dialog open={showEditBudget} onOpenChange={setShowEditBudget}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('editBudget')}</DialogTitle>
            <DialogDescription>
              Update your budget details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditBudget} className="space-y-4">
            
            <div className="space-y-2">
              <Label>{t('budgetName')}</Label>
              <Input
                value={newBudget.name}
                onChange={(e) => setNewBudget(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Monthly Groceries"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('category')}</Label>
              <Select value={newBudget.category} onValueChange={(value) => setNewBudget(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Dining">🍽️ {t('Food & Dining')}</SelectItem>
                  <SelectItem value="Kirana">🛒 {t('Kirana')}</SelectItem>
                  <SelectItem value="Travel">🚗 {t('Travel')}</SelectItem>
                  <SelectItem value="Utilities">📱 {t('Utilities')}</SelectItem>
                  <SelectItem value="Healthcare">🏥 {t('Healthcare')}</SelectItem>
                  <SelectItem value="Shopping">🛍️ {t('Shopping')}</SelectItem>
                  <SelectItem value="Entertainment">🎬 {t('Entertainment')}</SelectItem>
                  <SelectItem value="Education">📚 {t('Education')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editAmount">{t('budgetAmount')}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold">
                  ₹
                </span>
                <Input
                  id="editAmount"
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget(prev => ({...prev, amount: e.target.value}))}
                  className="pl-8"
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditBudget(false)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
              >
                {t('update')} Budget
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete')} Budget</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDelete')} This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBudget}
              disabled={isLoading}
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

export default Budgets;