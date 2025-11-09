import React from "react";
interface ButtonProps {
  /** The button label or content */
  children: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional custom CSS classes */
  className?: string;
  /** Button type (default: "button") */
  type?: "button" | "submit" | "reset";
  /** Disabled state */
  disabled?: boolean;
}

/**
 * A reusable button component styled in the Uiverse.io "simple button" style.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center justify-center rounded-xl border-[1.58px] border-zinc-600 bg-zinc-950 px-5 py-3 font-medium text-slate-200 shadow-md transition-all duration-300 hover:[transform:translateY(-.335rem)] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
