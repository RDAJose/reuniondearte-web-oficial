import Link from "next/link";
import { ArticleAuthorAvatar } from "@/components/articles/ArticleAuthorAvatar";
import { articleAuthor, type ArticleAuthor } from "@/lib/articles/author";
import { formatArticleDate } from "@/lib/articles/dates";

type ArticleAuthorBoxProps = {
  authors?: ArticleAuthor[];
  publishedAt?: string;
};

export function ArticleAuthorBox({
  authors = [articleAuthor],
  publishedAt,
}: ArticleAuthorBoxProps) {
  const readableDate = publishedAt ? formatArticleDate(publishedAt) : "";
  const authorLabel = authors.length > 1 ? "Autores" : "Autor";

  if (authors.length === 1) {
    const author = authors[0];

    return (
      <aside aria-label={`${authorLabel} del artículo`}>
        <Link className="article-author-box" href={author.href}>
          <ArticleAuthorAvatar author={author} className="article-author-box__avatar" />

          <span className="article-author-box__body">
            <span className="article-author-box__eyebrow">{authorLabel}</span>
            <span className="article-author-box__name">{author.name}</span>
            <span className="article-author-box__meta">
              {author.role ? <span>{author.role}</span> : null}
              {readableDate ? (
                <>
                  {author.role ? <span aria-hidden="true">·</span> : null}
                  <time dateTime={publishedAt}>Publicado el {readableDate}</time>
                </>
              ) : null}
            </span>
          </span>
        </Link>
      </aside>
    );
  }

  return (
    <aside className="article-author-boxes" aria-label={`${authorLabel} del artículo`}>
      <p className="article-author-box__eyebrow">{authorLabel}</p>
      <div className="article-author-boxes__list">
        {authors.map((author) => (
          <Link className="article-author-box" href={author.href} key={author.slug}>
            <ArticleAuthorAvatar author={author} className="article-author-box__avatar" />

            <span className="article-author-box__body">
              <span className="article-author-box__name">{author.name}</span>
              {author.role ? (
                <span className="article-author-box__meta">{author.role}</span>
              ) : null}
            </span>
          </Link>
        ))}
      </div>
      {readableDate ? (
        <time className="article-author-box__date" dateTime={publishedAt}>
          Publicado el {readableDate}
        </time>
      ) : null}
    </aside>
  );
}
