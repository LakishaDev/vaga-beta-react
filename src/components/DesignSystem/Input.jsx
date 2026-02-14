import { forwardRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * Input Component - Design System
 *
 * Accessible input field with floating label, error states, and validation
 * WCAG AA compliant with proper focus states and error messaging
 *
 * @example
 * <Input
 *   id="email"
 *   label="Email adresa"
 *   type="email"
 *   required
 *   error="Unesite validnu email adresu"
 * />
 */
const Input = forwardRef(
  (
    {
      id,
      name,
      type = "text",
      label,
      placeholder,
      value,
      defaultValue,
      error,
      helperText,
      required = false,
      disabled = false,
      readOnly = false,
      leftIcon,
      rightIcon,
      className = "",
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value || !!defaultValue);

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    const isFloating =
      isFocused || hasValue || type === "date" || type === "time";
    const hasError = !!error;

    // Container styles
    const containerClass = `relative ${className}`;

    // Input base styles
    const inputBaseStyles = `
    w-full px-4 py-3 text-base
    bg-neutral-surface border-2 rounded-md
    transition-all duration-base
    placeholder:text-transparent
    disabled:bg-neutral-bg disabled:cursor-not-allowed
    read-only:bg-neutral-bg read-only:cursor-default
    ${leftIcon ? "pl-11" : ""}
    ${rightIcon ? "pr-11" : ""}
  `
      .trim()
      .replace(/\s+/g, " ");

    // Border and focus styles
    const borderStyles = hasError
      ? "border-error-main focus:border-error-main focus:ring-2 focus:ring-error-main/20"
      : "border-neutral-border focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20";

    const inputClassName = `${inputBaseStyles} ${borderStyles}`.trim();

    // Label styles
    const labelBaseStyles = `
    absolute left-4 transition-all duration-base
    pointer-events-none select-none
    ${leftIcon ? "left-11" : "left-4"}
  `
      .trim()
      .replace(/\s+/g, " ");

    const labelFloatingStyles = isFloating
      ? "top-0 -translate-y-1/2 text-xs bg-neutral-surface px-2 -ml-2"
      : "top-1/2 -translate-y-1/2 text-base";

    const labelColorStyles = hasError
      ? "text-error-main"
      : isFocused
        ? "text-brand-secondary"
        : "text-text-secondary";

    const labelClassName =
      `${labelBaseStyles} ${labelFloatingStyles} ${labelColorStyles}`.trim();

    // Icon container styles
    const iconStyles = `
    absolute top-1/2 -translate-y-1/2
    flex items-center justify-center
    text-text-secondary
    pointer-events-none
  `
      .trim()
      .replace(/\s+/g, " ");

    const errorId = error ? `${id}-error` : undefined;
    const helperId = helperText ? `${id}-helper` : undefined;

    const describedBy =
      [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={containerClass}>
        {/* Input Field */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={`${iconStyles} left-4`} aria-hidden="true">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            name={name || id}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder || " "}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            className={inputClassName}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={required}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label htmlFor={id} className={labelClassName}>
              {label}
              {required && (
                <span className="ml-1" aria-label="obavezno polje">
                  *
                </span>
              )}
            </label>
          )}

          {/* Right Icon */}
          {rightIcon && (
            <div className={`${iconStyles} right-4`} aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-error-main flex items-start gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {/* Helper Text */}
        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

Input.propTypes = {
  /** Unique ID for the input (required for accessibility) */
  id: PropTypes.string.isRequired,

  /** Input name attribute, defaults to id if not provided */
  name: PropTypes.string,

  /** Input type */
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "tel",
    "url",
    "search",
    "number",
    "date",
    "time",
    "datetime-local",
    "month",
    "week",
  ]),

  /** Floating label text */
  label: PropTypes.string,

  /** Placeholder text */
  placeholder: PropTypes.string,

  /** Controlled value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Default value for uncontrolled input */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Error message - displays below input */
  error: PropTypes.string,

  /** Helper text - displays below input when no error */
  helperText: PropTypes.string,

  /** Required field */
  required: PropTypes.bool,

  /** Disabled state */
  disabled: PropTypes.bool,

  /** Read-only state */
  readOnly: PropTypes.bool,

  /** Icon on the left */
  leftIcon: PropTypes.node,

  /** Icon on the right */
  rightIcon: PropTypes.node,

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Change handler */
  onChange: PropTypes.func,

  /** Blur handler */
  onBlur: PropTypes.func,

  /** Focus handler */
  onFocus: PropTypes.func,
};

export default Input;
