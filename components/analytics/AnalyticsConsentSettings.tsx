"use client";

import { useSyncExternalStore, useState } from "react";
import {
  clearAnalyticsConsent,
  getAnalyticsConsent,
  pageView,
  sendAnalyticsTestEvent,
  setAnalyticsConsent,
  subscribeToAnalyticsConsent,
} from "@/lib/analytics/ga4";
import { GA_MEASUREMENT_ID } from "@/lib/config/analytics";

function getConsentSnapshot() {
  return getAnalyticsConsent();
}

function getServerConsentSnapshot() {
  return null;
}

function expireCookie(name: string) {
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${name}=; ${expires}; path=/`;
  document.cookie = `${name}=; ${expires}; path=/; domain=.${window.location.hostname}`;
}

function clearGoogleAnalyticsCookies() {
  expireCookie("_ga");
  expireCookie(`_ga_${GA_MEASUREMENT_ID.replace("G-", "")}`);
}

function getStatusLabel(consent: ReturnType<typeof getAnalyticsConsent>) {
  if (consent === "accepted") {
    return "accepted";
  }

  if (consent === "rejected") {
    return "rejected";
  }

  return "no decidido";
}

export function AnalyticsConsentSettings() {
  const [status, setStatus] = useState<string | null>(null);
  const consent = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  function acceptAnalytics() {
    setAnalyticsConsent("accepted");
    void pageView();
    setStatus("Analítica aceptada. GA4 puede cargarse y enviar páginas vistas.");
  }

  function rejectAnalytics() {
    setAnalyticsConsent("rejected");
    clearGoogleAnalyticsCookies();
    setStatus("Analítica rechazada. GA4 no se cargará mientras esta decisión siga activa.");
  }

  function resetConsent() {
    clearAnalyticsConsent();
    clearGoogleAnalyticsCookies();
    setStatus("Preferencia reiniciada. El banner volverá a mostrarse para elegir de nuevo.");
  }

  async function sendTestEvent() {
    const sent = await sendAnalyticsTestEvent();
    setStatus(
      sent
        ? "Evento de prueba rda_analytics_test enviado."
        : "No se envió el evento: primero hay que aceptar la analítica.",
    );
  }

  return (
    <div className="privacy-settings">
      <p>
        Estado actual de analítica: <strong>{getStatusLabel(consent)}</strong>.
      </p>

      <div className="privacy-settings__actions">
        <button type="button" onClick={acceptAnalytics}>
          Aceptar analítica
        </button>
        <button type="button" onClick={rejectAnalytics}>
          Rechazar analítica
        </button>
        <button type="button" onClick={resetConsent}>
          Reiniciar consentimiento
        </button>
        <button type="button" onClick={sendTestEvent} disabled={consent !== "accepted"}>
          Enviar evento de prueba
        </button>
      </div>

      <div className="privacy-settings__help">
        <p>Comprobaciones rápidas:</p>
        <ul>
          <li>Network: gtag/js?id={GA_MEASUREMENT_ID}</li>
          <li>Network: google-analytics.com/g/collect</li>
          <li>Console: window.rdaAnalyticsStatus()</li>
          <li>Console: window.rdaAnalyticsTestEvent()</li>
        </ul>
      </div>

      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}
