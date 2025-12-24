/* Form management and validation helpers */

export interface FormState<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isDirty: boolean
}

export interface FormConfig<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void>
  validate?: (values: T) => Record<string, string>
}

export function useFormState<T>(
  initialValues: T
): FormState<T> & {
  setValue: (name: keyof T, value: any) => void
  setError: (name: keyof T, error: string) => void
  resetForm: () => void
} {
  // Stub for demonstration
  return {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isDirty: false,
    setValue: () => {},
    setError: () => {},
    resetForm: () => {},
  }
}

export function getFieldProps(name: string, formState: FormState<any>) {
  return {
    name,
    value: formState.values[name] ?? '',
    onChange: (e: any) => {
      const value = e.target.value
      // Update form state
    },
    onBlur: () => {
      // Mark as touched
    },
    error: formState.errors[name],
    touched: formState.touched[name],
  }
}
