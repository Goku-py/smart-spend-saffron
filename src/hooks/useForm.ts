import { useState, useCallback, useRef } from 'react';
import { z } from 'zod';
import { validateForm, validateField, debounce } from '@/lib/form-validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodObject<any>;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceTime?: number;
}

interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface FormHelpers<T> {
  handleChange: (name: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (name: keyof T) => (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, touched: boolean) => void;
  resetForm: () => void;
  validateForm: () => Promise<boolean>;
  validateField: (name: keyof T) => Promise<boolean>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  debounceTime = 300
}: UseFormOptions<T>): [FormState<T>, FormHelpers<T>] => {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
    isDirty: false
  });

  const initialValuesRef = useRef(initialValues);

  const validateFormValues = useCallback(async (values: T): Promise<boolean> => {
    if (!validationSchema) return true;

    const { isValid, errors } = validateForm(validationSchema, values);
    setState(prev => ({ ...prev, errors, isValid }));
    return isValid;
  }, [validationSchema]);

  const validateFieldValue = useCallback(async (name: keyof T, value: any): Promise<boolean> => {
    if (!validationSchema) return true;

    const fieldSchema = validationSchema.shape[name as string];
    if (!fieldSchema) return true;

    const { isValid, error } = validateField(fieldSchema, value);
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error || ''
      }
    }));
    return isValid;
  }, [validationSchema]);

  const debouncedValidateField = useCallback(
    debounce((name: keyof T, value: any) => {
      validateFieldValue(name, value);
    }, debounceTime),
    [validateFieldValue, debounceTime]
  );

  const handleChange = useCallback((name: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      isDirty: true
    }));

    if (validateOnChange) {
      debouncedValidateField(name, value);
    }
  }, [validateOnChange, debouncedValidateField]);

  const handleBlur = useCallback((name: keyof T) => (event: React.FocusEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true }
    }));

    if (validateOnBlur) {
      validateFieldValue(name, state.values[name]);
    }
  }, [validateOnBlur, validateFieldValue, state.values]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const isValid = await validateFormValues(state.values);
      if (isValid) {
        await onSubmit(state.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          _form: 'An unexpected error occurred'
        }
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.values, validateFormValues, onSubmit]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      isDirty: true
    }));

    if (validateOnChange) {
      debouncedValidateField(name, value);
    }
  }, [validateOnChange, debouncedValidateField]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error }
    }));
  }, []);

  const setFieldTouched = useCallback((name: keyof T, touched: boolean) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched }
    }));
  }, []);

  const resetForm = useCallback(() => {
    setState({
      values: initialValuesRef.current,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
      isDirty: false
    });
  }, []);

  return [
    state,
    {
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      resetForm,
      validateForm: () => validateFormValues(state.values),
      validateField: (name: keyof T) => validateFieldValue(name, state.values[name])
    }
  ];
}; 