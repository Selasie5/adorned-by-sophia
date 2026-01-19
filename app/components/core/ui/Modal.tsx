"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = "",
}: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full bg-black/50 px-4 py-6 sudo">
      <div
        className={`bg-white w-full ${sizeClasses[size]} rounded-lg shadow-xl flex flex-col max-h-[90vh] ${className}`}
      >
      
        <div className="flex items-start justify-between w-full px-5 py-3 border-b border-gray-200">
          <div className="flex flex-col justify-center items-start">
            <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
            {description && (
              <p className="text-gray-500 text-sm mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

       
        <div className="shrink-0 flex items-center justify-between w-full px-5 py-3 border-t border-gray-200">
          <Button
            label="Close"
            onClick={onClose}
            secondary
            type="button"
          />
          <div className="flex items-center gap-2">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
