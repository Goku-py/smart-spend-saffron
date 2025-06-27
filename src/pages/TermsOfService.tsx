import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOWrapper from "../components/SEOWrapper";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <SEOWrapper 
      title="Terms of Service" 
      description="Read Smart Spend's terms of service and user agreement. Understand your rights and responsibilities when using our AI-powered budget tracking platform."
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
              <p className="text-gray-600">Last updated: January 9, 2025</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using Smart Spend ("the Service"), you accept and agree to be bound by 
                  the terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-gray-600 mb-4">
                  Smart Spend is an AI-powered budget tracking and financial management platform that helps 
                  users track expenses, manage budgets, and gain insights into their spending patterns. 
                  The Service includes:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Expense tracking and categorization</li>
                  <li>Budget creation and monitoring</li>
                  <li>Financial analytics and reporting</li>
                  <li>AI-powered spending insights</li>
                  <li>Multi-currency support</li>
                  <li>Data export and backup features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Account Creation</h3>
                    <p className="text-gray-600">
                      To use certain features of the Service, you must create an account. You agree to 
                      provide accurate, current, and complete information during registration and to 
                      update such information to keep it accurate, current, and complete.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Account Security</h3>
                    <p className="text-gray-600">
                      You are responsible for safeguarding the password and for maintaining the security 
                      of your account. You agree not to disclose your password to any third party and 
                      to take sole responsibility for any activities or actions under your account.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                <p className="text-gray-600 mb-4">You agree not to use the Service to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit any harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the Service for any commercial purpose without permission</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Financial Data and Privacy</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Data Accuracy</h3>
                    <p className="text-gray-600">
                      While we strive to provide accurate financial insights and calculations, you are 
                      responsible for verifying the accuracy of your financial data and any insights 
                      provided by the Service.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">No Financial Advice</h3>
                    <p className="text-gray-600">
                      The Service provides tools and insights for personal financial management but does 
                      not constitute financial advice. You should consult with qualified financial 
                      professionals for specific financial guidance.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                <p className="text-gray-600 mb-4">
                  The Service and its original content, features, and functionality are and will remain 
                  the exclusive property of Smart Spend and its licensors. The Service is protected by 
                  copyright, trademark, and other laws.
                </p>
                <p className="text-gray-600">
                  You retain ownership of any financial data you input into the Service. By using the 
                  Service, you grant us a limited license to use this data to provide the Service to you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
                <p className="text-gray-600">
                  We strive to maintain high availability of the Service, but we do not guarantee 
                  uninterrupted access. The Service may be temporarily unavailable due to maintenance, 
                  updates, or technical issues. We reserve the right to modify or discontinue the 
                  Service at any time with reasonable notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, Smart Spend shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages, including but 
                  not limited to loss of profits, data, or other intangible losses, resulting from 
                  your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
                <p className="text-gray-600">
                  You agree to defend, indemnify, and hold harmless Smart Spend and its affiliates 
                  from and against any claims, damages, obligations, losses, liabilities, costs, 
                  or debt arising from your use of the Service or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend your account and access to the Service immediately, 
                  without prior notice, for any reason, including if you breach these Terms. 
                  You may also terminate your account at any time through your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
                <p className="text-gray-600">
                  These Terms shall be governed by and construed in accordance with the laws of India, 
                  without regard to its conflict of law provisions. Any disputes arising under these 
                  Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right to modify these Terms at any time. We will notify users of 
                  material changes via email or through the Service. Your continued use of the Service 
                  after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@smartspend.com<br />
                    <strong>Address:</strong> Smart Spend Legal Team<br />
                    123 Tech Street, Bangalore, Karnataka 560001, India<br />
                    <strong>Phone:</strong> +91-80-1234-5678
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </SEOWrapper>
  );
};

export default TermsOfService;