"use client";

import { useMemo, useState } from "react";
import { ArticleMarkdown } from "@/components/articles/ArticleMarkdown";

type TemplateKey = "gallery" | "grid-landscape" | "grid-poster" | "ranking";

const legalNotice =
  "Usa solo imágenes propias, press kit oficial, cesión escrita o licencias compatibles con uso editorial y monetizable. No uses imágenes de Google, Letterboxd, Instagram, prensa, blogs o redes sin permiso claro.";

const templates: Record<
  TemplateKey,
  {
    label: string;
    markdown: string;
  }
> = {
  "grid-poster": {
    label: "Grid póster",
    markdown: `:::rda-grid variant="poster" columns="5" title="Selección visual"
- image: https://placehold.co/400x600?text=Poster+1
  alt: Póster genérico de prueba 1
  title: Obra 1
  href: /articulos/
  credit: Fuente autorizada / licencia editorial
- image: https://placehold.co/400x600?text=Poster+2
  alt: Póster genérico de prueba 2
  title: Obra 2
  credit: Fuente autorizada / licencia editorial
- image: https://placehold.co/400x600?text=Poster+3
  alt: Póster genérico de prueba 3
  title: Obra 3
  credit: Fuente autorizada / licencia editorial
:::`,
  },
  "grid-landscape": {
    label: "Grid panorámico",
    markdown: `:::rda-grid variant="landscape" columns="3" title="Selección panorámica"
- image: https://placehold.co/1200x675?text=Panoramica+1
  alt: Imagen panorámica genérica de prueba 1
  title: Imagen 1
  credit: Fuente autorizada / licencia editorial
- image: https://placehold.co/1200x675?text=Panoramica+2
  alt: Imagen panorámica genérica de prueba 2
  title: Imagen 2
  credit: Fuente autorizada / licencia editorial
- image: https://placehold.co/1200x675?text=Panoramica+3
  alt: Imagen panorámica genérica de prueba 3
  title: Imagen 3
  credit: Fuente autorizada / licencia editorial
:::`,
  },
  ranking: {
    label: "Ranking",
    markdown: `:::rda-ranking title="Ranking editorial"
- rank: 1
  title: Obra destacada 1
  year: 2026
  creator: Autoría o dirección
  image: https://placehold.co/400x600?text=Ranking+1
  alt: Imagen genérica de prueba para ranking 1
  text: Comentario breve para contextualizar la posición dentro del ranking.
  href: /articulos/
  credit: Fuente autorizada / licencia editorial
- rank: 2
  title: Obra destacada 2
  year: 2025
  creator: Autoría o dirección
  image: https://placehold.co/400x600?text=Ranking+2
  alt: Imagen genérica de prueba para ranking 2
  text: Segundo comentario breve de ejemplo.
  credit: Fuente autorizada / licencia editorial
- rank: 3
  title: Obra destacada 3 sin imagen
  year: 2024
  text: Item sin imagen para comprobar que el bloque sigue funcionando.
:::`,
  },
  gallery: {
    label: "Galería",
    markdown: `:::rda-gallery variant="landscape" columns="2" title="Galería editorial"
- image: https://placehold.co/1200x675?text=Galeria+1
  alt: Imagen genérica de galería 1
  title: Vista 1
  credit: Fuente autorizada / licencia editorial
- image: https://placehold.co/1200x675?text=Galeria+2
  alt: Imagen genérica de galería 2
  title: Vista 2
  credit: Fuente autorizada / licencia editorial
- image: https://placehold.co/1200x675?text=Galeria+3
  alt: Imagen genérica de galería 3
  title: Vista 3
  credit: Fuente autorizada / licencia editorial
:::`,
  },
};

const instructions = [
  "Sube/importa imágenes legales desde el admin si quieres alojarlas en R2.",
  "Copia la URL pública o snippet de la imagen.",
  "Pégala en este editor.",
  "Previsualiza.",
  "Copia el Markdown final.",
  "Pégalo en contentMarkdown del admin.",
  "Guarda como borrador y revisa antes de publicar.",
];

export function VisualBlockComposer() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("grid-poster");
  const [markdown, setMarkdown] = useState(templates["grid-poster"].markdown);
  const [copyStatus, setCopyStatus] = useState("");

  const previewMarkdown = useMemo(
    () => `Texto de artículo antes del bloque.\n\n${markdown}\n\nTexto de artículo después del bloque.`,
    [markdown],
  );

  function loadTemplate(templateKey: TemplateKey) {
    setSelectedTemplate(templateKey);
    setMarkdown(templates[templateKey].markdown);
    setCopyStatus("");
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus("Markdown copiado.");
    } catch {
      setCopyStatus("No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.");
    }
  }

  return (
    <div className="visual-composer">
      <section className="visual-composer__intro" aria-labelledby="visual-composer-title">
        <p className="editorial-kicker">Herramienta interna</p>
        <h1 id="visual-composer-title">Editor de bloques visuales</h1>
        <p>
          Compón bloques para artículos, revisa la previsualización real y copia
          el Markdown final para pegarlo en el admin estable.
        </p>
      </section>

      <aside className="visual-composer__notice" aria-label="Aviso legal sobre imágenes">
        {legalNotice}
      </aside>

      <section className="visual-composer__instructions" aria-labelledby="visual-composer-steps">
        <h2 id="visual-composer-steps">Flujo recomendado</h2>
        <ol>
          {instructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ol>
      </section>

      <section className="visual-composer__workspace" aria-label="Compositor de bloques">
        <div className="visual-composer__panel visual-composer__controls">
          <div className="visual-composer__field">
            <span>Tipo de bloque</span>
            <div className="visual-composer__segments" role="group" aria-label="Tipo de bloque">
              {(Object.entries(templates) as Array<[TemplateKey, (typeof templates)[TemplateKey]]>).map(
                ([templateKey, template]) => (
                  <button
                    key={templateKey}
                    type="button"
                    aria-pressed={selectedTemplate === templateKey}
                    onClick={() => loadTemplate(templateKey)}
                  >
                    {template.label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="visual-composer__field">
            <label htmlFor="visual-composer-markdown">Markdown editable</label>
            <textarea
              id="visual-composer-markdown"
              value={markdown}
              onChange={(event) => {
                setMarkdown(event.target.value);
                setCopyStatus("");
              }}
              spellCheck={false}
            />
          </div>

          <div className="visual-composer__actions">
            <button type="button" onClick={copyMarkdown}>
              Copiar Markdown
            </button>
            <p role="status" aria-live="polite">
              {copyStatus}
            </p>
          </div>
        </div>

        <div className="visual-composer__panel visual-composer__preview">
          <div className="visual-composer__preview-header">
            <span>Vista previa real</span>
            <small>Render ArticleMarkdown</small>
          </div>
          <ArticleMarkdown>{previewMarkdown}</ArticleMarkdown>
        </div>
      </section>
    </div>
  );
}
