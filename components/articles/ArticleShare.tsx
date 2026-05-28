"use client";

import { useMemo, useState } from "react";

type ArticleShareProps = {
  title: string;
  url: string;
};

export function ArticleShare({ title, url }: ArticleShareProps) {
  const [status, setStatus] = useState("");

  const encoded = useMemo(
    () => ({
      title: encodeURIComponent(title),
      url: encodeURIComponent(url),
    }),
    [title, url],
  );

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Enlace copiado");
    } catch {
      setStatus("No se ha podido copiar el enlace");
    }
  }

  async function shareArticle() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setStatus("Artículo compartido");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await copyUrl();
  }

  return (
    <aside className="article-share" aria-labelledby="article-share-title">
      <div>
        <h2 id="article-share-title">Compartir artículo</h2>
        <p>Envía este texto o guarda el enlace para leerlo después.</p>
      </div>

      <div className="article-share__actions">
        <button type="button" className="article-share__primary" onClick={shareArticle}>
          Compartir
        </button>
        <button type="button" onClick={copyUrl}>
          Copiar enlace
        </button>
        <a
          href={`https://wa.me/?text=${encoded.title}%20${encoded.url}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
        <a href={`mailto:?subject=${encoded.title}&body=${encoded.url}`}>Correo</a>
      </div>

      <p className="article-share__status" aria-live="polite">
        {status}
      </p>
    </aside>
  );
}
