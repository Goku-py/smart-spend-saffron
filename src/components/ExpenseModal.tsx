import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { categories, paymentMethods } from "../data/mockData";

// Enhanced interface with better type safety
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
  onExpenseAdded?: (expenseData: Partial<Expense>) => void;
  onExpenseUpdated?: (id: string, expenseData: Partial<Expense>) => void;
  expense?: Expense | null;
  mode?: 'add' | 'edit';
}

// Form validation utilities
const validateExpenseForm = (data: Partial<Expense>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!data.category || data.category.trim() === '') {
    errors.push('Category is required');
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (data.amount && data.amount > 1000000) {
    errors.push('Amount cannot exceed ₹10,00,000');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

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
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Enhanced form population with validation
  useEffect(() => {
    if (mode === 'edit' && expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
      setMerchant(expense.merchant || '');
      setPaymentMethod(expense.method || '');
      setDate(expense.date);
      setFormErrors([]);
    } else {
      // Reset form for add mode
      resetForm();
    }
  }, [mode, expense, open]);

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setMerchant('');
    setPaymentMethod('');
    setDate(new Date().toISOString().split('T')[0]);
    setFormErrors([]);
  };

  // Enhanced form submission with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData: Partial<Expense> = {
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      merchant: merchant.trim(),
      method: paymentMethod,
      date: date || new Date().toISOString().split('T')[0]
    };

    // Validate form data
    const validation = validateExpenseForm(expenseData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFormErrors([]);

    try {
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to save expense';
      setFormErrors([errorMessage]);
      toast({
        title: "Error",
        description: errorMessage,
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

  // Enhanced amount input handling
  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setAmount(sanitizedValue);
    
    // Clear amount-related errors
    setFormErrors(prev => prev.filter(error => !error.includes('Amount')));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
        
        {/* Display form errors */}
        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <ul className="text-sm text-red-700 space-y-1">
              {formErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
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
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-8"
                required
                aria-describedby="amount-help"
              />
            </div>
            <p id="amount-help" className="text-xs text-gray-500">
              Enter amount in rupees (e.g., 150.50)
            </p>
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
              placeholder="e.g., Coffee at Starbucks, Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              required
              maxLength={200}
              aria-describedby="description-help"
            />
            <p id="description-help" className="text-xs text-gray-500">
              {description.length}/200 characters
            </p>
          </div>

          {/* Merchant */}
          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Input
              id="merchant"
              placeholder="e.g., Swiggy, BigBasket, Local Store"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              maxLength={100}
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
              required
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
              disabled={isLoading || !amount || !category || !description}
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