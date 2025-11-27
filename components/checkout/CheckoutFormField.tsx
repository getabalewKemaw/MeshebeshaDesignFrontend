"use client";

import { useState } from "react";
import { validateField } from "@/utils/validation/checkoutValidation";
import type { ValidationError } from "@/utils/validation/checkoutValidation";

interface CheckoutFormFieldProps {
    label: string;
    id: string;
    type?: "text" | "email" | "tel" | "date";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    validationErrors?: ValidationError[];
    onErrorClear?: (field: string) => void;
    fieldType?: "email" | "phone" | "text" | "required";
    helperText?: string;
    disabled?: boolean;
    min?: string;
}

export default function CheckoutFormField({
    label,
    id,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    validationErrors = [],
    onErrorClear,
    fieldType = "text",
    helperText,
    disabled = false,
    min,
}: CheckoutFormFieldProps) {
    const [touched, setTouched] = useState(false);
    const [liveError, setLiveError] = useState<string | null>(null);

    // Get server-side validation error
    const serverError = validationErrors.find((err) => err.field === id)?.message || null;

    const handleBlur = () => {
        setTouched(true);
        const error = validateField(id, value, fieldType);
        setLiveError(error);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Clear server error when user starts typing
        if (serverError && onErrorClear) {
            onErrorClear(id);
        }

        // Validate immediately if field has been touched
        if (touched) {
            const error = validateField(id, newValue, fieldType);
            setLiveError(error);
        }
    };

    // Display server error first, then live error
    const displayError = serverError || liveError;
    const hasError = !!displayError;

    return (
        <div>
            <label htmlFor={id} className="form-label">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input-base ${hasError ? "form-input-error" : ""}`}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                min={min}
            />
            {helperText && !hasError && (
                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
            )}
            {hasError && (
                <p className="form-error-text">{displayError}</p>
            )}
        </div>
    );
}
