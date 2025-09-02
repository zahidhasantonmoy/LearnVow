// Input component with modern styling and additional props
'use client';

import { ReactNode } from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
  name?: string;
  children?: ReactNode;
  step?: string;
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  name,
  children,
  step
}: InputProps) {
  const inputProps = {
    placeholder,
    value,
    onChange,
    required,
    className: `w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`,
    name,
    step
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          {...inputProps as any}
          rows={4}
        />
      ) : type === 'select' ? (
        <select
          {...inputProps as any}
          className={`${inputProps.className} appearance-none`}
        >
          {children}
        </select>
      ) : (
        <input
          {...inputProps as any}
          type={type}
        />
      )}
    </div>
  );
}