import React, { useEffect } from 'react';
import { CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useFormWizard } from '@/hooks/useFormWizard';
import { z } from 'zod';
import { FormValidation } from './form-validation';
import { ConfirmationDialog } from './confirmation-dialog';

export interface FormWizardProps<T> {
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
  }[];
  initialValues: T;
  onStepChange?: (step: number, values: T) => void;
  onComplete?: (values: T) => void;
  persistKey?: string;
  confirmSubmit?: {
    title: string;
    message: string;
  };
  transition?: {
    enter?: string;
    leave?: string;
  };
}

export function FormWizard<T>({
  steps,
  initialValues,
  onStepChange,
  onComplete,
  persistKey,
  confirmSubmit
}: FormWizardProps<T>) {
  const {
    currentStep,
    values,
    errors,
    isSubmitting,
    submitError,
    isComplete,
    navigationDirection,
    totalSteps,
    visibleSteps,
    progress,
    canGoNext,
    canGoPrevious,
    nextStep,
    previousStep,
    goToStep,
    updateValues,
    handleComplete,
    reset,
    validateStep
  } = useFormWizard({
    steps,
    initialValues,
    onStepChange,
    onComplete,
    persistKey
  });

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault();
        if (canGoNext) {
          nextStep();
        } else if (currentStep === totalSteps - 1) {
          if (confirmSubmit) {
            setShowConfirmDialog(true);
          } else {
            handleComplete();
          }
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (canGoPrevious) {
          previousStep();
        }
      } else if (event.key >= '1' && event.key <= '9') {
        const stepIndex = parseInt(event.key, 10) - 1;
        if (stepIndex >= 0 && stepIndex < totalSteps) {
          goToStep(stepIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, canGoNext, canGoPrevious, nextStep, previousStep, goToStep, handleComplete, confirmSubmit]);

  // Handle step transitions
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const CurrentStepComponent = steps[currentStep].component;
  const currentStepConfig = steps[currentStep];

  const handleSubmit = () => {
    if (confirmSubmit) {
      setShowConfirmDialog(true);
    } else {
      handleComplete();
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-12">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Form completed successfully!</h3>
        <div className="mt-6">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => {
            const isVisible = visibleSteps.some(s => s.id === step.id);
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;
            const isClickable = isVisible && (isCompleted || isCurrent);

            return (
              <button
                key={step.id}
                onClick={() => isClickable && goToStep(index)}
                className={`flex flex-col items-center ${
                  !isVisible ? 'opacity-50' : ''
                } ${
                  isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 
                  isCompleted ? 'text-green-600 dark:text-green-400' :
                  'text-gray-500 dark:text-gray-400'
                }`}
                disabled={!isClickable || isSubmitting}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCurrent
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900'
                      : isCompleted
                      ? 'border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step */}
      <div
        className={`relative ${
          isTransitioning
            ? navigationDirection === 'next'
              ? currentStepConfig.transition?.enter || 'translate-x-full opacity-0'
              : currentStepConfig.transition?.leave || '-translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
        } transition-all duration-300`}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{steps[currentStep].title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{steps[currentStep].description}</p>
          </div>

          <CurrentStepComponent />

          {Object.keys(errors).length > 0 && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Please fix the following errors:</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">{submitError}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-5">
        <button
          type="button"
          onClick={previousStep}
          disabled={!canGoPrevious || isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-3">
          {canGoNext ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmSubmit && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={() => {
            setShowConfirmDialog(false);
            handleComplete();
          }}
          title={confirmSubmit.title}
          message={confirmSubmit.message}
        />
      )}
    </div>
  );
} 