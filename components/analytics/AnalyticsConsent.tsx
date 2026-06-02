"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

const GA_MEASUREMENT_ID = "G-Q21Z217Z8C";
const CONSENT_STORAGE_KEY = "rda:analytics-consent";
const CONSENT_CHANGE_EVENT = "rda:analytics-consent-change";
const ACCEPTED = "accepted";
const REJECTED = "rejected";
const LOADING = "loading";

type ConsentValue = typeof ACCEPTED | typeof REJECTED;
type ConsentSnapshot = ConsentValue | null | typeof LOADING;

let lastTrackedPage: string | null = null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
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

function prepareGoogleAnalytics() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "granted",
  });
  window.gtag("set", "allow_ad_personalization_signals", false);
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
}

function loadGoogleAnalytics() {
  prepareGoogleAnalytics();

  if (document.getElementById("google-analytics-gtag")) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.id = "google-analytics-gtag";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function trackPageView() {
  loadGoogleAnalytics();

  const pagePath = `${window.location.pathname}${window.location.search}`;
  const pageLocation = window.location.href;

  if (lastTrackedPage === pageLocation) {
    return;
  }

  lastTrackedPage = pageLocation;

  window.gtag?.("event", "page_view", {
    page_location: pageLocation,
    page_path: pagePath,
    page_title: document.title,
  });
}

export function AnalyticsConsent() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  useEffect(() => {
    if (consent === ACCEPTED) {
      trackPageView();

      const queuePageView = () => {
        window.setTimeout(trackPageView, 0);
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
  }, [consent]);

  function acceptAnalytics() {
    storeConsent(ACCEPTED);
    trackPageView();
  }

  function rejectAnalytics() {
    storeConsent(REJECTED);
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
        <Link href="/cookies">Política de cookies</Link>
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
