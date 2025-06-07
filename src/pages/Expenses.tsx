
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import NavigationBar from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";

const Expenses = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const { toast } = useToast();

  const categories = [
    { value: "kirana", label: "🛒 Kirana (Groceries)", color: "bg-green-100" },
    { value: "food-dining", label: "🍽️ Food & Dining", color: "bg-orange-100" },
    { value: "travel", label: "🚗 Travel", color: "bg-blue-100" },
    { value: "utilities", label: "💡 Utilities", color: "bg-yellow-100" },
    { value: "festivals", label: "🎉 Festivals", color: "bg-purple-100" },
    { value: "healthcare", label: "🏥 Healthcare", color: "bg-red-100" },
    { value: "education", label: "📚 Education", color: "bg-indigo-100" },
    { value: "entertainment", label: "🎬 Entertainment", color: "bg-pink-100" },
  ];

  const paymentMethods = [
    { value: "upi", label: "💳 UPI" },
    { value: "cash", label: "💵 Cash" },
    { value: "card", label: "💳 Debit/Credit Card" },
    { value: "netbanking", label: "🏦 Net Banking" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Expense Added! ✅",
      description: `₹${amount} spent on ${description}`,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setPaymentMethod('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
            <span className="mr-2">💳</span>
            Add Expense
          </h1>
          <p className="text-gray-600">Track your spending to manage your budget better</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="card-indian">
            <CardHeader>
              <CardTitle>New Expense</CardTitle>
              <CardDescription>
                Record your transaction details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold text-lg">
                      ₹
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 text-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
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
                    placeholder="e.g., Coffee at CCD, Groceries from BigBasket"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method *</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="How did you pay?" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full btn-primary-indian">
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Add Buttons */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Add</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "☕ Coffee", amount: "150", cat: "food-dining" },
                { label: "🛺 Auto", amount: "80", cat: "travel" },
                { label: "🛒 Groceries", amount: "500", cat: "kirana" },
                { label: "📱 Recharge", amount: "599", cat: "utilities" },
              ].map((quick, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center border-orange-200 hover:bg-orange-50"
                  onClick={() => {
                    setAmount(quick.amount);
                    setCategory(quick.cat);
                    setDescription(quick.label.split(' ')[1]);
                  }}
                >
                  <span className="text-lg mb-1">{quick.label}</span>
                  <span className="text-xs text-gray-600">₹{quick.amount}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
