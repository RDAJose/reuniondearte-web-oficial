import type { CSSProperties, ReactNode } from "react";
import {
  ArticleImageLightbox,
  type ArticleLightboxImage,
} from "@/components/articles/ArticleImageLightbox";

type VisualBlockKind = "rda-gallery" | "rda-grid" | "rda-ranking";
type GridVariant = "landscape" | "poster" | "square";

type VisualBlockAttrs = Record<string, string>;
type VisualBlockItem = Record<string, string>;

export type ParsedArticleMarkdownPart =
  | {
      content: string;
      type: "markdown";
    }
  | {
      attrs: VisualBlockAttrs;
      items: VisualBlockItem[];
      kind: VisualBlockKind;
      type: "visual";
    };

type VisualImageProps = {
  alt?: string;
  aspect: GridVariant;
  className: string;
  credit?: string;
  href?: string;
  image?: string;
  lightboxIndex?: number;
  sizes: string;
  title?: string;
};

const visualBlockNames = new Set<VisualBlockKind>([
  "rda-gallery",
  "rda-grid",
  "rda-ranking",
]);

const allowedGridVariants = new Set<GridVariant>([
  "landscape",
  "poster",
  "square",
]);

function clampColumns(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return String(Math.min(6, Math.max(2, parsed)));
}

function getVisualBlockTitle(attrs: VisualBlockAttrs) {
  return attrs.title?.trim() || undefined;
}

function getGridVariant(value: string | undefined): GridVariant {
  return allowedGridVariants.has(value as GridVariant)
    ? (value as GridVariant)
    : "poster";
}

function unquoteAttribute(value: string) {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if (
    (quote === `"` || quote === "'") &&
    trimmed.length >= 2 &&
    trimmed[trimmed.length - 1] === quote
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function parseDirectiveAttributes(value: string): VisualBlockAttrs {
  const attrs: VisualBlockAttrs = {};
  const attributePattern = /([A-Za-z][\w-]*)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;
  let match = attributePattern.exec(value);

  while (match) {
    attrs[match[1]] = (match[2] ?? match[3] ?? match[4] ?? "").trim();
    match = attributePattern.exec(value);
  }

  return attrs;
}

function parseVisualItems(value: string) {
  const items: VisualBlockItem[] = [];
  let currentItem: VisualBlockItem | null = null;
  let currentKey: string | null = null;

  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      currentKey = null;
      continue;
    }

    const itemMatch = line.match(/^\s*-\s+([A-Za-z][\w-]*)\s*:\s*(.*)$/);

    if (itemMatch) {
      currentItem = {};
      items.push(currentItem);
      currentKey = itemMatch[1];
      currentItem[currentKey] = unquoteAttribute(itemMatch[2]);
      continue;
    }

    const fieldMatch = line.match(/^\s+([A-Za-z][\w-]*)\s*:\s*(.*)$/);

    if (fieldMatch && currentItem) {
      currentKey = fieldMatch[1];
      currentItem[currentKey] = unquoteAttribute(fieldMatch[2]);
      continue;
    }

    if (currentItem && currentKey && /^\s{2,}\S/.test(line)) {
      currentItem[currentKey] = `${currentItem[currentKey]} ${line.trim()}`.trim();
    }
  }

  return items.filter((item) =>
    Object.values(item).some((itemValue) => itemValue.trim().length > 0),
  );
}

export function parseArticleMarkdownParts(markdown: string): ParsedArticleMarkdownPart[] {
  const parts: ParsedArticleMarkdownPart[] = [];
  const lines = markdown.split(/\r?\n/);
  let markdownBuffer: string[] = [];
  let index = 0;

  function flushMarkdownBuffer() {
    const content = markdownBuffer.join("\n");

    if (content.trim()) {
      parts.push({ content, type: "markdown" });
    }

    markdownBuffer = [];
  }

  while (index < lines.length) {
    const openingMatch = lines[index].match(
      /^:::(rda-gallery|rda-grid|rda-ranking)\b(.*)$/,
    );

    if (!openingMatch || !visualBlockNames.has(openingMatch[1] as VisualBlockKind)) {
      markdownBuffer.push(lines[index]);
      index += 1;
      continue;
    }

    const body: string[] = [];
    let closingIndex = -1;

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (lines[cursor].trim() === ":::") {
        closingIndex = cursor;
        break;
      }

      body.push(lines[cursor]);
    }

    if (closingIndex === -1) {
      markdownBuffer.push(lines[index]);
      index += 1;
      continue;
    }

    flushMarkdownBuffer();
    parts.push({
      attrs: parseDirectiveAttributes(openingMatch[2]),
      items: parseVisualItems(body.join("\n")),
      kind: openingMatch[1] as VisualBlockKind,
      type: "visual",
    });
    index = closingIndex + 1;
  }

  flushMarkdownBuffer();

  return parts.length > 0 ? parts : [{ content: markdown, type: "markdown" }];
}

