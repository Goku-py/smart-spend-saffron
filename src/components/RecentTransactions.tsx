
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  icon: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card className="card-indian">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💳</span>
            <span>Recent Transactions</span>
          </div>
          <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
            View All
          </Button>
        </CardTitle>
        <CardDescription>
          Your latest UPI and cash transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{transaction.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-800">{transaction.description}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{transaction.date}</span>
                    <span>•</span>
                    <span>{transaction.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.amount < 0 ? '-' : '+'}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-500">
                  UPI
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
