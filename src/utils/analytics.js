/**
 * Google Analytics Helper
 * Wrapper za Google Analytics 4
 */

class Analytics {
  constructor() {
    this.initialized = false;
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID;
  }

  // Inicijalizacija GA4
  init() {
    if (this.initialized || !this.trackingId) {
      return;
    }

    // Učitaj GA4 script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    // Inicijalizuj gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", this.trackingId, {
      page_path: window.location.pathname,
      send_page_view: true,
    });

    this.initialized = true;
    console.log("✅ Google Analytics initialized:", this.trackingId);
  }

  // Track page view
  pageView(path, title) {
    if (!this.initialized || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_path: path || window.location.pathname,
      page_title: title || document.title,
      page_location: window.location.href,
    });

    console.log("📊 Page view tracked:", path);
  }

  // Track event
  event(eventName, params = {}) {
    if (!this.initialized || !window.gtag) return;

    window.gtag("event", eventName, params);
    console.log("📊 Event tracked:", eventName, params);
  }

  // Track button click
  clickButton(buttonName, category = "Button") {
    this.event("click", {
      event_category: category,
      event_label: buttonName,
    });
  }

  // Track form submission
  submitForm(formName) {
    this.event("form_submit", {
      event_category: "Form",
      event_label: formName,
    });
  }

  // Track conversion
  conversion(value, currency = "RSD") {
    this.event("conversion", {
      value: value,
      currency: currency,
    });
  }

  // Track search
  search(searchTerm) {
    this.event("search", {
      search_term: searchTerm,
    });
  }

  // Track download
  download(fileName) {
    this.event("file_download", {
      event_category: "Download",
      event_label: fileName,
    });
  }

  // Track outbound link
  outboundLink(url) {
    this.event("click", {
      event_category: "Outbound Link",
      event_label: url,
      transport_type: "beacon",
    });
  }

  // Track video play
  videoPlay(videoName) {
    this.event("video_start", {
      event_category: "Video",
      event_label: videoName,
    });
  }

  // Track error
  error(errorMessage, errorCategory = "JavaScript Error") {
    this.event("exception", {
      description: errorMessage,
      fatal: false,
      event_category: errorCategory,
    });
  }

  // Track timing
  timing(name, value, category = "Performance") {
    this.event("timing_complete", {
      name: name,
      value: Math.round(value),
      event_category: category,
    });
  }

  // Set user properties
  setUserProperties(properties) {
    if (!this.initialized || !window.gtag) return;

    window.gtag("set", "user_properties", properties);
  }

  // Set user ID
  setUserId(userId) {
    if (!this.initialized || !window.gtag) return;

    window.gtag("config", this.trackingId, {
      user_id: userId,
    });
  }
}

// Singleton instance
const analytics = new Analytics();

// Auto-initialize if tracking ID exists
if (
  import.meta.env.VITE_GA_TRACKING_ID &&
  import.meta.env.VITE_ENABLE_ANALYTICS !== "false"
) {
  analytics.init();
}

export default analytics;

/**
 * React Hook za tracking
 */
export const useAnalytics = () => {
  return {
    trackPageView: (path, title) => analytics.pageView(path, title),
    trackEvent: (eventName, params) => analytics.event(eventName, params),
    trackClick: (buttonName, category) =>
      analytics.clickButton(buttonName, category),
    trackForm: (formName) => analytics.submitForm(formName),
    trackConversion: (value, currency) => analytics.conversion(value, currency),
    trackSearch: (searchTerm) => analytics.search(searchTerm),
    trackDownload: (fileName) => analytics.download(fileName),
    trackOutboundLink: (url) => analytics.outboundLink(url),
    trackError: (errorMessage, category) =>
      analytics.error(errorMessage, category),
  };
};
