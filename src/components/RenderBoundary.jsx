import React from "react";
import { Link } from "react-router-dom";

class RenderBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("RenderBoundary caught:", error);
    console.error("Error info:", errorInfo);
    console.error("Component stack:", errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="w-full py-16 px-4 sm:px-8 md:px-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-border bg-neutral-surface p-6 sm:p-10 shadow-md">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
              Došlo je do greške u prikazu stranice
            </h2>
            <p className="text-text-secondary mb-6">
              Osvežite stranicu ili se vratite na početnu.
            </p>

            {/* Prikaz detalja greške u development režimu */}
            {isDevelopment && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Detalji greške (Development):
                </h3>
                <p className="text-red-700 font-mono text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-600 hover:text-red-800">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                {this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-600 hover:text-red-800">
                      Error Stack
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
              >
                Osveži
              </button>
              <Link
                to="/"
                className="px-4 py-2 rounded-md border border-neutral-border text-text-primary hover:bg-neutral-bg transition-colors"
              >
                Početna
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RenderBoundary;
