
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "../App";

const Profile = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [monthlyIncome, setMonthlyIncome] = useState('50000');
  const [language, setLanguage] = useState('en');
  const [currency] = useState('INR');
  const [dateFormat] = useState('DD/MM/YYYY');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be ready in a few minutes",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>👤 Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={user?.phone || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Phone number cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold">
                  ₹
                </span>
                <Input
                  id="income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="pl-8"
                  placeholder="50000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇮🇳 English</SelectItem>
                  <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                  <SelectItem value="te">🇮🇳 తెలుగు</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input value={`${currency} (₹)`} disabled className="bg-gray-50" />
            </div>
            
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Input value={dateFormat} disabled className="bg-gray-50" />
            </div>
            
            <Button onClick={handleSaveProfile} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white">
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleExportData}
              variant="outline" 
              className="w-full justify-start"
            >
              📥 Export Data
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start"
            >
              🚪 Logout
            </Button>
            
            <Button 
              onClick={handleDeleteAccount}
              variant="outline" 
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              🗑️ Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <span className="text-2xl">🪔</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Smart Spend
              </span>
              <span className="text-lg">₹</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Version 1.0.0</p>
            <p className="text-xs text-gray-500">
              Made with ❤️ for smart Indians
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
