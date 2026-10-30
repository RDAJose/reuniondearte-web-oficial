# SETS en la web pública

## Publicación y SEO

La solución conserva `output: "export"` y GitHub Pages. Durante la compilación, Next.js consulta todas las sesiones publicadas de la API y genera:

- `/sets/`: HTML con las primeras 12 sesiones, títulos, descripciones, fechas, géneros y enlaces. Si hay más, un archivo de enlaces permite alcanzar todas sin JavaScript.
- `/sets/{id}/`: página de cada sesión con descripción, tracklist, créditos, canonical, metadata, Open Graph y Twitter propios. La URL numérica permanece estable aunque se cambie el título.
- Entradas individuales en `sitemap.xml`, con la fecha de actualización de la API.

Al abrir la web, el navegador actualiza el catálogo desde la API y permite seguir paginando. Si la API falla, conserva la edición estática y ofrece reintentar. Las sesiones nuevas aparecen en el catálogo dinámico; su enlace individual sólo aparece cuando esa página ya existe en la exportación. Un error de la API durante el build detiene la exportación: no se sustituye silenciosamente el archivo por un catálogo vacío.

**Publicar en el administrador guarda en PostgreSQL, pero no reconstruye GitHub Pages.** Para actualizar el HTML rastreable, las páginas individuales y el sitemap hay que ejecutar de nuevo el workflow existente **Deploy static site to GitHub Pages**, desde GitHub → Actions → Run workflow, una vez que estos cambios hayan sido revisados e instalados. No exige editar código. Esta tarea no ejecuta ese workflow, ni hace push ni despliega.

Al retirar una sesión, la API bloquea nuevas solicitudes públicas de sus archivos privados y la consulta dinámica deja de mostrarla. El HTML editorial ya publicado y los buscadores pueden conservar el título y la descripción hasta reconstruir la web y actualizar sus índices. Una copia de audio ya descargada por un oyente no se puede revocar.

La API se elige mediante `NEXT_PUBLIC_RDA_API_BASE_URL`, después `RDA_API_BASE_URL` y finalmente la API pública existente. Es una URL pública, nunca una credencial. **Instalar primero la API con V10 y V11** antes de compilar la web para producción. No necesita servidor Next.js, nuevos dominios ni otro hosting.

## Reproductor y tracklist

Un único `<audio>` nativo, sin autoplay ni descarga previa del audio, conserva los originales. Incluye play/pausa, ±15 segundos, barra accesible por teclado, duración, errores y Media Session cuando el navegador lo admite. No se carga el reproductor en las páginas de artículos. No se han cambiado layout, cookies ni analítica.

La tracklist es texto, hasta 20.000 caracteres, con una canción por línea. Acepta `00:00 - Artista - Canción` y `1:05:32 - Artista - Canción`. Las líneas sin un tiempo válido se muestran como texto. Los tiempos válidos son botones accesibles que buscan dentro del mismo archivo, sin descargarlo entero en JavaScript ni subir canciones separadas. Cuando se conoce la duración, se deshabilitan los tiempos que la superan. Si el primer toque apunta fuera de duración, se detiene el intento y se avisa. El texto no se interpreta como HTML.

La tracklist aparece debajo del reproductor al elegir una sesión en el catálogo, y desde el HTML inicial de su página individual. Fecha, género y tracklist son opcionales para conservar la compatibilidad con sesiones existentes.

## Comprobación local

Administrador local: `http://localhost:8087/admin/sets/`. Ver el arranque y los pasos de publicación en `reuniondearte-api/docs/sets.md`.

Con la API local iniciada, desde la carpeta de la web:

```powershell
$env:NEXT_PUBLIC_RDA_API_BASE_URL = 'http://localhost:8087'
node node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3000
```

Abrir `http://localhost:3000/sets/`. Para validar producción, detener primero el servidor de desarrollo y ejecutar:

```powershell
npm run lint
node --experimental-strip-types --test scripts/sets.test.mjs # Node 22.6+; prueba local sin dependencias
npm run build
```

Inspeccionar `out/sets/index.html`, `out/sets/{id}/index.html` y `out/sitemap.xml`: títulos, descripciones, tracklist y enlaces deben existir fuera de los bloques `<script>`. La prueba Node requiere una versión reciente sólo para ejecutar TypeScript directamente; el build existente sigue usando Node 20 en GitHub.

Antes de una exportación real, retirar la variable local o fijar la URL pública de la API. **No publicar un `out/` compilado con localhost o sesiones sintéticas de prueba.** Los artículos conservan sus consultas y fallback Markdown.

Pendiente en producción: subida real a Render/R2, SHA-256 y MIME del original, Range/206, búsqueda en archivos largos y pantalla bloqueada en iPhone/Safari y Android/Chrome físicos. Las pruebas locales y los contratos S3 simulados no validan archivos de 500 MB o 1 GiB. Ver límites y derechos en la documentación de la API.

## Recuperación

Fuera de ambos repositorios, en `C:/Users/sytru/.codex/visualizations/2026/10/29/01a18762-7460-70e3-8554-732a23083c7b/`:

- `sets-recovery-20261029`: bundles Git verificados, parches y copias SHA-256 de los cambios locales anteriores a SETS.
- `sets-recovery-before-tracklist`: parches y copia de los archivos locales inmediatamente antes de añadir tracklist y HTML estático.

Recuperar siempre en una carpeta nueva; no usar `reset --hard` sobre el trabajo actual. No se modifican `reuniondearte-app` ni `mobile/`.
