
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const Auth = () => {
  const [language, setLanguage] = useState('en');
  const [authMode, setAuthMode] = useState<'mobile' | 'email'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOTP = () => {
    if (authMode === 'mobile' && mobileNumber.length === 10) {
      setOtpSent(true);
      toast({
        title: "OTP भेजा गया!",
        description: `OTP sent to +91 ${mobileNumber}`,
      });
    } else if (authMode === 'email' && email.includes('@')) {
      setOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${email}`,
      });
    }
  };

  const handleVerifyOTP = () => {
    if (otp === '123456') {
      const userData = {
        name: 'Rajesh Kumar',
        phone: `+91 ${mobileNumber}`,
        email: email || 'user@example.com'
      };
      login(userData);
      toast({
        title: "सफल लॉगिन!",
        description: "Welcome to Smart Spend!",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "गलत OTP",
        description: "Please enter correct OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl mr-2">🪔</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Smart Spend
            </span>
            <span className="text-xl ml-2">₹</span>
          </div>
          
          {/* Language Selector */}
          <div className="mb-6">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-48 mx-auto">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇮🇳 English</SelectItem>
                <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                <SelectItem value="te">🇮🇳 తెలుగు</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur border-orange-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Welcome Back</CardTitle>
            <CardDescription>
              {!otpSent ? 'Choose your preferred login method' : 'Enter the OTP sent to you'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!otpSent ? (
              <>
                {/* Auth Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMode === 'mobile' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
                    }`}
                    onClick={() => setAuthMode('mobile')}
                  >
                    📱 Mobile
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMode === 'email' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
                    }`}
                    onClick={() => setAuthMode('email')}
                  >
                    📧 Email
                  </button>
                </div>

                {/* Input Fields */}
                {authMode === 'mobile' ? (
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        +91
                      </span>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="rounded-l-none"
                        maxLength={10}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                <Button 
                  onClick={handleSendOTP} 
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600"
                  disabled={authMode === 'mobile' ? mobileNumber.length !== 10 : !email.includes('@')}
                >
                  Send OTP
                </Button>

                {/* WhatsApp Login */}
                <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                  <span className="mr-2">💬</span>
                  Login with WhatsApp
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-sm text-gray-500 text-center">
                    Demo OTP: <span className="font-mono font-bold">123456</span>
                  </p>
                </div>

                <Button 
                  onClick={handleVerifyOTP} 
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600"
                  disabled={otp.length !== 6}
                >
                  Verify & Login
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setOtpSent(false)}
                  className="w-full text-gray-600"
                >
                  ← Back to login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
