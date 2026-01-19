"use client";

import React from 'react';
import Button from './button';

interface AlertProps {
  isOpen: boolean;
  heading: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

const Alert = ({
  isOpen,
  heading,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmLoading = false,
  variant = 'danger',
}: AlertProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div
      className="fixed sub inset-0 bg-black/50 flex justify-center items-center z-50"
      role="alert"
    >
      <div className="bg-white p-6 flex flex-col justify-center items-start gap-4 rounded-lg w-full max-w-md mx-4 shadow-xl">
        <h6 className="text-black font-semibold text-lg">{heading}</h6>
        <p className="text-sm text-gray-600 font-normal">{message}</p>
        <div className="flex justify-end items-center gap-3 w-full mt-2">
          <Button
            label={cancelLabel}
            secondary
            onClick={onCancel}
            type="button"
          />
          <button
            onClick={onConfirm}
            disabled={confirmLoading}
            className={`px-4 py-2 text-white text-sm font-medium rounded-md transition-colors ${variantStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {confirmLoading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
