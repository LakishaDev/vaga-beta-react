import PropTypes from "prop-types";

/**
 * Badge Component - Design System
 *
 * Status indicators, labels, and chips with semantic colors
 * WCAG AA compliant with proper contrast ratios
 *
 * @example
 * <Badge variant="success">Dostupno</Badge>
 * <Badge variant="info" size="sm">Novo</Badge>
 * <Badge variant="warning" dot>Na čekanju</Badge>
 */
const Badge = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  removable = false,
  onRemove,
  className = "",
  ...props
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-1.5
    font-medium rounded-full
    transition-colors duration-base
  `
    .trim()
    .replace(/\s+/g, " ");

  // Variant styles with WCAG AA compliant colors
  const variantStyles = {
    default: `
      bg-neutral-bg text-text-primary
      border border-neutral-border
    `,
    primary: `
      bg-brand-primary text-white
    `,
    secondary: `
      bg-brand-secondary text-white
    `,
    success: `
      bg-success-bg text-success-text
      border border-success-main/20
    `,
    warning: `
      bg-warning-bg text-warning-text
      border border-warning-main/20
    `,
    error: `
      bg-error-bg text-error-text
      border border-error-main/20
    `,
    info: `
      bg-info-bg text-info-text
      border border-info-main/20
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  // Dot indicator
  const DotIndicator = () => (
    <span
      className={`
        inline-block w-1.5 h-1.5 rounded-full
        ${variant === "success" ? "bg-success-main" : ""}
        ${variant === "warning" ? "bg-warning-main" : ""}
        ${variant === "error" ? "bg-error-main" : ""}
        ${variant === "info" ? "bg-info-main" : ""}
        ${variant === "primary" ? "bg-white" : ""}
        ${variant === "secondary" ? "bg-white" : ""}
        ${variant === "default" ? "bg-text-secondary" : ""}
      `
        .trim()
        .replace(/\s+/g, " ")}
      aria-hidden="true"
    />
  );

  // Remove button
  const RemoveButton = () => (
    <button
      type="button"
      onClick={onRemove}
      className="
        ml-0.5 -mr-1 p-0.5 rounded-full
        hover:bg-black/10 active:bg-black/20
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
        transition-colors
      "
      aria-label="Ukloni"
    >
      <svg
        className="w-3 h-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  const badgeClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <span className={badgeClassName} {...props}>
      {dot && <DotIndicator />}
      <span>{children}</span>
      {removable && onRemove && <RemoveButton />}
    </span>
  );
};

Badge.propTypes = {
  /** Badge content */
  children: PropTypes.node.isRequired,

  /** Color variant */
  variant: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
  ]),

  /** Size variant */
  size: PropTypes.oneOf(["sm", "md", "lg"]),

  /** Show status dot indicator */
  dot: PropTypes.bool,

  /** Show remove button */
  removable: PropTypes.bool,

  /** Remove handler (required if removable) */
  onRemove: PropTypes.func,

  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Badge;
