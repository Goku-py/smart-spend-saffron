import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { categories, paymentMethods } from "../data/mockData";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  merchant: string;
  method: string;
  date: string;
}

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onExpenseAdded?: (expenseData: any) => void;
  onExpenseUpdated?: (id: string, expenseData: any) => void;
  expense?: Expense | null; // For editing
  mode?: 'add' | 'edit';
}

const ExpenseModal = ({ 
  open, 
  onClose, 
  onExpenseAdded, 
  onExpenseUpdated, 
  expense = null, 
  mode = 'add' 
}: ExpenseModalProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
      setMerchant(expense.merchant);
      setPaymentMethod(expense.method);
      setDate(expense.date);
    } else {
      // Reset form for add mode
      setAmount('');
      setCategory('');
      setDescription('');
      setMerchant('');
      setPaymentMethod('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [mode, expense, open]);

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setMerchant('');
    setPaymentMethod('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const expenseData = {
        amount: parseFloat(amount),
        category,
        description,
        merchant,
        method: paymentMethod,
        date: date || new Date().toISOString().split('T')[0]
      };

      if (mode === 'edit' && expense && onExpenseUpdated) {
        await onExpenseUpdated(expense.id, expenseData);
        toast({
          title: "Expense Updated! ✅",
          description: `₹${amount} expense updated successfully`,
        });
      } else if (mode === 'add' && onExpenseAdded) {
        await onExpenseAdded(expenseData);
        toast({
          title: "Expense Added! ✅",
          description: `₹${amount} spent on ${description}`,
        });
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: "Error",
        description: "Failed to save expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Update your transaction details' 
              : 'Record your transaction details'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="e.g., Coffee, Groceries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              required
            />
          </div>

          {/* Merchant */}
          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Input
              id="merchant"
              placeholder="e.g., Swiggy, BigBasket"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="How did you pay?" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white"
            >
              {isLoading 
                ? 'Saving...' 
                : mode === 'edit' 
                  ? 'Update Expense' 
                  : 'Add Expense'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;