import { useEffect, useState } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isDirty: boolean;
}

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validation?: (values: T) => Partial<Record<keyof T, string>>;
  onSuccess?: () => void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isDirty: boolean;
  isLoading: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  validate: () => boolean;
}

export function useForm<T extends Record<string, string | number | boolean>>({
  initialValues,
  onSubmit,
  validation,
  onSuccess,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isDirty: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [key]: value },
      isDirty: true,
    }));
  };

  const setValues = (newValues: Partial<T>) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, ...newValues },
      isDirty: true,
    }));
  };

  const reset = () => {
    setState({
      values: initialValues,
      errors: {},
      isDirty: false,
    });
  };

  const validate = (): boolean => {
    if (!validation) return true;

    const errors = validation(state.values);
    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(state.values);
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when initialValues change
  useEffect(() => {
    reset();
  }, [JSON.stringify(initialValues)]);

  return {
    values: state.values,
    errors: state.errors,
    isDirty: state.isDirty,
    isLoading,
    setValue,
    setValues,
    reset,
    handleSubmit,
    validate,
  };
}
