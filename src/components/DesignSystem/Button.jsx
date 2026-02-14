import { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * Button Component - Design System
 *
 * Professional button with WCAG AA compliant colors and states
 * Supports primary, secondary, outline, and ghost variants
 * All variants have proper focus rings, loading states, and disabled states
 *
 * @example
 * <Button variant="primary" size="md">Zakaži servis</Button>
 * <Button variant="secondary" size="lg" loading>Učitavanje...</Button>
 * <Button variant="outline" disabled>Dodaj u korpu</Button>
 */
const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = "button",
      className = "",
      onClick,
      ...props
    },
    ref,
  ) => {
    // Base styles - all buttons
    const baseStyles = `
    inline-flex items-center justify-center
    font-medium transition-all duration-base
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    ${fullWidth ? "w-full" : ""}
  `
      .trim()
      .replace(/\s+/g, " ");

    // Variant styles with WCAG AA compliant colors
    const variantStyles = {
      primary: `
      bg-brand-primary text-white
      hover:bg-brand-primary-hover active:bg-brand-primary-active
      focus:ring-brand-secondary
      disabled:hover:bg-brand-primary
    `,
      secondary: `
      bg-brand-secondary text-white
      hover:bg-brand-secondary-hover active:bg-brand-secondary-active
      focus:ring-brand-secondary
      disabled:hover:bg-brand-secondary
    `,
      outline: `
      bg-transparent text-brand-primary border-2 border-brand-primary
      hover:bg-brand-primary hover:text-white
      active:bg-brand-primary-active active:border-brand-primary-active
      focus:ring-brand-secondary
      disabled:hover:bg-transparent disabled:hover:text-brand-primary
    `,
      ghost: `
      bg-transparent text-brand-primary
      hover:bg-neutral-surface-tint active:bg-neutral-bg
      focus:ring-brand-secondary
      disabled:hover:bg-transparent
    `,
      danger: `
      bg-error-main text-white
      hover:bg-red-700 active:bg-red-800
      focus:ring-red-500
      disabled:hover:bg-error-main
    `,
    };

    // Size styles
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
      md: "px-4 py-2 text-base rounded-md gap-2",
      lg: "px-6 py-3 text-lg rounded-lg gap-2.5",
      xl: "px-8 py-4 text-xl rounded-lg gap-3",
    };

    // Loading spinner component
    const Spinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={combinedClassName}
        disabled={isDisabled}
        onClick={onClick}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && <Spinner />}
        {!loading && leftIcon && (
          <span className="inline-flex" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {!loading && rightIcon && (
          <span className="inline-flex" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

Button.propTypes = {
  /** Button content */
  children: PropTypes.node.isRequired,

  /** Visual variant */
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
  ]),

  /** Size variant */
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),

  /** Full width button */
  fullWidth: PropTypes.bool,

  /** Loading state - shows spinner and disables button */
  loading: PropTypes.bool,

  /** Disabled state */
  disabled: PropTypes.bool,

  /** Icon on the left side */
  leftIcon: PropTypes.node,

  /** Icon on the right side */
  rightIcon: PropTypes.node,

  /** Button type */
  type: PropTypes.oneOf(["button", "submit", "reset"]),

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Click handler */
  onClick: PropTypes.func,
};

export default Button;
