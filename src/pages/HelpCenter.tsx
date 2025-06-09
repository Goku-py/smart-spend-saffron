import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MessageCircle, Book, Video, Mail } from "lucide-react";
import SEOWrapper from "../components/SEOWrapper";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      id: 'getting-started',
      question: 'How do I get started with Smart Spend?',
      answer: 'Getting started is easy! Simply create an account, add your first expense, and set up your budgets. Our onboarding guide will walk you through each step.'
    },
    {
      id: 'add-expenses',
      question: 'How do I add expenses?',
      answer: 'Click the "Add Expense" button on your dashboard or expenses page. Fill in the amount, category, description, and other details. You can also add expenses from the mobile app.'
    },
    {
      id: 'create-budgets',
      question: 'How do I create and manage budgets?',
      answer: 'Go to the Budgets page and click "Create Budget". Set a name, category, and amount. You can edit or delete budgets anytime, and track your progress in real-time.'
    },
    {
      id: 'categories',
      question: 'Can I customize expense categories?',
      answer: 'Yes! You can create custom categories or use our predefined ones like Food & Dining, Travel, Utilities, etc. Categories help organize your spending and generate better insights.'
    },
    {
      id: 'reports',
      question: 'How do I view my spending reports?',
      answer: 'Visit the Reports page to see detailed analytics including spending by category, monthly trends, and AI-powered insights. You can also export your data for external analysis.'
    },
    {
      id: 'currency',
      question: 'Does Smart Spend support multiple currencies?',
      answer: 'Yes! We support multiple currencies including INR, USD, EUR, and GBP. You can change your currency preference in the Profile settings.'
    },
    {
      id: 'data-security',
      question: 'Is my financial data secure?',
      answer: 'Absolutely! We use bank-level encryption, secure data transmission, and follow industry best practices to protect your financial information. Your data is never shared without your consent.'
    },
    {
      id: 'mobile-app',
      question: 'Is there a mobile app?',
      answer: 'Smart Spend is fully responsive and works great on mobile browsers. A dedicated mobile app is coming soon with additional features like receipt scanning and offline mode.'
    },
    {
      id: 'export-data',
      question: 'Can I export my data?',
      answer: 'Yes! You can export your data in JSON format from the Profile page. This includes all your expenses, budgets, and settings for backup or analysis purposes.'
    },
    {
      id: 'delete-account',
      question: 'How do I delete my account?',
      answer: 'You can delete your account from the Profile page. This will permanently remove all your data. Make sure to export your data first if you want to keep a copy.'
    }
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of Smart Spend',
      icon: Book,
      action: () => navigate('/dashboard')
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials',
      icon: Video,
      action: () => window.open('https://youtube.com', '_blank')
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: Mail,
      action: () => window.open('mailto:support@smartspend.com')
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: MessageCircle,
      action: () => window.open('https://community.smartspend.com', '_blank')
    }
  ];

  return (
    <SEOWrapper 
      title="Help Center" 
      description="Get help with Smart Spend. Find answers to common questions, tutorials, and support resources for our AI-powered budget tracking platform."
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
              <h1 className="text-3xl font-bold text-gray-800">Help Center</h1>
              <p className="text-gray-600">Find answers and get support</p>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={link.action}>
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                    <h3 className="font-semibold mb-2">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length > 0 ? (
                <Accordion type="single\" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-gray-600">Try searching with different keywords or browse our quick links above.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-3">
                    Get personalized help from our support team. We typically respond within 24 hours.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('mailto:support@smartspend.com')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Community Forum</h3>
                  <p className="text-gray-600 mb-3">
                    Connect with other Smart Spend users and share tips and tricks.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://community.smartspend.com', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Request */}
          <Card className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Have a Feature Request?</h3>
              <p className="text-gray-600 mb-4">
                We're always looking to improve Smart Spend. Let us know what features you'd like to see!
              </p>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                onClick={() => window.open('mailto:feedback@smartspend.com?subject=Feature Request')}
              >
                Send Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SEOWrapper>
  );
};

export default HelpCenter;