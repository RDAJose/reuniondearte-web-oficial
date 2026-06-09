"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  exposeAnalyticsDebugHelpers,
  getAnalyticsConsent,
  loadGoogleAnalytics,
  pageView,
  setAnalyticsConsent,
  subscribeToAnalyticsConsent,
} from "@/lib/analytics/ga4";

function getConsentSnapshot() {
  return getAnalyticsConsent();
}

function getServerConsentSnapshot() {
  return null;
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  useEffect(() => {
    exposeAnalyticsDebugHelpers();
  }, []);

  useEffect(() => {
    if (consent !== "accepted") {
      return;
    }

    void loadGoogleAnalytics().then(() => {
      void pageView();
    });
  }, [consent, pathname]);

  useEffect(() => {
    if (consent !== "accepted") {
      return;
    }

    const queuePageView = () => {
      window.setTimeout(() => {
        void pageView();
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
  }, [consent]);

  function acceptAnalytics() {
    setAnalyticsConsent("accepted");
    void loadGoogleAnalytics().then(() => {
      void pageView();
    });
  }

  function rejectAnalytics() {
    setAnalyticsConsent("rejected");
  }

  if (consent) {
    return null;
  }

  return (
    <section
      aria-label="Consentimiento de analítica"
      className="analytics-consent"
      data-rda-analytics-consent="true"
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
