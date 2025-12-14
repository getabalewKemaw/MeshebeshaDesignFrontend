"use client";

import { useMemo, useRef } from "react";

type OtpInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  helperText?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function OtpInput({
  label,
  value,
  onChange,
  length = 6,
  error,
  helperText,
  autoFocus,
  disabled,
  className = "",
}: OtpInputProps) {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const digits = useMemo(() => {
    const padded = value.padEnd(length, " ");
    return padded.slice(0, length).split("").map((char) => (/\d/.test(char) ? char : ""));
  }, [value, length]);

  const handleChange = (index: number, nextValue: string) => {
    if (!/^\d?$/.test(nextValue) || disabled) return;
    const chars = value.split("");
    chars[index] = nextValue;
    const newValue = chars.join("").slice(0, length);
    onChange(newValue);

    if (nextValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <p className="text-sm font-semibold text-[#1E2A55] text-center">{label}</p>}
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(element) => {
              if (element) inputRefs.current[index] = element;
            }}
            type="text"
            value={digits[index]}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            maxLength={1}
            inputMode="numeric"
            autoFocus={autoFocus && index === 0}
            disabled={disabled}
            className={`form-otp-input ${error ? "form-otp-input-error" : ""}`}
          />
        ))}
      </div>
      {helperText && !error && <p className="form-helper-text text-center">{helperText}</p>}
      {error && <p className="form-error-text text-center">{error}</p>}
    </div>
  );
}




