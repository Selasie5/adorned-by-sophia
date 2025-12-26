
// import React from "react";

interface ButtonProps {
  label: string;
  type?: "submit" | "reset" | "button" | undefined;
  onClick: () => void;
  primary?: boolean;
  secondary?: boolean;
  suspend?: boolean;
  disabled?: boolean;
}
const Button = ({
  label,
  onClick,
  primary,
  secondary,
  suspend,
  disabled,
  type,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`py-2 px-4 rounded-[5px] text-sm cursor-pointer ${primary ? "bg-red-500 font-normal text-white" : ""} ${suspend ? "bg-red-500 font-normal text-white" : ""} ${secondary ? "border border-gray-300 text-gray-600 text-sm" : ""} ${disabled ? "bg-gray-300 border-gray-400 text-gray-700 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
