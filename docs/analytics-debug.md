# Depurar Google Analytics 4 en Reunión de Arte

La web usa Google Analytics 4 directo con `gtag.js`. No usa Google Tag Manager.

ID de medición: `G-021Z217Z8C`.

## Flujo recomendado en producción

1. Abrir `https://reuniondearte.com/cookies/`.
2. Pulsar `Reiniciar consentimiento`.
3. Abrir DevTools.
4. En Application > Local Storage comprobar `rda:analytics-consent`.
5. Pulsar `Aceptar analítica`.
6. Abrir `https://reuniondearte.com/articulos/peliculas-ambientadas-en-hoteles/?test=analytics`.
7. En Network comprobar que aparece `gtag/js?id=G-021Z217Z8C`.
8. En Network comprobar peticiones `https://www.google-analytics.com/g/collect`.
9. En Console ejecutar:

```js
window.rdaAnalyticsStatus()
```

10. En Console enviar un evento manual:

```js
window.rdaAnalyticsTestEvent()
```

11. Revisar GA4 > Tiempo real.
12. Si procede, revisar GA4 > Admin > DebugView para el evento `rda_analytics_test`.

## Antes de aceptar analítica

- `localStorage.getItem("rda:analytics-consent")` debe ser `null` o `"rejected"`.
- No debe descargarse `gtag/js?id=G-021Z217Z8C`.
- No deben enviarse peticiones `https://www.google-analytics.com/g/collect`.
- El HTML exportado no debe contener `gtag/js`, `googletagmanager` ni `GTM-`.

## Después de aceptar analítica

- `localStorage.getItem("rda:analytics-consent")` debe ser `"accepted"`.
- `window.rdaAnalyticsStatus()` debe indicar `consent: "accepted"` e `initialized: true`.
- `typeof window.gtag` debe ser `"function"`.
- Debe enviarse un `page_view` con `send_to`, `page_title`, `page_location` y `page_path`.
- En Network debe aparecer `https://www.google-analytics.com/g/collect`.
- Cada navegación SPA debe enviar un nuevo `page_view`.

## Evento de prueba

Con consentimiento aceptado, ejecutar:

```js
window.rdaAnalyticsTestEvent()
```

Debe enviar `rda_analytics_test` con `send_to`, `event_category`, `event_label`, `debug_mode`, `page_title`, `page_location` y `page_path`.

## Depuración opcional en build

Para activar logs discretos en consola:

```bash
NEXT_PUBLIC_ANALYTICS_DEBUG=true npm run build
```

No hace falta activar esa variable en producción salvo para una comprobación puntual.
