
// import React from "react";

interface ButtonProps {
  label: string;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
  suspend?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
const Button = ({
  label,
  onClick,
  primary,
  secondary,
  suspend,
  disabled,
  type,
  loading,
  className,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`py-3 px-4 rounded-[5px] text-sm cursor-pointer ${primary ? "bg-green-500 font-normal text-white" : ""} ${suspend ? "bg-green-500 font-normal text-white" : ""} ${secondary ? "border border-gray-300 text-gray-600 text-sm" : ""} ${disabled || loading ? "bg-gray-300 border-gray-400 text-gray-700 cursor-not-allowed" : ""} ${className || ""}`}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : label}
    </button>
  );
};

export default Button;
