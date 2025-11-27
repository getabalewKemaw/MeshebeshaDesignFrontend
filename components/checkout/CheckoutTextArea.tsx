"use client";

interface CheckoutTextAreaProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    helperText?: string;
    disabled?: boolean;
}

export default function CheckoutTextArea({
    label,
    id,
    value,
    onChange,
    placeholder,
    required = false,
    rows = 3,
    helperText,
    disabled = false,
}: CheckoutTextAreaProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label htmlFor={id} className="form-label">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={handleChange}
                className="form-input-base"
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
            />
            {helperText && (
                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
            )}
        </div>
    );
}
