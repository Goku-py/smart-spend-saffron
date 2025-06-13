import React from 'react';
import { z } from 'zod';
import { FormWizard } from '../ui/form-wizard';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import { FormDatePicker } from '../ui/form-date-picker';
import { FormFileUpload } from '../ui/form-file-upload';
import { FormRichText } from '../ui/form-rich-text';
import { FormCheckbox } from '../ui/form-checkbox';

// Define the combined schema
const schema = z.object({
  accountType: z.enum(['personal', 'business', 'enterprise']),
  personalInfo: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    dateOfBirth: z.date().optional(),
  }),
  businessInfo: z.object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    businessType: z.enum(['retail', 'service', 'manufacturing', 'other']),
    taxId: z.string().optional(),
    businessAddress: z.string().optional(),
  }).optional(),
  enterpriseInfo: z.object({
    companySize: z.enum(['small', 'medium', 'large']),
    industry: z.string(),
    annualRevenue: z.string(),
    numberOfEmployees: z.number().min(1),
  }).optional(),
  accountSecurity: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
  profileDetails: z.object({
    bio: z.string().optional(),
    avatar: z.any().optional(),
    preferences: z.object({
      newsletter: z.boolean(),
      marketing: z.boolean(),
    }),
  }),
  terms: z.object({
    accepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  }),
});

type RegistrationFormData = z.infer<typeof schema>;

const AccountTypeStep: React.FC = () => (
  <div className="space-y-4">
    <FormSelect
      name="accountType"
      label="Account Type"
      options={[
        { value: 'personal', label: 'Personal Account' },
        { value: 'business', label: 'Business Account' },
        { value: 'enterprise', label: 'Enterprise Account' },
      ]}
    />
  </div>
);

const PersonalInfoStep: React.FC = () => (
  <div className="space-y-4">
    <FormInput
      name="personalInfo.firstName"
      label="First Name"
      placeholder="Enter your first name"
    />
    <FormInput
      name="personalInfo.lastName"
      label="Last Name"
      placeholder="Enter your last name"
    />
    <FormInput
      name="personalInfo.email"
      label="Email"
      type="email"
      placeholder="Enter your email"
    />
    <FormInput
      name="personalInfo.phone"
      label="Phone"
      placeholder="Enter your phone number"
    />
    <FormDatePicker
      name="personalInfo.dateOfBirth"
      label="Date of Birth"
      placeholder="Select your date of birth"
    />
  </div>
);

const BusinessInfoStep: React.FC = () => (
  <div className="space-y-4">
    <FormInput
      name="businessInfo.companyName"
      label="Company Name"
      placeholder="Enter your company name"
    />
    <FormSelect
      name="businessInfo.businessType"
      label="Business Type"
      options={[
        { value: 'retail', label: 'Retail' },
        { value: 'service', label: 'Service' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'other', label: 'Other' },
      ]}
    />
    <FormInput
      name="businessInfo.taxId"
      label="Tax ID"
      placeholder="Enter your tax ID"
    />
    <FormInput
      name="businessInfo.businessAddress"
      label="Business Address"
      placeholder="Enter your business address"
    />
  </div>
);

const EnterpriseInfoStep: React.FC = () => (
  <div className="space-y-4">
    <FormSelect
      name="enterpriseInfo.companySize"
      label="Company Size"
      options={[
        { value: 'small', label: 'Small (1-50 employees)' },
        { value: 'medium', label: 'Medium (51-500 employees)' },
        { value: 'large', label: 'Large (500+ employees)' },
      ]}
    />
    <FormInput
      name="enterpriseInfo.industry"
      label="Industry"
      placeholder="Enter your industry"
    />
    <FormInput
      name="enterpriseInfo.annualRevenue"
      label="Annual Revenue"
      placeholder="Enter your annual revenue"
    />
    <FormInput
      name="enterpriseInfo.numberOfEmployees"
      label="Number of Employees"
      type="number"
      placeholder="Enter number of employees"
    />
  </div>
);

const AccountSecurityStep: React.FC = () => (
  <div className="space-y-4">
    <FormInput
      name="accountSecurity.password"
      label="Password"
      type="password"
      placeholder="Enter your password"
    />
    <FormInput
      name="accountSecurity.confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="Confirm your password"
    />
  </div>
);

