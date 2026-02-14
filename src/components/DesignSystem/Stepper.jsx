import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Stepper Component - Design System
 *
 * Multi-step wizard/stepper with accessible navigation
 * Perfect for booking flows, checkout, and multi-step forms
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Enter)
 * - ARIA attributes for screen readers
 * - Visual progress indication
 * - Validation support per step
 *
 * @example
 * <Stepper
 *   steps={[
 *     { id: 1, label: 'Izbor usluge', component: Step1 },
 *     { id: 2, label: 'Detalji', component: Step2 },
 *     { id: 3, label: 'Potvrda', component: Step3 },
 *   ]}
 *   currentStep={currentStep}
 *   onStepChange={setCurrentStep}
 *   onComplete={handleSubmit}
 * />
 */
const Stepper = ({
  steps,
  currentStep: externalCurrentStep,
  activeStep,
  onStepChange,
  onComplete,
  showStepNumbers = true,
  allowStepClick = false,
  className = "",
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);

  // Use external or internal state
  const currentStep = externalCurrentStep || activeStep || internalCurrentStep;
  const setCurrentStep = onStepChange || setInternalCurrentStep;

  const currentStepIndex = currentStep - 1;
  const currentStepData = steps[currentStepIndex];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  // Handle step navigation
  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
    }
  };

  const nextStep = () => {
    if (!isLastStep) {
      goToStep(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      goToStep(currentStep - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if no input is focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`w-full ${className}`.trim()}>
      {/* Step Indicator */}
      <nav aria-label="Koraci postupka" className="mb-8">
        <ol className="flex items-center justify-between" role="list">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const isClickable = allowStepClick && (isCompleted || isActive);

            return (
              <li
                key={step.id}
                className="flex-1 relative"
                aria-current={isActive ? "step" : undefined}
              >
                {/* Connector Line (not for last item) */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      absolute top-4 left-1/2 w-full h-0.5
                      transition-colors duration-base
                      ${isCompleted ? "bg-brand-primary" : "bg-neutral-border"}
                    `}
                    aria-hidden="true"
                  />
                )}

                {/* Step Button/Indicator */}
                <button
                  type="button"
                  onClick={() => isClickable && goToStep(stepNumber)}
                  disabled={!isClickable}
                  className={`
                    relative z-10 flex flex-col items-center w-full
                    transition-all duration-base
                    ${isClickable ? "cursor-pointer" : "cursor-default"}
                    focus:outline-none
                  `}
                  aria-label={`Korak ${stepNumber}: ${step.label}`}
                >
                  {/* Circle */}
                  <div
                    className={`
                      w-8 h-8 rounded-full
                      flex items-center justify-center
                      font-semibold text-sm
                      transition-all duration-base
                      ${
                        isActive
                          ? "bg-brand-primary text-white ring-4 ring-brand-primary/20"
                          : isCompleted
                            ? "bg-brand-primary text-white"
                            : "bg-neutral-bg text-text-secondary border-2 border-neutral-border"
                      }
                      ${isClickable && !isActive ? "hover:ring-4 hover:ring-brand-primary/10" : ""}
                    `
                      .trim()
                      .replace(/\s+/g, " ")}
                  >
                    {isCompleted && !showStepNumbers ? (
                      // Checkmark for completed steps
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      mt-2 text-xs sm:text-sm font-medium text-center
                      transition-colors duration-base
                      ${
                        isActive
                          ? "text-brand-primary"
                          : isCompleted
                            ? "text-text-primary"
                            : "text-text-secondary"
                      }
                    `
                      .trim()
                      .replace(/\s+/g, " ")}
                  >
                    {step.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStepData?.component && (
          <div
            role="tabpanel"
            aria-labelledby={`step-${currentStep}-heading`}
            className="animate-fadeIn"
          >
            {typeof currentStepData.component === "function"
              ? currentStepData.component({
                  nextStep,
                  prevStep,
                  goToStep,
                  currentStep,
                  isFirstStep,
                  isLastStep,
                })
              : currentStepData.component}
          </div>
        )}
      </div>

      {/* Navigation Buttons (optional helper) */}
      {currentStepData?.hideControls !== true && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-border">
          <button
            type="button"
            onClick={prevStep}
            disabled={isFirstStep}
            className={`
              px-4 py-2 text-sm font-medium rounded-md
              transition-colors duration-base
              ${
                isFirstStep
                  ? "text-text-tertiary cursor-not-allowed"
                  : "text-text-primary hover:bg-neutral-bg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              }
            `
              .trim()
              .replace(/\s+/g, " ")}
            aria-label="Prethodni korak"
          >
            ← Nazad
          </button>

          <div className="text-sm text-text-secondary">
            Korak {currentStep} od {steps.length}
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="
              px-6 py-2 text-sm font-medium rounded-md
              bg-brand-primary text-white
              hover:bg-brand-primary-hover
              focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2
              transition-colors duration-base
            "
            aria-label={isLastStep ? "Završi" : "Sledeći korak"}
          >
            {isLastStep ? "Završi" : "Dalje →"}
          </button>
        </div>
      )}
    </div>
  );
};

Stepper.propTypes = {
  /** Array of step objects with id, label, and component */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
        .isRequired,
      hideControls: PropTypes.bool,
    }),
  ).isRequired,

  /** Current step number (1-indexed) - controlled */
  currentStep: PropTypes.number,

  /** Backward-compatible alias for currentStep */
  activeStep: PropTypes.number,

  /** Step change handler - required for controlled mode */
  onStepChange: PropTypes.func,

  /** Complete handler - called when last step's "Next" is clicked */
  onComplete: PropTypes.func,

  /** Show step numbers in circles */
  showStepNumbers: PropTypes.bool,

  /** Allow clicking on step indicators to navigate */
  allowStepClick: PropTypes.bool,

  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Stepper;
