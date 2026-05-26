# Reglas de migración - Reunión de Arte Web Oficial

## Objetivo

Crear una web oficial nueva, limpia y mantenible para Reunión de Arte.

La exportación antigua de WordPress/Simply no se importa completa. Solo se usa como archivo de consulta para rescatar contenido valioso.

## Carpetas separadas

- `C:\Users\sytru\Desktop\reuniondearte-web-oficial`: web nueva oficial.
- `C:\Users\sytru\Desktop\rdaweb`: exportación antigua. Solo referencia.
- `C:\Users\sytru\Desktop\rdaweb-git`: otro proyecto técnico/web app. No se toca para esta web.

## Qué sí se migra

- Artículos escritos importantes.
- Títulos definitivos.
- Slugs útiles para SEO.
- Fechas de publicación si aportan valor.
- Categorías principales.
- Extractos.
- Imágenes principales útiles.
- Imágenes internas necesarias.
- Información editorial propia.

## Qué no se migra al inicio

- Carpetas enteras de WordPress.
- `wp-content` completo.
- `wp-includes`.
- HTML exportado sin limpiar.
- Artículos duplicados.
- Artículos débiles o descartables.
- Páginas técnicas antiguas.
- RSS de SoundCloud.
- Posts que sean solo audio embebido.
- Trip From Jose to South Africa.
- Log Drum Series.
- Episodios de radio/audio.
- Archivos innecesarios o repetidos.

## Norma de artículos

Cada artículo nuevo debe tener:

- Slug limpio.
- Título revisado.
- Categoría clara.
- Extracto corto.
- Fecha.
- Texto limpio en Markdown.
- Imagen principal optimizada.
- Imágenes internas solo si son necesarias.

## Estructura de artículos

Contenido:

`content/articles/nombre-del-articulo/index.md`

Imágenes:

`public/media/articles/nombre-del-articulo/cover.webp`

## Norma legal/editorial

Antes de publicar con dominio oficial deben existir:

- Página de contacto.
- Aviso legal.
- Política de privacidad.
- Política de cookies si se usan cookies, analítica, embeds o servicios externos.
- Revisión de derechos de imágenes.
- Revisión de textos propios y citas.
- HTTPS activo.
- Dominio controlado por el propietario del proyecto.

## Norma de publicación

No se conecta `reuniondearte.com` hasta que:

- La web compile.
- La navegación funcione.
- Las páginas legales mínimas existan.
- Los primeros artículos estén revisados.
- Las URLs importantes estén controladas.
- El proyecto esté en Git limpio.
