import Link from "next/link";
import { ArticleAuthorAvatar } from "@/components/articles/ArticleAuthorAvatar";
import { articleAuthor } from "@/lib/articles/author";

type ArticleAuthorBoxProps = {
  publishedAt?: string;
};

export function ArticleAuthorBox({ publishedAt }: ArticleAuthorBoxProps) {
  return (
    <aside aria-label="Autor del artículo">
      <Link className="article-author-box" href={articleAuthor.href}>
        <ArticleAuthorAvatar className="article-author-box__avatar" />

        <span className="article-author-box__body">
          <span className="article-author-box__eyebrow">Autor</span>
          <span className="article-author-box__name">{articleAuthor.name}</span>
          <span className="article-author-box__role">{articleAuthor.role}</span>
          <span className="article-author-box__bio">{articleAuthor.bio}</span>
          {publishedAt ? (
            <time className="article-author-box__date" dateTime={publishedAt}>
              Publicado el {publishedAt}
            </time>
          ) : null}
        </span>
      </Link>
    </aside>
  );
}
