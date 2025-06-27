import React from 'react';
import { z } from 'zod';
import { Form, FormInput } from '@/components/ui/form';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const initialValues: LoginFormValues = {
  email: '',
  password: ''
};

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  return (
    <Form
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting
      }) => (
        <>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            placeholder="Enter your email"
            leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
            disabled={isSubmitting || isLoading}
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            error={errors.password}
            touched={touched.password}
            placeholder="Enter your password"
            leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            disabled={isSubmitting || isLoading}
            required
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="
                w-full flex justify-center py-2 px-4
                border border-transparent rounded-md shadow-sm
                text-sm font-medium text-white
                bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting || isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </>
      )}
    </Form>
  );
}; 