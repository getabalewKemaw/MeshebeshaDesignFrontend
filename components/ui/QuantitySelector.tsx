"use client";

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    max?: number;
    min?: number;
    disabled?: boolean;
}

export default function QuantitySelector({
    quantity,
    onQuantityChange,
    max,
    min = 1,
    disabled = false,
}: QuantitySelectorProps) {
    const handleChange = (value: number) => {
        if (Number.isNaN(value)) return;
        let clamped = Math.max(min, value);
        if (max !== undefined) {
            clamped = Math.min(max, clamped);
        }
        onQuantityChange(clamped);
    };

    return (
        <div className="inline-flex items-center gap-0">
            {/* Decrease Button - Square, No Border, No Background */}
            <button
                type="button"
                onClick={() => handleChange(quantity - 1)}
                className="w-10 h-10 flex items-center justify-center text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                disabled={disabled || quantity <= min}
                aria-label="Decrease quantity"
            >
                −
            </button>

            {/* Quantity Input - Square */}
            <input
                type="number"
                min={min}
                max={max}
                value={quantity}
                onChange={(e) => handleChange(Number(e.target.value))}
                disabled={disabled}
                className="w-16 h-10 text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                aria-label="Quantity"
            />

            {/* Increase Button - Square, No Border, No Background */}
            <button
                type="button"
                onClick={() => handleChange(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                disabled={disabled || (max !== undefined && quantity >= max)}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
}
