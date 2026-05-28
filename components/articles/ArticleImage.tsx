type ArticleImageProps = {
  alt?: string;
  src?: string;
  title?: string;
};

function isSafeImageUrl(src: string) {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function ArticleImage({ alt = "", src, title }: ArticleImageProps) {
  if (!src || !isSafeImageUrl(src)) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Markdown images have arbitrary remote URLs and no intrinsic dimensions.
    <img
      alt={alt}
      className="article-inline-image"
      decoding="async"
      loading="lazy"
      src={src}
      title={title}
    />
  );
}
