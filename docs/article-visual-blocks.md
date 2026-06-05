# Bloques visuales para articulos

Los articulos Markdown pueden incluir bloques editoriales seguros con la sintaxis
`:::rda-*`. El sistema solo renderiza las imagenes y enlaces que introduzca el
editor: no descarga, busca ni inserta recursos externos por defecto.

Reglas de seguridad y legales:

- Usar solo imagenes con licencia, press kit autorizado, recursos propios o rutas internas.
- No usar imagenes de Letterboxd, Google Images, Instagram, redes sociales o prensa sin permiso.
- Mantener `credit` visible cuando proceda. No ocultar creditos legales.
- Las URLs aceptadas son `http`, `https` o rutas internas que empiecen por `/`.
- No se permite HTML crudo, `javascript:`, `data:` ni rutas protocol-relative como `//example.com`.

## rda-grid

Pensado para rankings visuales, grupos de posters, portadas, discos, libros,
obras o exposiciones. Soporta `variant="poster"`, `variant="square"` y
`variant="landscape"`. `columns` es opcional y se limita a 2-6 columnas en
escritorio; en movil usa 2 columnas.

```markdown
:::rda-grid variant="poster" columns="5" title="Peliculas del ranking"
- image: https://example.com/media/pelicula-x.webp
  alt: Cartel generico de la pelicula X
  title: Pelicula X
  href: /articulos/pelicula-x/
  credit: Press kit autorizado / fuente con licencia
- image: https://example.com/media/pelicula-y.webp
  alt: Cartel generico de la pelicula Y
  title: Pelicula Y
  credit: Imagen editorial autorizada
:::
```

## rda-ranking

Pensado para listas numeradas de peliculas, discos, libros, obras, artistas o
exposiciones. La imagen es opcional. Si `rank` no se indica, se usa el orden del
bloque.

```markdown
:::rda-ranking title="Ranking de peliculas"
- rank: 1
  title: Pelicula X
  year: 2025
  creator: Direccion de Nombre
  image: https://example.com/media/pelicula-x.webp
  alt: Imagen promocional generica de Pelicula X
  text: Breve comentario critico de dos o tres lineas.
  href: /articulos/pelicula-x/
  credit: Press kit autorizado
- rank: 2
  title: Pelicula Y
  year: 2024
  text: Comentario breve.
:::
```

## rda-gallery

Pensado para galerias editoriales con captions y creditos visibles. Por defecto
usa `variant="landscape"`, aunque tambien acepta `poster` y `square`.

```markdown
:::rda-gallery variant="landscape" columns="3" title="Galeria"
- image: /media/articles/mi-articulo/imagen-1.webp
  alt: Vista general de una instalacion expositiva
  title: Sala principal
  credit: Fotografia propia / Reunion de Arte
- image: /media/articles/mi-articulo/imagen-2.webp
  alt: Detalle de una obra expuesta
  title: Detalle de obra
  credit: Imagen cedida por la institucion
:::
```
