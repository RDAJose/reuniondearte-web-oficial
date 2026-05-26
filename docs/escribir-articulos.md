# Cómo escribir artículos en Reunión de Arte

## Objetivo

La web oficial funciona con artículos escritos en Markdown y guardados localmente en el proyecto.

No se usa WordPress. No se importan carpetas antiguas. No se depende de que el ordenador esté encendido una vez publicada la web en hosting.

## Dónde van los textos

Cada artículo tiene su propia carpeta:

`content/articles/nombre-del-articulo/index.md`

Ejemplo:

`content/articles/holiday-crudo-retrato-del-lujo-y-el-sufrimiento/index.md`

## Dónde van las imágenes

Las imágenes del artículo van en:

`public/media/articles/nombre-del-articulo/`

Ejemplo:

`public/media/articles/holiday-crudo-retrato-del-lujo-y-el-sufrimiento/cover.webp`

## Imagen principal

En el `index.md`, la imagen principal se indica así:

`coverImage: "/media/articles/nombre-del-articulo/cover.webp"`

La imagen debe existir dentro de `public/media/articles/nombre-del-articulo/`.

## Enlaces

Los enlaces externos se escriben así:

`[Texto visible](https://ejemplo.com)`

## Imágenes dentro del texto

Las imágenes internas se escriben así:

`![Descripción de la imagen](/media/articles/nombre-del-articulo/imagen-1.webp)`

## Borrador o publicado

Para guardar un artículo sin publicarlo:

`status: "draft"`

Para publicarlo:

`status: "published"`

## Categorías permitidas

- cine
- musica
- arte
- libros
- cultura

## Reglas de migración

No migrar al inicio:

- RSS de SoundCloud.
- Trip From Jose to South Africa.
- Log Drum Series.
- Episodios de radio/audio.
- Posts que sean solo audio embebido.
- Carpetas completas de WordPress.
- Imágenes repetidas o sin utilidad.

Migrar solo artículos escritos valiosos, revisados y ordenados manualmente.
