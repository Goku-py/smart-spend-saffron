import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SecureLogout from "@/components/SecureLogout";
import { useAuth } from "../hooks/useAuth";
import { useCurrency, currencyOptions } from "../contexts/CurrencyContext";
import { useTranslationContext, languages } from "../contexts/TranslationContext";
import { useTranslation } from "react-i18next";

interface UserProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    monthlyIncome: number;
    occupation: string;
    city: string;
  };
  preferences: {
    notifications: {
      budgetAlerts: boolean;
      billReminders: boolean;
      aiInsights: boolean;
      weeklyReports: boolean;
    };
    privacy: {
      shareData: boolean;
      analytics: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const { currentCurrency, setCurrency, formatCurrency } = useCurrency();
  const { currentLanguage, setLanguage } = useTranslationContext();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get user display name from user data
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  const [userProfile, setUserProfile] = useState<UserProfile>({
    personalInfo: {
      name: getUserDisplayName(),
      email: user?.email || '',
      phone: '',
      monthlyIncome: 50000,
      occupation: '',
      city: ''
    },
    preferences: {
      notifications: {
        budgetAlerts: true,
        billReminders: true,
        aiInsights: true,
        weeklyReports: false
      },
      privacy: {
        shareData: false,
        analytics: true
      }
    },
    security: {
      twoFactorEnabled: false,
      biometricEnabled: false
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('smartspend_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleProfileChange = (section: string, field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof UserProfile],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleNestedProfileChange = (section: string, subsection: string, field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof UserProfile],
        [subsection]: {
          ...(prev[section as keyof UserProfile] as any)[subsection],
          [field]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('smartspend_profile', JSON.stringify(userProfile));
    setHasUnsavedChanges(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      profile: userProfile,
      currency: currentCurrency,
      language: currentLanguage,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartspend-data-export.json';
    link.click();
    
    toast({
      title: "Data Export",
      description: "Your data has been exported successfully",
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('profile')} & Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              Save Changes
            </Button>
          )}
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>👤 Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userProfile.personalInfo.name}
                onChange={(e) => handleProfileChange('personalInfo', 'name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userProfile.personalInfo.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={userProfile.personalInfo.phone}
                onChange={(e) => handleProfileChange('personalInfo', 'phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold">
                  {currentCurrency.symbol}
                </span>
                <Input
                  id="income"
                  type="number"
                  value={userProfile.personalInfo.monthlyIncome}
                  onChange={(e) => handleProfileChange('personalInfo', 'monthlyIncome', Number(e.target.value))}
                  className="pl-8"
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={userProfile.personalInfo.occupation}
                  onChange={(e) => handleProfileChange('personalInfo', 'occupation', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={userProfile.personalInfo.city}
                  onChange={(e) => handleProfileChange('personalInfo', 'city', e.target.value)}
                  placeholder="Mumbai"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={currentLanguage.code} onValueChange={(value) => {
                const language = languages.find(l => l.code === value);
                if (language) setLanguage(language);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.flag} {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currentCurrency.code} onValueChange={(value) => {
                const currency = currencyOptions.find(c => c.code === value);
                if (currency) setCurrency(currency);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Preview: {formatCurrency(1000)} = 1000 INR
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>🔔 Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <Switch 
                id="budget-alerts" 
                checked={userProfile.preferences.notifications.budgetAlerts}
                onCheckedChange={(checked) => handleNestedProfileChange('preferences', 'notifications', 'budgetAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="bill-reminders">Bill Reminders</Label>
              <Switch 
                id="bill-reminders" 
                checked={userProfile.preferences.notifications.billReminders}
                onCheckedChange={(checked) => handleNestedProfileChange('preferences', 'notifications', 'billReminders', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-insights">AI Insights</Label>
              <Switch 
                id="ai-insights" 
                checked={userProfile.preferences.notifications.aiInsights}
                onCheckedChange={(checked) => handleNestedProfileChange('preferences', 'notifications', 'aiInsights', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <Switch 
                id="weekly-reports" 
                checked={userProfile.preferences.notifications.weeklyReports}
                onCheckedChange={(checked) => handleNestedProfileChange('preferences', 'notifications', 'weeklyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle>🔒 Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="share-data">Share Anonymous Usage Data</Label>
              <Switch 
                id="share-data" 
                checked={userProfile.preferences.privacy.shareData}
                onCheckedChange={(checked) => handleNestedProfileChange('preferences', 'privacy', 'shareData', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Enable Analytics</Label>
              <Switch 
                id="analytics" 
                checked={userProfile.preferences.privacy.analytics}
                onCheckedChange={(checked) => handleNestedProfileChange('preferences', 'privacy', 'analytics', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch 
                id="two-factor" 
                checked={userProfile.security.twoFactorEnabled}
                onCheckedChange={(checked) => handleProfileChange('security', 'twoFactorEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="biometric">Biometric Login</Label>
              <Switch 
                id="biometric" 
                checked={userProfile.security.biometricEnabled}
                onCheckedChange={(checked) => handleProfileChange('security', 'biometricEnabled', checked)}
              />
            </div>
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
            
            <SecureLogout 
              variant="outline"
              className="w-full justify-start"
            />
            
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