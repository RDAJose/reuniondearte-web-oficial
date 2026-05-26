import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles/articles";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {article.category}
      </p>

      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
        {article.title}
      </h1>

      <p className="mt-6 text-lg leading-8 text-neutral-700">
        {article.excerpt}
      </p>

      <p className="mt-5 text-sm text-neutral-500">{article.publishedAt}</p>

      {article.coverImage ? (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={article.coverImage}
              alt={article.coverAlt || article.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {article.coverAlt ? (
            <figcaption className="mt-3 text-sm text-neutral-500">
              {article.coverAlt}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div
        className="mt-12 space-y-6 text-lg leading-9 text-neutral-800"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </article>
  );
}