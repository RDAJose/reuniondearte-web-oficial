"use client";

import { useEffect, useSyncExternalStore } from "react";

const CONSENT_STORAGE_KEY = "rda:analytics-consent";
const CONSENT_CHANGE_EVENT = "rda:analytics-consent-change";
const GA_MEASUREMENT_ID = "G-021Z217Z8C";
const GA_SCRIPT_ID = "google-analytics-gtag";
const ACCEPTED = "accepted";
const REJECTED = "rejected";
const LOADING = "loading";

type ConsentValue = typeof ACCEPTED | typeof REJECTED;
type ConsentSnapshot = ConsentValue | null | typeof LOADING;

let lastTrackedPage: string | null = null;
let pendingTrackedPage: string | null = null;
let googleAnalyticsLoadPromise: Promise<void> | null = null;
let googleAnalyticsConfigured = false;
let defaultConsentConfigured = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    rdaAnalyticsStatus?: () => {
      consent: ConsentValue | null;
      gtagReady: boolean;
      measurementId: string;
      scriptLoaded: boolean;
    };
  }
}

function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

function logAnalytics(message: string, details?: Record<string, unknown>) {
  if (!isDevelopment()) {
    return;
  }

  if (details) {
    console.info(`[RDA analytics] ${message}`, details);
    return;
  }

  console.info(`[RDA analytics] ${message}`);
}

function getStoredConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === ACCEPTED || value === REJECTED ? value : null;
  } catch {
    return null;
  }
}

function storeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // If localStorage is unavailable, keep the in-memory decision for this visit.
  }

  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

function getGoogleAnalyticsScript() {
  return document.getElementById(GA_SCRIPT_ID) as HTMLScriptElement | null;
}

function registerAnalyticsStatus() {
  if (!isDevelopment()) {
    return;
  }

  window.rdaAnalyticsStatus = () => {
    const script = getGoogleAnalyticsScript();

    return {
      consent: getStoredConsent(),
      gtagReady: typeof window.gtag === "function",
      measurementId: GA_MEASUREMENT_ID,
      scriptLoaded: script?.dataset.loaded === "true",
    };
  };
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
  };
}

function getConsentSnapshot(): ConsentSnapshot {
  return getStoredConsent();
}

function getServerConsentSnapshot(): ConsentSnapshot {
  return LOADING;
}

function ensureGoogleTag() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

function configureDefaultConsent() {
  ensureGoogleTag();

  if (defaultConsentConfigured) {
    return;
  }

  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    personalization_storage: "denied",
  });

  defaultConsentConfigured = true;
  logAnalytics("default consent configured", {
    analytics_storage: "denied",
    measurementId: GA_MEASUREMENT_ID,
  });
}

function configureGoogleAnalytics() {
  if (googleAnalyticsConfigured) {
    return;
  }

  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    send_page_view: false,
  });

  googleAnalyticsConfigured = true;
  logAnalytics("GA configured", {
    measurementId: GA_MEASUREMENT_ID,
    send_page_view: false,
  });
}

function ensureGoogleAnalyticsLoaded() {
  if (googleAnalyticsLoadPromise) {
    return googleAnalyticsLoadPromise;
  }

  configureDefaultConsent();

  googleAnalyticsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = getGoogleAnalyticsScript();

    if (existingScript?.dataset.loaded === "true") {
      configureGoogleAnalytics();
      resolve();
      return;
    }

    const script = existingScript ?? document.createElement("script");

    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    logAnalytics("loading GA script", {
      measurementId: GA_MEASUREMENT_ID,
      src: script.src,
    });

    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        logAnalytics("GA script loaded", {
          measurementId: GA_MEASUREMENT_ID,
        });
        configureGoogleAnalytics();
        resolve();
      },
      { once: true },
    );

    script.addEventListener(
      "error",
      () => {
        googleAnalyticsLoadPromise = null;
        reject(new Error("Google Analytics could not be loaded."));
      },
      { once: true },
    );

    if (!existingScript) {
      document.head.appendChild(script);
    }
  });

  return googleAnalyticsLoadPromise;
}

function grantAnalyticsConsent() {
  configureDefaultConsent();
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });
  logAnalytics("consent updated", {
    analytics_storage: "granted",
    measurementId: GA_MEASUREMENT_ID,
  });
}

function denyAnalyticsConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
  });
  logAnalytics("consent updated", {
    analytics_storage: "denied",
    measurementId: GA_MEASUREMENT_ID,
  });
}

function resetPageViewState() {
  lastTrackedPage = null;
  pendingTrackedPage = null;
}

async function sendPageView() {
  const pagePath = `${window.location.pathname}${window.location.search}`;
  const pageLocation = window.location.href;

  if (lastTrackedPage === pageLocation || pendingTrackedPage === pageLocation) {
    return;
  }

  pendingTrackedPage = pageLocation;

  try {
    await ensureGoogleAnalyticsLoaded();
    grantAnalyticsConsent();

    window.gtag?.("event", "page_view", {
      page_location: pageLocation,
      page_path: pagePath,
      page_title: document.title,
    });
    logAnalytics("page_view sent", {
      measurementId: GA_MEASUREMENT_ID,
      page_location: pageLocation,
      page_path: pagePath,
      page_title: document.title,
    });

    lastTrackedPage = pageLocation;
  } catch {
    // Keep navigation unaffected if analytics is blocked or unavailable.
  } finally {
    if (pendingTrackedPage === pageLocation) {
      pendingTrackedPage = null;
    }
  }
}

export function AnalyticsConsent() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  useEffect(() => {
    registerAnalyticsStatus();
  }, []);

  useEffect(() => {
    if (consent !== LOADING) {
      logAnalytics("consent detected", {
        consent,
        measurementId: GA_MEASUREMENT_ID,
      });
    }

    if (consent === ACCEPTED) {
      sendPageView();

      const queuePageView = () => {
        window.setTimeout(() => {
          sendPageView();
        }, 0);
      };
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = function pushState(
        ...args: Parameters<History["pushState"]>
      ) {
        const result = originalPushState.apply(this, args);
        queuePageView();
        return result;
      };

      window.history.replaceState = function replaceState(
        ...args: Parameters<History["replaceState"]>
      ) {
        const result = originalReplaceState.apply(this, args);
        queuePageView();
        return result;
      };

      window.addEventListener("popstate", queuePageView);

      return () => {
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
        window.removeEventListener("popstate", queuePageView);
      };
    }

    resetPageViewState();

    if (consent === REJECTED) {
      denyAnalyticsConsent();
    }
  }, [consent]);

  function acceptAnalytics() {
    storeConsent(ACCEPTED);
    sendPageView();
  }

  function rejectAnalytics() {
    storeConsent(REJECTED);
    denyAnalyticsConsent();
  }

  if (consent === LOADING || consent) {
    return null;
  }

  return (
    <section
      aria-label="Consentimiento de analítica"
      className="analytics-consent"
    >
      <div className="analytics-consent__body">
        <p>
          Usamos Google Analytics 4 solo si aceptas, para medir visitas y mejorar
          el archivo editorial. Puedes rechazarlo sin afectar a la navegación.
        </p>
        <a href="/cookies">Política de cookies</a>
      </div>

      <div className="analytics-consent__actions">
        <button type="button" onClick={rejectAnalytics}>
          Rechazar
        </button>
        <button
          className="analytics-consent__primary"
          type="button"
          onClick={acceptAnalytics}
        >
          Aceptar analítica
        </button>
      </div>
    </section>
  );
}

