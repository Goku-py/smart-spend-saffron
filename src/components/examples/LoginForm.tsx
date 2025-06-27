
import React from 'react';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
      schema={loginSchema}
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className="pl-10"
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 -translate-y-1/2" />
              <Input
                id="password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className="pl-10"
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            {errors.password && touched.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <Button
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
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}; 
