import Link from "next/link";
import { ArticleAuthorAvatar } from "@/components/articles/ArticleAuthorAvatar";
import { articleAuthor } from "@/lib/articles/author";
import { formatArticleDate } from "@/lib/articles/dates";

type ArticleAuthorBoxProps = {
  publishedAt?: string;
};

export function ArticleAuthorBox({ publishedAt }: ArticleAuthorBoxProps) {
  const readableDate = publishedAt ? formatArticleDate(publishedAt) : "";

  return (
    <aside aria-label="Autor del artículo">
      <Link className="article-author-box" href={articleAuthor.href}>
        <ArticleAuthorAvatar className="article-author-box__avatar" />

        <span className="article-author-box__body">
          <span className="article-author-box__eyebrow">Autor</span>
          <span className="article-author-box__name">{articleAuthor.name}</span>
          <span className="article-author-box__meta">
            <span>{articleAuthor.role}</span>
            {readableDate ? (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={publishedAt}>Publicado el {readableDate}</time>
              </>
            ) : null}
          </span>
        </span>
      </Link>
    </aside>
  );
}
