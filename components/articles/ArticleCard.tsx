import Image from "next/image";
import Link from "next/link";
import { formatArticleDate } from "@/lib/articles/dates";
import { getArticleImage, getArticleImageAlt } from "@/lib/articles/media";
import type { Article } from "@/lib/articles/types";

type ArticleCardProps = {
  article: Article;
  priority?: boolean;
  variant?: "standard" | "compact";
};

export function ArticleCard({
  article,
  priority = false,
  variant = "standard",
}: ArticleCardProps) {
  const href = `/articulos/${article.slug}`;
  const isCompact = variant === "compact";
  const image = getArticleImage(article);
  const imageAlt = getArticleImageAlt(article);
  const readableDate = formatArticleDate(article.publishedAt);

  return (
    <article className="group min-w-0 border-t border-stone-300 bg-[#fffdf8] pt-4">
      <Link href={href} className="block" aria-label={article.title}>
        {image ? (
          <div className="relative aspect-[4/3] w-full min-w-0 overflow-hidden bg-stone-100 sm:aspect-[16/10]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 520px, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="article-card-placeholder aspect-[4/3] w-full min-w-0 sm:aspect-[16/10]">
            <span>{article.category}</span>
          </div>
        )}
      </Link>

      <div className={isCompact ? "min-w-0 pt-4" : "min-w-0 pt-5"}>
        <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase text-stone-500">
          <Link href={`/categorias/${article.category}`} className="hover:text-stone-950">
            {article.category}
          </Link>
          <span aria-hidden="true" className="h-px w-8 bg-stone-300" />
          {readableDate ? <time dateTime={article.publishedAt}>{readableDate}</time> : null}
        </div>

        <h2
          className={
            isCompact
              ? "article-card-title mt-3 font-serif text-xl font-bold leading-tight text-stone-950"
              : "article-card-title mt-3 font-serif text-2xl font-bold leading-tight text-stone-950 sm:text-3xl"
          }
        >
          <Link href={href} className="underline-offset-4 hover:underline">
            {article.title}
          </Link>
        </h2>

        {article.excerpt ? (
          <p className={isCompact ? "mt-3 text-sm leading-6 text-stone-700" : "mt-4 text-base leading-7 text-stone-700"}>
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
