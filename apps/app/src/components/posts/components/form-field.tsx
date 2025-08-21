"use client";

import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "textarea";
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  className?: string;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  type = "text",
  placeholder,
  maxLength,
  minLength,
  className = "",
}: FormFieldProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(e.target.value);
  };

  const InputComponent = type === "textarea" ? Textarea : Input;
  const inputProps = {
    id,
    value,
    onChange: handleChange,
    placeholder,
    disabled,
    className: error ? "border-destructive" : "",
    ...(maxLength && { maxLength }),
    ...(minLength && { minLength }),
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && "*"}
      </Label>
      <InputComponent {...inputProps} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {maxLength && (
        <div className="text-xs text-muted-foreground">
          {value.length}/{maxLength} caracteres
        </div>
      )}
    </div>
  );
}