function isSafeInternalPath(value: string) {
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

export function getSafeArticleUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (isSafeInternalPath(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function getExternalLinkProps(href: string | undefined) {
  return href && /^https?:\/\//i.test(href)
    ? { rel: "noopener noreferrer", target: "_blank" }
    : {};
}

function fallbackAlt(item: VisualBlockItem) {
  return item.alt?.trim() || item.title?.trim() || "Imagen editorial";
}

function getLightboxCaption(item: VisualBlockItem) {
  return item.title || item.caption || undefined;
}

function getLightboxImages(items: VisualBlockItem[]) {
  const images: ArticleLightboxImage[] = [];
  const itemIndexes = new Map<VisualBlockItem, number>();

  for (const item of items) {
    const safeImage = getSafeArticleUrl(item.image);

    if (!safeImage) {
      continue;
    }

    itemIndexes.set(item, images.length);
    images.push({
      alt: fallbackAlt(item),
      credit: item.credit || undefined,
      src: safeImage,
      title: getLightboxCaption(item),
    });
  }

  return { images, itemIndexes };
}

function VisualImage({
  alt,
  aspect,
  className,
  credit,
  href,
  image,
  lightboxIndex,
  sizes,
  title,
}: VisualImageProps) {
  const safeImage = getSafeArticleUrl(image);
  const safeHref = getSafeArticleUrl(href);
  return (
    <figure className={className} data-aspect={aspect}>
      {safeImage ? (
        <button
          aria-label={`Ampliar ${alt ?? title ?? "imagen editorial"}`}
          className={`${className}__media`}
          data-lightbox-index={lightboxIndex}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Article body images can use editor-provided remote URLs and must keep static export compatibility. */}
          <img
            alt={alt ?? "Imagen editorial"}
            decoding="async"
            loading="lazy"
            sizes={sizes}
            src={safeImage}
          />
        </button>
      ) : (
        <div className={`${className}__media`}>
          <span>Sin imagen</span>
        </div>
      )}

      {(title || credit || safeHref) && (
        <figcaption>
          {title && (
            <strong>
              {safeHref ? (
                <a href={safeHref} {...getExternalLinkProps(safeHref)}>
                  {title}
                </a>
              ) : (
                title
              )}
            </strong>
          )}
          {!title && safeHref && (
            <a
              className={`${className}__caption-link`}
              href={safeHref}
              {...getExternalLinkProps(safeHref)}
            >
              Abrir enlace
            </a>
          )}
          {credit && <cite>{credit}</cite>}
        </figcaption>
      )}
    </figure>
  );
}

function withLightbox(children: ReactNode, images: ArticleLightboxImage[]) {
  if (images.length === 0) {
    return children;
  }

  return <ArticleImageLightbox images={images}>{children}</ArticleImageLightbox>;
}

function VisualRankingImage({
  alt,
  image,
  lightboxIndex,
}: {
  alt: string;
  image?: string;
  lightboxIndex?: number;
}) {
  const safeImage = getSafeArticleUrl(image);

  return (
    <div className="rda-ranking-item__media">
      {safeImage ? (
        <button
          aria-label={`Ampliar ${alt}`}
          className="rda-ranking-item__media-button"
          data-lightbox-index={lightboxIndex}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Article ranking images can use editor-provided remote URLs and must keep static export compatibility. */}
          <img
            alt={alt}
            decoding="async"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 11rem"
            src={safeImage}
          />
        </button>
      ) : (
        <span>Sin imagen</span>
      )}
    </div>
  );
}

export function ArticleVisualBlock({
  attrs,
  items,
  kind,
}: Extract<ParsedArticleMarkdownPart, { type: "visual" }>) {
  if (kind === "rda-ranking") {
    return <ArticleRankingBlock attrs={attrs} items={items} />;
  }

  if (kind === "rda-gallery") {
    return <ArticleGalleryBlock attrs={attrs} items={items} />;
  }

  return <ArticleGridBlock attrs={attrs} items={items} />;
}

function ArticleGridBlock({
  attrs,
  items,
}: Pick<Extract<ParsedArticleMarkdownPart, { type: "visual" }>, "attrs" | "items">) {
  const title = getVisualBlockTitle(attrs);
  const variant = getGridVariant(attrs.variant);
  const columns = clampColumns(attrs.columns);
  const style = columns ? ({ "--rda-grid-columns": columns } as CSSProperties) : undefined;
  const { images, itemIndexes } = getLightboxImages(items);

  if (items.length === 0) {
    return null;
  }

  return withLightbox(
    <section className="rda-visual-block rda-grid-block" data-variant={variant}>
      {title && <h2>{title}</h2>}
      <div className="rda-grid-block__items" style={style}>
        {items.map((item, index) => (
          <VisualImage
            key={`${item.image ?? item.title ?? "grid"}-${index}`}
            alt={fallbackAlt(item)}
            aspect={variant}
            className="rda-grid-card"
            credit={item.credit}
            href={item.href}
            image={item.image}
            lightboxIndex={itemIndexes.get(item)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            title={item.title || item.caption}
          />
        ))}
      </div>
    </section>,
    images,
  );
}

function ArticleGalleryBlock({
  attrs,
  items,
}: Pick<Extract<ParsedArticleMarkdownPart, { type: "visual" }>, "attrs" | "items">) {
  const title = getVisualBlockTitle(attrs);
  const variant = getGridVariant(attrs.variant ?? "landscape");
  const columns = clampColumns(attrs.columns);
  const style = columns ? ({ "--rda-grid-columns": columns } as CSSProperties) : undefined;
  const { images, itemIndexes } = getLightboxImages(items);

  if (items.length === 0) {
    return null;
  }

  return withLightbox(
    <section className="rda-visual-block rda-gallery-block" data-variant={variant}>
      {title && <h2>{title}</h2>}
      <div className="rda-gallery-block__items" style={style}>
        {items.map((item, index) => (
          <VisualImage
            key={`${item.image ?? item.title ?? "gallery"}-${index}`}
            alt={fallbackAlt(item)}
            aspect={variant}
            className="rda-gallery-card"
            credit={item.credit}
            href={item.href}
            image={item.image}
            lightboxIndex={itemIndexes.get(item)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"
            title={item.title || item.caption}
          />
        ))}
      </div>
    </section>,
    images,
  );
}

function ArticleRankingBlock({
  attrs,
  items,
}: Pick<Extract<ParsedArticleMarkdownPart, { type: "visual" }>, "attrs" | "items">) {
  const title = getVisualBlockTitle(attrs);
  const { images, itemIndexes } = getLightboxImages(items);

  if (items.length === 0) {
    return null;
  }

  return withLightbox(
    <section className="rda-visual-block rda-ranking-block">
      {title && <h2>{title}</h2>}
      <ol className="rda-ranking-block__items">
        {items.map((item, index) => {
          const safeHref = getSafeArticleUrl(item.href);
          const rank = item.rank?.trim() || String(index + 1);

          return (
            <li
              key={`${rank}-${item.title ?? "ranking"}-${index}`}
              className="rda-ranking-item"
            >
              <span className="rda-ranking-item__rank">{rank}</span>

              {item.image && (
                <VisualRankingImage
                  alt={fallbackAlt(item)}
                  image={item.image}
                  lightboxIndex={itemIndexes.get(item)}
                />
              )}

              <div className="rda-ranking-item__body">
                <h3>
                  {safeHref ? (
                    <a href={safeHref} {...getExternalLinkProps(safeHref)}>
                      {item.title || "Obra sin titulo"}
                    </a>
                  ) : (
                    item.title || "Obra sin titulo"
                  )}
                </h3>

                {(item.year || item.creator) && (
                  <p className="rda-ranking-item__meta">
                    {[item.year, item.creator].filter(Boolean).join(" / ")}
                  </p>
                )}

                {item.text && <p>{item.text}</p>}

                {item.credit && <cite>{item.credit}</cite>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>,
    images,
  );
}
