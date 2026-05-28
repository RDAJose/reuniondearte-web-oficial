import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { articleAuthor } from "@/lib/articles/author";

type ArticleAuthorBoxProps = {
  publishedAt?: string;
};

function hasLocalAuthorImage() {
  const imagePath = join(process.cwd(), "public", "authors", "jose-luis-olmedo.jpg");
  return existsSync(imagePath);
}

export function ArticleAuthorBox({ publishedAt }: ArticleAuthorBoxProps) {
  const showImage = hasLocalAuthorImage();

  return (
    <aside className="article-author-box" aria-label="Autor del artículo">
      <div className="article-author-box__avatar" aria-hidden={!showImage}>
        {showImage ? (
          <Image
            alt={articleAuthor.name}
            className="object-cover"
            fill
            sizes="64px"
            src={articleAuthor.avatarPath}
          />
        ) : (
          <span>{articleAuthor.initials}</span>
        )}
      </div>

      <div className="article-author-box__body">
        <p className="article-author-box__eyebrow">Autor</p>
        <p className="article-author-box__name">{articleAuthor.name}</p>
        <p className="article-author-box__role">{articleAuthor.role}</p>
        <p className="article-author-box__bio">{articleAuthor.bio}</p>
        {publishedAt ? (
          <time className="article-author-box__date" dateTime={publishedAt}>
            Publicado el {publishedAt}
          </time>
        ) : null}
      </div>
    </aside>
  );
}