const ProfileDetailsStep: React.FC = () => (
  <div className="space-y-4">
    <FormRichText
      name="profileDetails.bio"
      label="Bio"
      placeholder="Tell us about yourself"
    />
    <FormFileUpload
      name="profileDetails.avatar"
      label="Profile Picture"
      accept="image/*"
    />
    <div className="space-y-2">
      <FormCheckbox
        name="profileDetails.preferences.newsletter"
        label="Subscribe to newsletter"
      />
      <FormCheckbox
        name="profileDetails.preferences.marketing"
        label="Receive marketing communications"
      />
    </div>
  </div>
);

const TermsStep: React.FC = () => (
  <div className="space-y-4">
    <FormCheckbox
      name="terms.accepted"
      label="I accept the terms and conditions"
    />
  </div>
);

const steps = [
  {
    id: 'account-type',
    title: 'Account Type',
    description: 'Choose your account type',
    component: AccountTypeStep,
    schema: schema,
    nextStep: (values: RegistrationFormData) => {
      switch (values.accountType) {
        case 'personal':
          return 'personal-info';
        case 'business':
          return 'business-info';
        case 'enterprise':
          return 'enterprise-info';
        default:
          return null;
      }
    }
  },
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    component: PersonalInfoStep,
    schema: schema,
    isVisible: (values: RegistrationFormData) => values.accountType === 'personal',
    dependencies: [
      {
        stepId: 'account-type',
        condition: (values: RegistrationFormData) => values.accountType === 'personal'
      }
    ]
  },
  {
    id: 'business-info',
    title: 'Business Information',
    description: 'Tell us about your business',
    component: BusinessInfoStep,
    schema: schema,
    isVisible: (values: RegistrationFormData) => values.accountType === 'business',
    dependencies: [
      {
        stepId: 'account-type',
        condition: (values: RegistrationFormData) => values.accountType === 'business'
      }
    ]
  },
  {
    id: 'enterprise-info',
    title: 'Enterprise Information',
    description: 'Tell us about your enterprise',
    component: EnterpriseInfoStep,
    schema: schema,
    isVisible: (values: RegistrationFormData) => values.accountType === 'enterprise',
    dependencies: [
      {
        stepId: 'account-type',
        condition: (values: RegistrationFormData) => values.accountType === 'enterprise'
      }
    ]
  },
  {
    id: 'account-security',
    title: 'Account Security',
    description: 'Set up your account security',
    component: AccountSecurityStep,
    schema: schema,
    dependencies: [
      {
        stepId: 'personal-info',
        condition: (values: RegistrationFormData) => values.accountType === 'personal'
      },
      {
        stepId: 'business-info',
        condition: (values: RegistrationFormData) => values.accountType === 'business'
      },
      {
        stepId: 'enterprise-info',
        condition: (values: RegistrationFormData) => values.accountType === 'enterprise'
      }
    ]
  },
  {
    id: 'profile-details',
    title: 'Profile Details',
    description: 'Customize your profile',
    component: ProfileDetailsStep,
    schema: schema,
    dependencies: [
      {
        stepId: 'account-security',
        condition: () => true
      }
    ]
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    description: 'Review and accept terms',
    component: TermsStep,
    schema: schema,
    dependencies: [
      {
        stepId: 'profile-details',
        condition: () => true
      }
    ]
  }
];

const initialValues: RegistrationFormData = {
  accountType: 'personal',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  businessInfo: {
    companyName: '',
    businessType: 'retail',
  },
  enterpriseInfo: {
    companySize: 'small',
    industry: '',
    annualRevenue: '',
    numberOfEmployees: 1,
  },
  accountSecurity: {
    password: '',
    confirmPassword: '',
  },
  profileDetails: {
    bio: '',
    preferences: {
      newsletter: false,
      marketing: false,
    },
  },
  terms: {
    accepted: false,
  },
};

export const AdvancedRegistrationWizard: React.FC = () => {
  const handleComplete = async (values: RegistrationFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', values);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <FormWizard
        steps={steps}
        initialValues={initialValues}
        onComplete={handleComplete}
        persistKey="advanced-registration"
        confirmSubmit={{
          title: "Submit Registration",
          message: "Please review your information before proceeding. You won't be able to make changes after submission.",
        }}
        transition={{
          enter: "transition-opacity duration-300 ease-out",
          leave: "transition-opacity duration-300 ease-in"
        }}
      />
    </div>
  );
}; 