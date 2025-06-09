import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOWrapper from "../components/SEOWrapper";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <SEOWrapper 
      title="Privacy Policy" 
      description="Learn how Smart Spend protects your financial data and privacy. Our comprehensive privacy policy explains data collection, usage, and security measures."
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
              <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: January 9, 2025</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                    <p className="text-gray-600">
                      We collect information you provide directly to us, such as when you create an account, 
                      add financial data, or contact us for support. This may include:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                      <li>Name and email address</li>
                      <li>Financial account information</li>
                      <li>Transaction data</li>
                      <li>Budget and spending preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                    <p className="text-gray-600">
                      We automatically collect certain information about your use of our service, including:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                      <li>Device information and browser type</li>
                      <li>IP address and location data</li>
                      <li>Usage patterns and feature interactions</li>
                      <li>Performance and error data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Provide personalized financial insights and recommendations</li>
                  <li>Detect and prevent fraud and security threats</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, 
                  except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With trusted service providers who assist in our operations</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>End-to-end encryption for sensitive financial data</li>
                  <li>Secure data transmission using HTTPS</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data storage with reputable cloud providers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
                <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access and review your personal data</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of marketing communications</li>
                  <li>Restrict certain data processing activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
                <p className="text-gray-600">
                  We retain your personal information for as long as necessary to provide our services 
                  and fulfill the purposes outlined in this policy. When you delete your account, 
                  we will delete your personal information within 30 days, except where we are 
                  required to retain it for legal or regulatory purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
                <p className="text-gray-600">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure that such transfers comply with applicable data protection laws and 
                  implement appropriate safeguards to protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                <p className="text-gray-600">
                  Our service is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If we become aware that we have 
                  collected such information, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time. We will notify you of any 
                  material changes by posting the new policy on this page and updating the 
                  "Last updated" date. Your continued use of our service after such changes 
                  constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this privacy policy or our data practices, 
                  please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@smartspend.com<br />
                    <strong>Address:</strong> Smart Spend Privacy Team<br />
                    123 Tech Street, Bangalore, Karnataka 560001, India
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

export default PrivacyPolicy;