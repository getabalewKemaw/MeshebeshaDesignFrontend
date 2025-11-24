"use client";

import { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

type FormFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  inputClassName?: string;
  canTogglePassword?: boolean;
};

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  icon: Icon,
  error,
  helperText,
  autoComplete,
  required,
  disabled,
  maxLength,
  inputMode,
  className = "",
  inputClassName = "",
  canTogglePassword = false,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const resolvedType = canTogglePassword && isPasswordField ? (showPassword ? "text" : "password") : type;

  const baseInputClasses = "form-input-base left-10";

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        )}
        <input
          id={name}
          name={name}
          type={resolvedType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          className={`${baseInputClasses} ${Icon ? "pl-13" : "pl-10"} ${
            canTogglePassword && isPasswordField ? "pr-12" : "pr-4"
          } ${error ? "form-input-error" : ""} ${inputClassName}`}
        />
        {canTogglePassword && isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {helperText && !error && <p className="form-helper-text">{helperText}</p>}
      {error && <p className="form-error-text">{error}</p>}
    </div>
  );
}


