"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

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

function ensureGoogleTag() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

function grantAnalyticsConsent() {
  ensureGoogleTag();
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });
}

function denyAnalyticsConsent() {
  ensureGoogleTag();
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
  });
}

function sendPageView() {
  const pagePath = `${window.location.pathname}${window.location.search}`;
  const pageLocation = window.location.href;

  if (lastTrackedPage === pageLocation) {
    return;
  }

  grantAnalyticsConsent();

  window.gtag?.("event", "page_view", {
    page_location: pageLocation,
    page_path: pagePath,
    page_title: document.title,
  });

  lastTrackedPage = pageLocation;
}

export function AnalyticsConsent() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  useEffect(() => {
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

