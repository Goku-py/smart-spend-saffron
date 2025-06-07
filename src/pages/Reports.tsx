
import NavigationBar from "@/components/NavigationBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
            <span className="mr-2">📈</span>
            Reports & Analytics
          </h1>
          <p className="text-gray-600">Analyze your spending patterns and trends</p>
        </div>

        <Card className="card-indian">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Detailed reports and analytics will be available soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600">Charts and insights coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
