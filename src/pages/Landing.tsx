
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface LandingProps {
  onAuthenticate: () => void;
}

const Landing = ({ onAuthenticate }: LandingProps) => {
  const [authMode, setAuthMode] = useState<'mobile' | 'email'>('mobile');
  const [language, setLanguage] = useState('en');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { toast } = useToast();

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
      toast({
        title: "सफल लॉगिन!",
        description: "Welcome to Smart Spend!",
      });
      onAuthenticate();
    } else {
      toast({
        title: "गलत OTP",
        description: "Please enter correct OTP",
        variant: "destructive",
      });
    }
  };

  const getLocalizedText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      en: {
        welcome: "Welcome to Smart Spend",
        subtitle: "AI-Powered Budget Tracking for Smart Indians",
        mobileAuth: "Mobile Number",
        emailAuth: "Email Address",
        sendOtp: "Send OTP",
        verifyOtp: "Verify & Login",
        enterOtp: "Enter OTP",
        language: "Language",
        whatsappLogin: "Login with WhatsApp",
        features1: "Track UPI & Cash Expenses",
        features2: "Festival Budget Planning",
        features3: "AI-Powered Insights",
        features4: "Multi-language Support"
      },
      hi: {
        welcome: "स्मार्ट स्पेंड में आपका स्वागत है",
        subtitle: "स्मार्ट भारतीयों के लिए AI-संचालित बजट ट्रैकिंग",
        mobileAuth: "मोबाइल नंबर",
        emailAuth: "ईमेल पता",
        sendOtp: "OTP भेजें",
        verifyOtp: "सत्यापित करें और लॉगिन करें",
        enterOtp: "OTP दर्ज करें",
        language: "भाषा",
        whatsappLogin: "WhatsApp से लॉगिन करें",
        features1: "UPI और नकद खर्च ट्रैक करें",
        features2: "त्योहार बजट योजना",
        features3: "AI-संचालित अंतर्दृष्टि",
        features4: "बहुभाषी समर्थन"
      },
      te: {
        welcome: "స్మార్ట్ స్పెండ్‌కు స్వాగతం",
        subtitle: "తెలివైన భారతీయుల కోసం AI-శక్తితో బడ్జెట్ ట్రాకింగ్",
        mobileAuth: "మొబైల్ నంబర్",
        emailAuth: "ఇమెయిల్ చిరునామా",
        sendOtp: "OTP పంపండి",
        verifyOtp: "ధృవీకరించి లాగిన్ చేయండి",
        enterOtp: "OTP నమోదు చేయండి",
        language: "భాష",
        whatsappLogin: "WhatsApp తో లాగిన్ చేయండి",
        features1: "UPI మరియు నగదు ఖర్చులను ట్రాక్ చేయండి",
        features2: "పండుగ బడ్జెట్ ప్లానింగ్",
        features3: "AI-శక్తితో అంతర్దృష్టులు",
        features4: "బహుభాషా మద్దతు"
      }
    };
    return texts[language][key] || texts.en[key];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 diwali-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl mr-2 diya-animation">🪔</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Smart Spend
            </h1>
            <div className="text-2xl ml-2 rupee-animation">₹</div>
          </div>
          <p className="text-lg text-gray-600 mb-6">{getLocalizedText('subtitle')}</p>
          
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

        <div className="max-w-md mx-auto">
          {/* Authentication Card */}
          <Card className="card-indian mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">{getLocalizedText('welcome')}</CardTitle>
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
                      📱 {getLocalizedText('mobileAuth')}
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        authMode === 'email' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
                      }`}
                      onClick={() => setAuthMode('email')}
                    >
                      📧 {getLocalizedText('emailAuth')}
                    </button>
                  </div>

                  {/* Input Fields */}
                  {authMode === 'mobile' ? (
                    <div className="space-y-2">
                      <Label htmlFor="mobile">{getLocalizedText('mobileAuth')}</Label>
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
                      <Label htmlFor="email">{getLocalizedText('emailAuth')}</Label>
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
                    className="w-full btn-primary-indian"
                    disabled={authMode === 'mobile' ? mobileNumber.length !== 10 : !email.includes('@')}
                  >
                    {getLocalizedText('sendOtp')}
                  </Button>

                  {/* WhatsApp Login */}
                  <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                    <span className="mr-2">💬</span>
                    {getLocalizedText('whatsappLogin')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">{getLocalizedText('enterOtp')}</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-sm text-gray-500">
                      Demo OTP: <span className="font-mono font-bold">123456</span>
                    </p>
                  </div>

                  <Button 
                    onClick={handleVerifyOTP} 
                    className="w-full btn-primary-indian"
                    disabled={otp.length !== 6}
                  >
                    {getLocalizedText('verifyOtp')}
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

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "💳", text: getLocalizedText('features1') },
              { icon: "🎉", text: getLocalizedText('features2') },
              { icon: "🤖", text: getLocalizedText('features3') },
              { icon: "🌐", text: getLocalizedText('features4') }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-4 border-orange-100">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="text-sm text-gray-600">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
