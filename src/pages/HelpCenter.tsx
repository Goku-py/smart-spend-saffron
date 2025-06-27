import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock,
  HelpCircle,
  FileText,
  Video,
  Users,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOWrapper from '../components/SEOWrapper';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqs = [
    {
      id: '1',
      category: 'Getting Started',
      question: 'How do I create my first budget?',
      answer: 'To create your first budget, go to the Budgets page and click "Create New Budget". Enter your budget details including the category, amount, and time period. You can then track your spending against this budget.',
      tags: ['budget', 'setup', 'beginner']
    },
    {
      id: '2',
      category: 'Expenses',
      question: 'How do I add an expense?',
      answer: 'Navigate to the Expenses page and click "Add Expense". Fill in the amount, category, description, and date. You can also add payment method details for better tracking.',
      tags: ['expense', 'tracking', 'beginner']
    },
    {
      id: '3',
      category: 'Reports',
      question: 'How do I view my spending analytics?',
      answer: 'Visit the Reports section to see detailed analytics of your spending patterns, category breakdowns, monthly trends, and budget performance. You can filter by date ranges and categories.',
      tags: ['reports', 'analytics', 'insights']
    },
    {
      id: '4',
      category: 'Account',
      question: 'How do I change my currency preference?',
      answer: 'Go to Profile > Settings and select your preferred currency from the dropdown. This will update all monetary displays throughout the app.',
      tags: ['currency', 'settings', 'profile']
    },
    {
      id: '5',
      category: 'Security',
      question: 'Is my financial data secure?',
      answer: 'Yes, we use bank-level encryption and security measures. Your data is encrypted in transit and at rest. We never store your banking credentials and use secure authentication methods.',
      tags: ['security', 'privacy', 'data']
    },
    {
      id: '6',
      category: 'Mobile',
      question: 'Is there a mobile app available?',
      answer: 'Smart Spend is a responsive web application that works perfectly on mobile browsers. A dedicated mobile app is planned for future release.',
      tags: ['mobile', 'app', 'responsive']
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 9 AM - 6 PM IST',
      action: 'Start Chat',
      disabled: true
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      disabled: false
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: 'Mon-Fri, 9 AM - 6 PM IST',
      action: 'Schedule Call',
      disabled: true
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: 'User Guide',
      description: 'Complete guide to using Smart Spend',
      link: '#',
      badge: 'Popular'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials',
      link: '#',
      badge: 'New'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: '#',
      badge: null
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message Sent! 📧",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
  };

  return (
    <SEOWrapper 
      title="Help Center" 
      description="Get help and support for Smart Spend. Find answers to common questions, contact support, and access helpful resources."
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Find answers and get the help you need
              </p>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for help topics, questions, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg py-3"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-orange-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    {searchQuery ? `${filteredFaqs.length} results found` : `${faqs.length} articles available`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left py-4">
                          <div className="flex items-start justify-between w-full mr-4">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {faq.question}
                              </h3>
                              <div className="flex items-center mt-2 space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {faq.category}
                                </Badge>
                                {faq.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-4">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Try searching with different keywords or browse our contact options below.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message and we'll help you out.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Please describe your issue in detail..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-yellow-600">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${option.disabled ? 'opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <div className="flex items-start space-x-3">
                        <option.icon className="h-5 w-5 text-orange-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {option.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {option.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {option.availability}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-3" 
                            disabled={option.disabled}
                          >
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Helpful Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <resource.icon className="h-5 w-5 text-orange-600" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {resource.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                      {resource.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {resource.badge}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">API Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Database</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Authentication</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Operational
                      </Badge>
                    </div>
                  </div>
                  <Button variant="link" className="w-full mt-3 text-orange-600 p-0">
                    View Status Page
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SEOWrapper>
  );
};

export default HelpCenter;
