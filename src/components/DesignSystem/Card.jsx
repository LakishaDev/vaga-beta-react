import PropTypes from "prop-types";

/**
 * Card Component - Design System
 *
 * Versatile card container for products, services, and content
 * Supports different variants, hover effects, and clickable behavior
 *
 * @example
 * <Card variant="elevated" hoverable clickable onClick={handleClick}>
 *   <CardHeader>
 *     <h3>Product Title</h3>
 *   </CardHeader>
 *   <CardBody>
 *     <p>Product description...</p>
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Dodaj u korpu</Button>
 *   </CardFooter>
 * </Card>
 */
const Card = ({
  children,
  variant = "default",
  hoverable = false,
  clickable = false,
  padding = "md",
  className = "",
  onClick,
  ...props
}) => {
  // Base styles
  const baseStyles = `
    bg-neutral-surface rounded-lg
    transition-all duration-base
  `
    .trim()
    .replace(/\s+/g, " ");

  // Variant styles
  const variantStyles = {
    default: "border border-neutral-border",
    elevated: "shadow-md hover:shadow-lg",
    outlined: "border-2 border-neutral-border",
    ghost: "border-0",
  };

  // Padding styles
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  // Hover styles
  const hoverStyles = hoverable ? "hover:-translate-y-1 hover:shadow-xl" : "";

  // Clickable styles
  const clickableStyles = clickable
    ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2"
    : "";

  const cardClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${hoverStyles}
    ${clickableStyles}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const Component = clickable ? "button" : "div";
  const role = clickable && !onClick ? "button" : undefined;
  const tabIndex = clickable ? 0 : undefined;

  return (
    <Component
      className={cardClassName}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      {...props}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  /** Card content */
  children: PropTypes.node.isRequired,

  /** Visual variant */
  variant: PropTypes.oneOf(["default", "elevated", "outlined", "ghost"]),

  /** Enable hover lift effect */
  hoverable: PropTypes.bool,

  /** Make card clickable (button behavior) */
  clickable: PropTypes.bool,

  /** Padding size */
  padding: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Click handler (makes card clickable) */
  onClick: PropTypes.func,
};

/**
 * CardHeader - Header section of the card
 */
export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`mb-3 ${className}`.trim()} {...props}>
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardBody - Main content section
 */
export const CardBody = ({ children, className = "", ...props }) => (
  <div className={`${className}`.trim()} {...props}>
    {children}
  </div>
);

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardFooter - Footer section with actions
 */
export const CardFooter = ({
  children,
  className = "",
  divided = false,
  ...props
}) => (
  <div
    className={`
      mt-4 
      ${divided ? "pt-4 border-t border-neutral-border" : ""} 
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ")}
    {...props}
  >
    {children}
  </div>
);

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  divided: PropTypes.bool,
};

/**
 * CardImage - Optimized image container for cards
 */
export const CardImage = ({
  src,
  alt,
  aspectRatio = "16/9",
  className = "",
  objectFit = "cover",
  ...props
}) => (
  <div
    className={`relative w-full overflow-hidden rounded-t-lg ${className}`.trim()}
    style={{ aspectRatio }}
    {...props}
  >
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-${objectFit}`}
      loading="lazy"
    />
  </div>
);

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.string,
  className: PropTypes.string,
  objectFit: PropTypes.oneOf(["cover", "contain", "fill", "none"]),
};

export default Card;
