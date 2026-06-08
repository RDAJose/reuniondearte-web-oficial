import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { articleAuthor, type ArticleAuthor } from "@/lib/articles/author";

type ArticleAuthorAvatarProps = {
  author?: ArticleAuthor;
  className?: string;
  imageSizes?: string;
};

function hasLocalAuthorImage(src: string | undefined) {
  if (!src?.startsWith("/")) {
    return false;
  }

  const imagePath = join(process.cwd(), "public", src);
  return existsSync(imagePath);
}

export function ArticleAuthorAvatar({
  author = articleAuthor,
  className = "",
  imageSizes = "64px",
}: ArticleAuthorAvatarProps) {
  const localImage = hasLocalAuthorImage(author.avatarPath) ? author.avatarPath : undefined;
  const remoteImage = author.avatarUrl?.startsWith("http") ? author.avatarUrl : undefined;

  return (
    <div
      className={`article-author-avatar ${className}`.trim()}
      aria-hidden={!localImage && !remoteImage}
    >
      {localImage ? (
        <Image
          alt={author.name}
          className="article-author-avatar__image"
          fill
          sizes={imageSizes}
          src={localImage}
        />
      ) : remoteImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={author.name} className="article-author-avatar__image" src={remoteImage} />
      ) : (
        <span>{author.initials}</span>
      )}
    </div>
  );
}
