import type { Article } from "./types";

export function firstPresent(...values: Array<string | null | undefined>) {
  return values.find((value) => value && value.trim().length > 0);
}

export function getArticleImage(article: Article) {
  return firstPresent(
    article.featuredMedia?.publicUrl,
    article.coverImageUrl,
    article.coverImage,
    article.featuredImageUrl,
    article.thumbnailImageUrl,
  );
}

export function getArticleImageAlt(article: Article) {
  return (
    firstPresent(
      article.featuredMedia?.altText,
      article.coverAltText,
      article.coverAlt,
    ) ?? article.title
  );
}

export function getArticleImageCaption(article: Article) {
  return firstPresent(article.featuredMedia?.caption, article.coverCaption);
}

export function getArticleImageCredit(article: Article) {
  return firstPresent(article.featuredMedia?.credit, article.coverCredit);
}
