import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { articleAuthor } from "@/lib/articles/author";

type ArticleAuthorAvatarProps = {
  className?: string;
  imageSizes?: string;
};

function hasLocalAuthorImage() {
  const imagePath = join(process.cwd(), "public", "authors", "jose-luis-olmedo.jpg");
  return existsSync(imagePath);
}

export function ArticleAuthorAvatar({
  className = "",
  imageSizes = "64px",
}: ArticleAuthorAvatarProps) {
  const showImage = hasLocalAuthorImage();

  return (
    <div
      className={`article-author-avatar ${className}`.trim()}
      aria-hidden={!showImage}
    >
      {showImage ? (
        <Image
          alt={articleAuthor.name}
          className="article-author-avatar__image"
          fill
          sizes={imageSizes}
          src={articleAuthor.avatarPath}
        />
      ) : (
        <span>{articleAuthor.initials}</span>
      )}
    </div>
  );
}
