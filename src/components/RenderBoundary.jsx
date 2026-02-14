import React from "react";
import { Link } from "react-router-dom";

class RenderBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("RenderBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-16 px-4 sm:px-8 md:px-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-border bg-neutral-surface p-6 sm:p-10 shadow-md">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
              Došlo je do greške u prikazu stranice
            </h2>
            <p className="text-text-secondary mb-6">
              Osvežite stranicu ili se vratite na početnu.
            </p>
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
