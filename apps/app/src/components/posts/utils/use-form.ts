"use client";

import { useState } from "react";
import type { PostFormData } from "../types";

interface FormState {
  values: PostFormData;
  errors: Partial<Record<keyof PostFormData, string>>;
  isDirty: boolean;
}

interface UseFormOptions {
  initialValues: PostFormData;
  onSubmit: (values: PostFormData) => Promise<void>;
  validation?: (values: PostFormData) => Partial<Record<keyof PostFormData, string>>;
  onSuccess?: () => void;
}

interface UseFormReturn {
  values: PostFormData;
  errors: Partial<Record<keyof PostFormData, string>>;
  isDirty: boolean;
  isLoading: boolean;
  setValue: <K extends keyof PostFormData>(key: K, value: PostFormData[K]) => void;
  setValues: (values: Partial<PostFormData>) => void;
  reset: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  validate: () => boolean;
}

export function useForm({
  initialValues,
  onSubmit,
  validation,
  onSuccess,
}: UseFormOptions): UseFormReturn {
  const [state, setState] = useState<FormState>({
    values: initialValues,
    errors: {},
    isDirty: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const setValue = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [key]: value },
      isDirty: true,
    }));
  };

  const setValues = (values: Partial<PostFormData>) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, ...values },
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
    setState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(state.values);
      onSuccess?.();
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
