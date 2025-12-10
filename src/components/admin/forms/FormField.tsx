import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiInfo } from 'react-icons/fi';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  hint?: string;
  options?: Array<{ value: string | number; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  success = false,
  hint,
  options = [],
  rows = 3,
  min,
  max,
  step,
  icon,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const hasError = !!error;
  const hasValue = value !== '' && value !== null && value !== undefined;

  const baseInputClasses = `
    w-full px-4 py-3 bg-[#0a0b0d] border rounded-lg text-white placeholder-gray-400 
    transition-all duration-200 focus:outline-none focus:ring-2 
    ${hasError 
      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
      : success 
        ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20'
        : 'border-[#2a2b35] focus:border-cyan-500 focus:ring-cyan-500/20'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#3a3b45]'}
    ${icon ? 'pl-12' : ''}
    ${type === 'password' ? 'pr-12' : ''}
  `;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${baseInputClasses} resize-none`}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          disabled={disabled}
          className={baseInputClasses}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#1e1f26]">
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={baseInputClasses}
      />
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={name}
        className={`block text-sm font-medium transition-colors ${
          hasError ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-300'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}

        {renderInput()}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}

        {(hasError || success) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {hasError ? (
              <FiAlertCircle className="text-red-400" size={18} />
            ) : (
              <FiCheck className="text-green-400" size={18} />
            )}
          </div>
        )}

        <AnimatePresence>
          {focused && !hasError && !success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 border-2 border-cyan-500/30 rounded-lg pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <FiAlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-2 text-green-400 text-sm"
          >
            <FiCheck size={14} />
            Field validated successfully
          </motion.div>
        )}
      </AnimatePresence>

      {hint && !hasError && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <FiInfo size={14} />
          {hint}
        </div>
      )}
    </div>
  );
};