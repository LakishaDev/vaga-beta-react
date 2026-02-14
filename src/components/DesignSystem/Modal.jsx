import { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";

/**
 * Modal Component - Design System
 *
 * Accessible modal dialog with focus trap and proper ARIA attributes
 * Built on Headless UI for maximum accessibility compliance
 *
 * Features:
 * - Focus trap - can't tab outside modal
 * - ESC to close
 * - Click outside to close (optional)
 * - Proper ARIA labeling
 * - Smooth animations
 *
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Potvrda"
 *   size="md"
 * >
 *   <p>Da li ste sigurni?</p>
 * </Modal>
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnClickOutside = true,
  footer,
  className = "",
}) => {
  const closeButtonRef = useRef(null);

  // Size variants
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl mx-4",
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-modal"
        onClose={closeOnClickOutside ? onClose : () => {}}
        initialFocus={closeButtonRef}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`
                  w-full ${sizeStyles[size]}
                  transform overflow-hidden rounded-lg
                  bg-neutral-surface shadow-2xl
                  transition-all
                  ${className}
                `
                  .trim()
                  .replace(/\s+/g, " ")}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
                    {title && (
                      <Dialog.Title className="text-xl font-semibold font-heading text-text-primary">
                        {title}
                      </Dialog.Title>
                    )}

                    {showCloseButton && (
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="
                          ml-auto p-1.5 rounded-md
                          text-text-secondary hover:text-text-primary
                          hover:bg-neutral-bg
                          focus:outline-none focus:ring-2 focus:ring-brand-secondary
                          transition-colors
                        "
                        aria-label="Zatvori"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="px-6 py-4">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="px-6 py-4 border-t border-neutral-border bg-neutral-bg/50">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.propTypes = {
  /** Modal open state */
  isOpen: PropTypes.bool.isRequired,

  /** Close handler */
  onClose: PropTypes.func.isRequired,

  /** Modal title */
  title: PropTypes.string,

  /** Modal content */
  children: PropTypes.node.isRequired,

  /** Modal size */
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),

  /** Show close button in header */
  showCloseButton: PropTypes.bool,

  /** Allow closing by clicking outside */
  closeOnClickOutside: PropTypes.bool,

  /** Footer content (usually actions) */
  footer: PropTypes.node,

  /** Additional CSS classes for panel */
  className: PropTypes.string,
};

export default Modal;
