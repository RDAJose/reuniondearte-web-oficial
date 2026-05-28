type ArticleLinkCardProps = {
  url: string;
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ArticleLinkCard({ url }: ArticleLinkCardProps) {
  const domain = getDomain(url);

  return (
    <a
      className="article-link-card"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="article-link-card__label">Abrir enlace</span>
      <span className="article-link-card__domain">{domain}</span>
      <span className="article-link-card__url">{url}</span>
    </a>
  );
}
