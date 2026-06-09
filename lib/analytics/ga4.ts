import {
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_DEBUG_ENABLED,
  GA_MEASUREMENT_ID,
} from "@/lib/config/analytics";

export type AnalyticsConsentValue = "accepted" | "rejected";

const CONSENT_CHANGE_EVENT = "rda:analytics-consent-change";
const GA_SCRIPT_ID = "google-analytics-gtag";

let loadPromise: Promise<boolean> | null = null;
let initialized = false;
let lastPageViewPath: string | null = null;
let lastPageViewLocation: string | null = null;
let pendingPageViewLocation: string | null = null;
let lastTestEventAt: string | null = null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    rdaAnalyticsStatus?: () => ReturnType<typeof analyticsDebugStatus>;
    rdaAnalyticsTestEvent?: () => Promise<boolean>;
  }
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function debugLog(message: string, details?: Record<string, unknown>) {
  if (!ANALYTICS_DEBUG_ENABLED || !isBrowser()) {
    return;
  }

  if (details) {
    console.info(`[RDA Analytics] ${message}`, details);
    return;
  }

  console.info(`[RDA Analytics] ${message}`);
}

function dispatchConsentChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

function getGoogleAnalyticsScript() {
  if (!isBrowser()) {
    return null;
  }

  return document.getElementById(GA_SCRIPT_ID) as HTMLScriptElement | null;
}

function getGoogleAnalyticsScripts() {
  if (!isBrowser()) {
    return [];
  }

  return Array.from(
    document.querySelectorAll<HTMLScriptElement>(
      `script[src*="googletagmanager.com/gtag/js"]`,
    ),
  ).map((script) => ({
    id: script.id,
    loaded: script.dataset.loaded === "true",
    src: script.src,
  }));
}

function ensureGoogleAnalyticsStub() {
  window.dataLayer = window.dataLayer ?? [];

  if (typeof window.gtag === "function") {
    return;
  }

  window.gtag =
    function gtag() {
      // Google documents the gtag stub with `arguments`; keep it byte-for-byte familiar.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
}

function initializeGoogleAnalytics() {
  if (initialized || !isBrowser()) {
    return;
  }

  ensureGoogleAnalyticsStub();
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  initialized = true;
  debugLog("GA4 initialized", { measurementId: GA_MEASUREMENT_ID });
}

function updateAnalyticsConsentDenied() {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function getCurrentPageFields(url?: string) {
  const pageUrl = url ? new URL(url, window.location.origin) : new URL(window.location.href);

  return {
    page_location: pageUrl.toString(),
    page_path: pageUrl.pathname,
    page_title: document.title,
  };
}

export function getAnalyticsConsent(): AnalyticsConsentValue | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(value: AnalyticsConsentValue) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // Keep the UI responsive even if localStorage is unavailable.
  }

  if (value === "rejected") {
    lastPageViewPath = null;
    lastPageViewLocation = null;
    pendingPageViewLocation = null;
    updateAnalyticsConsentDenied();
  }

  dispatchConsentChange();
}

export function clearAnalyticsConsent() {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  } catch {
    // Keep the action available even if localStorage is unavailable.
  }

  lastPageViewPath = null;
  lastPageViewLocation = null;
  pendingPageViewLocation = null;
  updateAnalyticsConsentDenied();
  dispatchConsentChange();
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === "accepted";
}

export function subscribeToAnalyticsConsent(callback: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
  };
}

export function loadGoogleAnalytics() {
  if (!isBrowser() || !hasAnalyticsConsent()) {
    return Promise.resolve(false);
  }

  if (loadPromise) {
    return loadPromise;
  }

  ensureGoogleAnalyticsStub();

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = getGoogleAnalyticsScript();

    if (existingScript?.dataset.loaded === "true") {
      initializeGoogleAnalytics();
      resolve(true);
      return;
    }

    const script = existingScript ?? document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        initializeGoogleAnalytics();
        debugLog("GA4 script loaded", { src: script.src });
        resolve(true);
      },
      { once: true },
    );

    script.addEventListener(
      "error",
      () => {
        loadPromise = null;
        reject(new Error("Google Analytics could not be loaded."));
      },
      { once: true },
    );

    if (!existingScript) {
      document.head.appendChild(script);
    }
  });

  return loadPromise;
}

export async function pageView(url?: string) {
  if (!isBrowser() || !hasAnalyticsConsent()) {
    return false;
  }

  const pageFields = getCurrentPageFields(url);

  if (
    lastPageViewLocation === pageFields.page_location ||
    pendingPageViewLocation === pageFields.page_location
  ) {
    return false;
  }

  pendingPageViewLocation = pageFields.page_location;

  try {
    const loaded = await loadGoogleAnalytics();
    if (!loaded) {
      return false;
    }

    window.gtag?.("event", "page_view", {
      send_to: GA_MEASUREMENT_ID,
      ...pageFields,
    });
    lastPageViewPath = pageFields.page_path;
    lastPageViewLocation = pageFields.page_location;
    debugLog("page_view sent", pageFields);
    return true;
  } catch {
    return false;
  } finally {
    if (pendingPageViewLocation === pageFields.page_location) {
      pendingPageViewLocation = null;
    }
  }
}

export function analyticsDebugStatus() {
  const script = getGoogleAnalyticsScript();

  return {
    consent: getAnalyticsConsent(),
    dataLayerLength: isBrowser() ? (window.dataLayer?.length ?? 0) : 0,
    gtagReady: isBrowser() ? typeof window.gtag === "function" : false,
    gtagExists: isBrowser() ? "gtag" in window : false,
    initialized,
    lastPageViewPath,
    lastTestEventAt,
    measurementId: GA_MEASUREMENT_ID,
    scripts: getGoogleAnalyticsScripts(),
    scriptLoaded: script?.dataset.loaded === "true",
    scriptPresent: Boolean(script),
    storageKey: ANALYTICS_CONSENT_KEY,
  };
}

export async function sendAnalyticsTestEvent() {
  if (!isBrowser() || !hasAnalyticsConsent()) {
    return false;
  }

  const loaded = await loadGoogleAnalytics();
  if (!loaded) {
    return false;
  }

  const pageFields = getCurrentPageFields();
  window.gtag?.("event", "rda_analytics_test", {
    send_to: GA_MEASUREMENT_ID,
    event_category: "debug",
    event_label: "manual_test",
    debug_mode: true,
    ...pageFields,
  });
  lastTestEventAt = new Date().toISOString();
  debugLog("test event sent", pageFields);
  return true;
}

export function exposeAnalyticsDebugHelpers() {
  if (!isBrowser()) {
    return;
  }

  window.rdaAnalyticsStatus = analyticsDebugStatus;
  window.rdaAnalyticsTestEvent = sendAnalyticsTestEvent;
}
