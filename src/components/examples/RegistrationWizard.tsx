import React from 'react';
import { z } from 'zod';
import { FormWizard } from '../ui/form-wizard';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import { FormDatePicker } from '../ui/form-date-picker';
import { FormFileUpload } from '../ui/form-file-upload';
import { FormRichText } from '../ui/form-rich-text';
import { FormCheckbox } from '../ui/form-checkbox';

// Combined Schema
const registrationSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.date(),
  // Account Security
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  // Profile Details
  role: z.enum(['user', 'admin', 'editor']),
  profilePicture: z.instanceof(File).optional(),
  bio: z.string().optional(),
  // Terms
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegistrationData = z.infer<typeof registrationSchema>;

// Step 1: Personal Information
const PersonalInfoStep: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <FormInput
        name="firstName"
        label="First Name"
      />
      <FormInput
        name="lastName"
        label="Last Name"
      />
    </div>

    <FormInput
      name="email"
      label="Email"
      type="email"
    />

    <FormDatePicker
      name="dateOfBirth"
      label="Date of Birth"
      minDate={new Date(1900, 0, 1)}
      maxDate={new Date()}
    />
  </div>
);

// Step 2: Account Security
const AccountSecurityStep: React.FC = () => (
  <div className="space-y-6">
    <FormInput
      name="password"
      label="Password"
      type="password"
    />

    <FormInput
      name="confirmPassword"
      label="Confirm Password"
      type="password"
    />
  </div>
);

// Step 3: Profile Details
const ProfileDetailsStep: React.FC = () => (
  <div className="space-y-6">
    <FormSelect
      name="role"
      label="Role"
      options={[
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' }
      ]}
    />

    <FormFileUpload
      name="profilePicture"
      label="Profile Picture"
      accept="image/*"
      maxSize={5 * 1024 * 1024} // 5MB
    />

    <FormRichText
      name="bio"
      label="Bio"
      placeholder="Tell us about yourself..."
    />
  </div>
);

// Step 4: Terms and Conditions
const TermsStep: React.FC = () => (
  <div className="space-y-6">
    <FormCheckbox
      name="terms"
      label="I accept the terms and conditions"
    />
  </div>
);

const initialValues: RegistrationData = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: new Date(),
  password: '',
  confirmPassword: '',
  role: 'user',
  terms: false
};

export const RegistrationWizard = () => {
  const handleComplete = async (values: RegistrationData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Registration completed:', values);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold">Registration Wizard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Complete the registration process by following these steps.
        </p>
      </div>

      <FormWizard
        steps={[
          {
            id: 'personal-info',
            title: 'Personal Info',
            description: 'Basic information',
            schema: registrationSchema,
            component: PersonalInfoStep
          },
          {
            id: 'account-security',
            title: 'Security',
            description: 'Account security',
            schema: registrationSchema,
            component: AccountSecurityStep
          },
          {
            id: 'profile-details',
            title: 'Profile',
            description: 'Profile details',
            schema: registrationSchema,
            component: ProfileDetailsStep
          },
          {
            id: 'terms',
            title: 'Terms',
            description: 'Terms and conditions',
            schema: registrationSchema,
            component: TermsStep
          }
        ]}
        initialValues={initialValues}
        onComplete={handleComplete}
        persistKey="registration-wizard"
        confirmSubmit={{
          title: 'Submit Registration',
          message: 'Are you sure you want to submit your registration? Please review your information before proceeding.'
        }}
      />
    </div>
  );
}; 