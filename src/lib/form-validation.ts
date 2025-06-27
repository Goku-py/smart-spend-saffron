import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .startsWith('https://', 'URL must start with https://');

// Form validation utilities
export const validateForm = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  data: T
): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { _form: 'An unexpected error occurred' } };
  }
};

// Field validation utilities
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  value: T
): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'An unexpected error occurred' };
  }
};

// Debounced validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }

  // Complexity check
  if (password.length >= 12) {
    score += 1;
  }

  return {
    score,
    feedback: feedback.length > 0 ? feedback : ['Strong password']
  };
};

// Form field transformers
export const transformers = {
  trim: (value: string) => value.trim(),
  toLowerCase: (value: string) => value.toLowerCase(),
  toUpperCase: (value: string) => value.toUpperCase(),
  removeSpaces: (value: string) => value.replace(/\s+/g, ''),
  formatPhone: (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }
};

// Form field validators
export const validators = {
  required: (value: any) => {
    if (value === undefined || value === null || value === '') {
      return 'This field is required';
    }
    return undefined;
  },
  minLength: (min: number) => (value: string) => {
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return undefined;
  },
  maxLength: (max: number) => (value: string) => {
    if (value.length > max) {
      return `Must not exceed ${max} characters`;
    }
    return undefined;
  },
  pattern: (regex: RegExp, message: string) => (value: string) => {
    if (!regex.test(value)) {
      return message;
    }
    return undefined;
  },
  email: (value: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  },
  password: (value: string) => {
    const { score, feedback } = checkPasswordStrength(value);
    if (score < 3) {
      return feedback[0];
    }
    return undefined;
  },
  match: (field: string, message: string) => (value: string, formValues: Record<string, any>) => {
    if (value !== formValues[field]) {
      return message;
    }
    return undefined;
  }
}; 