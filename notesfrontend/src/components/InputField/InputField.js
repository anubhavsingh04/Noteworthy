import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className = "",
  min,
  value,
  autoFocus,
  placeholder,
  readOnly,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          id={id}
          placeholder={placeholder}
          autoFocus={autoFocus}
          readOnly={readOnly}
          className={`
            w-full px-4 py-3 rounded-xl 
            bg-slate-800/50 border 
            ${errors[id]?.message ? "border-red-500/50" : "border-white/10"} 
            text-slate-300 placeholder:text-slate-500 
            focus:outline-none focus:ring-2 
            ${errors[id]?.message ? "focus:ring-red-500" : "focus:ring-blue-500"} 
            focus:border-transparent transition-all
            ${readOnly ? "opacity-70 cursor-not-allowed" : ""}
            ${isPasswordField ? "pr-12" : ""}
          `}
          {...register(id, {
            required: required && { value: true, message },
            minLength: min
              ? { value: min, message: `Minimum ${min} characters required` }
              : undefined,
          })}
        />
        
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-300 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="w-4 h-4" />
            ) : (
              <FaEye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {errors[id]?.message && (
        <p className="text-sm font-medium text-red-400 mt-1">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default InputField;