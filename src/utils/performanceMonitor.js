/**
 * Performance Monitoring Utility
 * Prati performanse aplikacije i loguje metrike
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0,
      cumulativeLayoutShift: 0,
    };

    this.init();
  }

  init() {
    if (typeof window === "undefined") return;

    // Performance Observer za Core Web Vitals
    if ("PerformanceObserver" in window) {
      this.observePaint();
      this.observeLCP();
      this.observeCLS();
      this.observeFID();
    }

    // Klasični Performance API
    window.addEventListener("load", () => {
      this.measurePageLoad();
    });
  }

  // First Paint & First Contentful Paint
  observePaint() {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-paint") {
          this.metrics.firstPaint = entry.startTime;
          this.logMetric("First Paint", entry.startTime);
        }
        if (entry.name === "first-contentful-paint") {
          this.metrics.firstContentfulPaint = entry.startTime;
          this.logMetric("First Contentful Paint", entry.startTime);
        }
      }
    });

    paintObserver.observe({ entryTypes: ["paint"] });
  }

  // Largest Contentful Paint (LCP)
  observeLCP() {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint =
        lastEntry.renderTime || lastEntry.loadTime;
      this.logMetric(
        "Largest Contentful Paint",
        this.metrics.largestContentfulPaint,
      );
    });

    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  }

  // Cumulative Layout Shift (CLS)
  observeCLS() {
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          this.metrics.cumulativeLayoutShift = clsScore;
        }
      }
      this.logMetric("Cumulative Layout Shift", clsScore);
    });

    clsObserver.observe({ entryTypes: ["layout-shift"] });
  }

  // First Input Delay (FID)
  observeFID() {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        this.logMetric("First Input Delay", fid);
      }
    });

    fidObserver.observe({ entryTypes: ["first-input"] });
  }

  // Page Load Time
  measurePageLoad() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    this.metrics.pageLoadTime = pageLoadTime;
    this.logMetric("Page Load Time", pageLoadTime);
  }

  // Logovanje metrika
  logMetric(name, value) {
    console.log(`[Performance] ${name}: ${Math.round(value)}ms`);

    // Ovde možeš dodati slanje na analytics service
    this.sendToAnalytics(name, value);
  }

  // Slanje na Google Analytics ili drugi servis
  sendToAnalytics(name, value) {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "performance_metric", {
        event_category: "Performance",
        event_label: name,
        value: Math.round(value),
      });
    }
  }

  // Dobij sve metrike
  getMetrics() {
    return { ...this.metrics };
  }

  // Report generisanje
  generateReport() {
    console.group("📊 Performance Report");
    console.table(this.metrics);
    console.groupEnd();

    return this.getMetrics();
  }
}

// Singleton instanca
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Helper funkcije za manual tracking
export const measureAsync = async (name, fn) => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  console.log(`[Async Measure] ${name}: ${Math.round(duration)}ms`);
  return result;
};

export const measureSync = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  console.log(`[Sync Measure] ${name}: ${Math.round(duration)}ms`);
  return result;
};
