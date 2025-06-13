import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';

export interface UseFormWizardOptions<T> {
  steps: {
    id: string;
    title: string;
    description: string;
    schema: z.ZodType<T>;
    component: React.ComponentType;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    transition?: {
      enter?: string;
      leave?: string;
    };
    isVisible?: (values: T) => boolean;
    dependencies?: {
      stepId: string;
      condition: (values: T) => boolean;
    }[];
    nextStep?: (values: T) => string | null;
    dynamicSchema?: (values: T) => z.ZodType<T>;
  }[];
  initialValues: T;
  onStepChange?: (step: number, values: T) => void;
  onComplete?: (values: T) => void;
  persistKey?: string;
}

export function useFormWizard<T>({
  steps,
  initialValues,
  onStepChange,
  onComplete,
  persistKey
}: UseFormWizardOptions<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<T>(() => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved form data:', e);
        }
      }
    }
    return initialValues;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState<'next' | 'prev'>('next');

  // Filter visible steps based on conditions
  const visibleSteps = useMemo(() => {
    return steps.filter(step => {
      if (step.isVisible) {
        return step.isVisible(values);
      }
      return true;
    });
  }, [steps, values]);

  // Get the actual step index in the visible steps array
  const getVisibleStepIndex = useCallback((stepIndex: number) => {
    return visibleSteps.findIndex(step => step.id === steps[stepIndex].id);
  }, [steps, visibleSteps]);

  // Get the next visible step
  const getNextVisibleStep = useCallback((currentIndex: number) => {
    const currentVisibleIndex = getVisibleStepIndex(currentIndex);
    if (currentVisibleIndex === -1) return -1;

    // Check for custom next step
    const currentStepConfig = steps[currentIndex];
    if (currentStepConfig.nextStep) {
      const nextStepId = currentStepConfig.nextStep(values);
      if (nextStepId === null) return -1;
      const nextStepIndex = steps.findIndex(s => s.id === nextStepId);
      if (nextStepIndex !== -1) {
        return nextStepIndex;
      }
    }

    for (let i = currentVisibleIndex + 1; i < visibleSteps.length; i++) {
      const step = visibleSteps[i];
      const originalIndex = steps.findIndex(s => s.id === step.id);
      if (originalIndex !== -1) {
        return originalIndex;
      }
    }
    return -1;
  }, [steps, visibleSteps, getVisibleStepIndex, values]);

  // Get the previous visible step
  const getPreviousVisibleStep = useCallback((currentIndex: number) => {
    const currentVisibleIndex = getVisibleStepIndex(currentIndex);
    if (currentVisibleIndex === -1) return -1;

    for (let i = currentVisibleIndex - 1; i >= 0; i--) {
      const step = visibleSteps[i];
      const originalIndex = steps.findIndex(s => s.id === step.id);
      if (originalIndex !== -1) {
        return originalIndex;
      }
    }
    return -1;
  }, [steps, visibleSteps, getVisibleStepIndex]);

  // Check if a step's dependencies are satisfied
  const checkDependencies = useCallback((stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step.dependencies) return true;

    return step.dependencies.every(dep => {
      const depStep = steps.find(s => s.id === dep.stepId);
      if (!depStep) return true;
      return dep.condition(values);
    });
  }, [steps, values]);

  const validateStep = useCallback(async (step: number) => {
    try {
      const stepConfig = steps[step];
      const schema = stepConfig.dynamicSchema ? stepConfig.dynamicSchema(values) : stepConfig.schema;
      await schema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [steps, values]);

  const nextStep = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    const nextStepIndex = getNextVisibleStep(currentStep);
    if (nextStepIndex !== -1) {
      setNavigationDirection('next');
      setCurrentStep(nextStepIndex);
      onStepChange?.(nextStepIndex, values);
    }
  }, [currentStep, getNextVisibleStep, validateStep, onStepChange, values]);

  const previousStep = useCallback(() => {
    const prevStepIndex = getPreviousVisibleStep(currentStep);
    if (prevStepIndex !== -1) {
      setNavigationDirection('prev');
      setCurrentStep(prevStepIndex);
      onStepChange?.(prevStepIndex, values);
    }
  }, [currentStep, getPreviousVisibleStep, onStepChange, values]);

  const goToStep = useCallback(async (step: number) => {
    if (step < 0 || step >= steps.length) return;

    // Check if the step is visible
    const visibleIndex = getVisibleStepIndex(step);
    if (visibleIndex === -1) return;

    // Check dependencies
    if (!checkDependencies(step)) return;

    // Validate all previous steps
    for (let i = 0; i < step; i++) {
      const isValid = await validateStep(i);
      if (!isValid) return;
    }

    setNavigationDirection(step > currentStep ? 'next' : 'prev');
    setCurrentStep(step);
    onStepChange?.(step, values);
  }, [currentStep, steps.length, getVisibleStepIndex, checkDependencies, validateStep, onStepChange, values]);

  const updateValues = useCallback((newValues: Partial<T>) => {
    const updatedValues = { ...values, ...newValues };
    setValues(updatedValues);

    // Save to localStorage if persistKey is provided
    if (persistKey) {
      localStorage.setItem(persistKey, JSON.stringify(updatedValues));
    }

    // Validate on change if enabled
    const currentStepConfig = steps[currentStep];
    if (currentStepConfig.validateOnChange) {
      validateStep(currentStep);
    }
  }, [values, persistKey, currentStep, steps, validateStep]);

  const handleComplete = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Validate all steps
      for (let i = 0; i < steps.length; i++) {
        const isValid = await validateStep(i);
        if (!isValid) {
          setCurrentStep(i);
          return;
        }
      }

      await onComplete?.(values);
      setIsComplete(true);

      // Clear persisted data on successful completion
      if (persistKey) {
        localStorage.removeItem(persistKey);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [steps, validateStep, onComplete, values, persistKey]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setSubmitError(null);
    setIsComplete(false);
    if (persistKey) {
      localStorage.removeItem(persistKey);
    }
  }, [initialValues, persistKey]);

  return {
    currentStep,
    values,
    errors,
    isSubmitting,
    submitError,
    isComplete,
    navigationDirection,
    totalSteps: steps.length,
    visibleSteps,
    progress: ((currentStep + 1) / steps.length) * 100,
    canGoNext: getNextVisibleStep(currentStep) !== -1,
    canGoPrevious: getPreviousVisibleStep(currentStep) !== -1,
    nextStep,
    previousStep,
    goToStep,
    updateValues,
    handleComplete,
    reset,
    validateStep
  };
} 