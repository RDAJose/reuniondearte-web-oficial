"use client";

import { useState } from "react";
import { analyticsConfig } from "@/lib/config/analytics";

const CONSENT_STORAGE_KEY = "rda:analytics-consent";
const CONSENT_CHANGE_EVENT = "rda:analytics-consent-change";
const GA_MEASUREMENT_ID = analyticsConfig.measurementId;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function expireCookie(name: string) {
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${name}=; ${expires}; path=/`;
  document.cookie = `${name}=; ${expires}; path=/; domain=.${window.location.hostname}`;
}

export function AnalyticsConsentSettings() {
  const [status, setStatus] = useState<string | null>(null);

  function reviewConsent() {
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Keep the action available even when localStorage is blocked.
    }

    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
    });

    expireCookie("_ga");
    expireCookie(`_ga_${GA_MEASUREMENT_ID.replace("G-", "")}`);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    setStatus(
      "Preferencia reiniciada. El banner de analítica volverá a mostrarse para aceptar o rechazar de nuevo.",
    );
  }

  return (
    <div className="privacy-settings">
      <button type="button" onClick={reviewConsent}>
        Revisar consentimiento de analítica
      </button>
      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}
