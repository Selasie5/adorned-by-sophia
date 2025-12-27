"use client";

import React from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface SelectOption {
  id: string;
  label: string;
  value: string;
}

interface SelectInputProps {
  name: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SelectInput = ({
  name,
  placeholder = "Select...",
  options,
  value,
  onChange,
  className = "",
}: SelectInputProps) => {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none sudo ${className}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronUpDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default SelectInput;
