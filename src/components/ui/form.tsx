import React, { useEffect } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';
import Loading from './loading';
import { useFormAnalytics } from '@/hooks/useFormAnalytics';
import { FormAnalytics } from './form-analytics';
import { useFormDataExport } from '@/hooks/useFormDataExport';
import { FormDataExport } from './form-data-export';

interface FormProps<T extends z.ZodType<any, any>> {
  schema: T;
  initialValues: z.infer<T>;
  onSubmit: (values: z.infer<T>, helpers: FormikHelpers<z.infer<T>>) => void | Promise<void>;
  formId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  onAutoSave?: (values: z.infer<T>) => void | Promise<void>;
  showAnalytics?: boolean;
  onAnalyticsEvent?: (event: any) => void;
  onAnalyticsComplete?: (data: any) => void;
  showExportImport?: boolean;
  onExport?: (data: z.infer<T>) => void;
  onImport?: (data: z.infer<T>) => void;
  onExportError?: (error: Error) => void;
  onImportError?: (error: Error) => void;
  children: (props: FormikProps<z.infer<T>>) => React.ReactNode;
}

export const Form = <T extends z.ZodType<any, any>>({
  schema,
  initialValues,
  onSubmit,
  formId = 'form',
  autoSave,
  autoSaveInterval = 3000,
  onAutoSave,
  showAnalytics,
  onAnalyticsEvent,
  onAnalyticsComplete,
  showExportImport,
  onExport,
  onImport,
  onExportError,
  onImportError,
  children
}: FormProps<T>) => {
  const { trackEvent, getAnalytics } = useFormAnalytics({
    formId,
    validationSchema: schema,
    onEvent: onAnalyticsEvent,
    onComplete: onAnalyticsComplete
  });

  const { exportData, importData } = useFormDataExport({
    formId,
    schema,
    onExport,
    onImport,
    onError: (error) => {
      if (error.message.includes('export')) {
        onExportError?.(error);
      } else {
        onImportError?.(error);
      }
    }
  });

  const handleSubmit = async (
    values: z.infer<T>,
    helpers: FormikHelpers<z.infer<T>>
  ) => {
    trackEvent({ type: 'submit' });
    await onSubmit(values, helpers);
    trackEvent({ type: 'complete' });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(schema)}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        useEffect(() => {
          if (!autoSave || !onAutoSave) return;

          const interval = setInterval(() => {
            onAutoSave(formikProps.values);
          }, autoSaveInterval);

          return () => clearInterval(interval);
        }, [autoSave, autoSaveInterval, onAutoSave, formikProps.values]);

        return (
          <div className="space-y-6">
            <form
              id={formId}
              onSubmit={formikProps.handleSubmit}
              className="space-y-6"
            >
              {children(formikProps)}
            </form>

            {showExportImport && (
              <FormDataExport
                onExport={() => exportData(formikProps.values)}
                onImport={async (file) => {
                  try {
                    const data = await importData(file);
                    formikProps.setValues(data);
                  } catch (error) {
                    // Error is already handled by useFormDataExport
                  }
                }}
                className="mt-4"
              />
            )}

            {showAnalytics && (
              <FormAnalytics
                data={getAnalytics()}
                className="mt-8"
              />
            )}
          </div>
        );
      }}
    </Formik>
  );
}; 