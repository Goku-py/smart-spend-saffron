
import NavigationBar from "@/components/NavigationBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
            <span className="mr-2">👤</span>
            Profile & Settings
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <Card className="card-indian">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Profile management and settings will be available soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚙️</div>
              <p className="text-gray-600">Settings and preferences coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
