import React, { useState } from 'react';
import { Form } from '../ui/form';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import { FormCheckbox } from '../ui/form-checkbox';
import { FormDatePicker } from '../ui/form-date-picker';
import { FormFileUpload } from '../ui/form-file-upload';
import { FormRichText } from '../ui/form-rich-text';
import { FormPersistenceStatus } from '../ui/form-persistence-status';
import { z } from 'zod';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin', 'editor']),
  dateOfBirth: z.date(),
  profilePicture: z.instanceof(File).optional(),
  documents: z.array(z.instanceof(File)).optional(),
  bio: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const initialValues: RegistrationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  dateOfBirth: new Date(),
  terms: false
};

export const RegistrationForm = () => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleAutoSave = async (values: RegistrationFormData) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastSaved(new Date());
    } catch (error) {
      setSaveError('Failed to save form data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyticsEvent = (event: any) => {
    console.log('Analytics Event:', event);
  };

  const handleAnalyticsComplete = (data: any) => {
    console.log('Analytics Complete:', data);
    setAnalyticsData(data);
  };

  const handleExport = (data: RegistrationFormData) => {
    console.log('Exporting data:', data);
    setExportError(null);
  };

  const handleImport = (data: RegistrationFormData) => {
    console.log('Importing data:', data);
    setImportError(null);
  };

  const handleExportError = (error: Error) => {
    console.error('Export error:', error);
    setExportError(error.message);
  };

  const handleImportError = (error: Error) => {
    console.error('Import error:', error);
    setImportError(error.message);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Registration Form</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please fill out the form below to create your account.
        </p>
      </div>

      {(exportError || importError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          {exportError && (
            <p className="text-sm text-red-600">Export error: {exportError}</p>
          )}
          {importError && (
            <p className="text-sm text-red-600">Import error: {importError}</p>
          )}
        </div>
      )}

      <Form
        schema={registrationSchema}
        initialValues={initialValues}
        onSubmit={async (values) => {
          console.log('Form submitted:', values);
        }}
        formId="registration-form"
        autoSave
        autoSaveInterval={3000}
        onAutoSave={handleAutoSave}
        showAnalytics
        onAnalyticsEvent={handleAnalyticsEvent}
        onAnalyticsComplete={handleAnalyticsComplete}
        showExportImport
        onExport={handleExport}
        onImport={handleImport}
        onExportError={handleExportError}
        onImportError={handleImportError}
      >
        {(formikProps) => (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
              />
              <FormInput
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
              />
            </div>

            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            <FormSelect
              name="role"
              label="Role"
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' }
              ]}
            />

            <FormDatePicker
              name="dateOfBirth"
              label="Date of Birth"
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date()}
            />

            <FormFileUpload
              name="profilePicture"
              label="Profile Picture"
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
            />

            <FormFileUpload
              name="documents"
              label="Supporting Documents"
              accept=".pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024} // 10MB
              multiple
            />

            <FormRichText
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself..."
            />

            <FormCheckbox
              name="terms"
              label="I accept the terms and conditions"
            />

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={formikProps.isSubmitting}
              >
                {formikProps.isSubmitting ? 'Submitting...' : 'Register'}
              </button>

              <FormPersistenceStatus
                lastSaved={lastSaved}
                isSaving={isSaving}
                error={saveError}
              />
            </div>
          </>
        )}
      </Form>
    </div>
  );
}; 