"use client";

import type React from "react";

interface ColorSelectProps {
  label?: string;
  colors: string[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ColorSelect({
  label = "Color",
  colors,
  value,
  onChange,
  disabled = false,
}: ColorSelectProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  const selectedValue = value ?? colors[0];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    if (!next) return;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:opacity-50"
      >
        {colors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>
    </div>
  );
}
