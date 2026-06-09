# Comprobar Google Analytics 4 con consentimiento

La web usa GA4 directo con `gtag.js`, no Google Tag Manager. El ID de medición está en `lib/config/analytics.ts` y no depende de una variable de entorno para GitHub Pages.

## Antes de aceptar analítica

- `localStorage.getItem("rda:analytics-consent")` debe devolver `null` o `"rejected"`.
- En Network no debe aparecer `https://www.googletagmanager.com/gtag/js?id=G-021Z217Z8C`.
- En Network no deben aparecer peticiones `collect?v=2`.

## Después de aceptar analítica

- `localStorage.getItem("rda:analytics-consent")` debe devolver `"accepted"`.
- En Network debe aparecer `gtag/js?id=G-021Z217Z8C`.
- En Network deben aparecer peticiones `collect?v=2` tras la primera carga aceptada y al navegar.
- En Console, `typeof window.gtag` debe devolver `"function"`.

## Depuración opcional

Para activar logs discretos y `window.rdaAnalyticsStatus()` en una build de prueba:

```bash
NEXT_PUBLIC_ANALYTICS_DEBUG=true npm run build
```

No actives esa variable en producción salvo para una comprobación puntual.
