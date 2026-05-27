import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles/articles";

const EMPTY_ARTICLES_PLACEHOLDER = "__sin-articulos-publicados__";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();

  if (articles.length === 0) {
    return [{ slug: EMPTY_ARTICLES_PLACEHOLDER }];
  }

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              alt: article.coverAlt || article.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === EMPTY_ARTICLES_PLACEHOLDER) {
    notFound();
  }

  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-14">
      <div className="border-t-2 border-stone-950 pt-5">
        <p className="editorial-kicker">{article.category}</p>

        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
          {article.title}
        </h1>

        <p className="mt-6 text-xl leading-8 text-stone-700">{article.excerpt}</p>

        <time className="mt-5 block text-sm font-medium text-stone-500" dateTime={article.publishedAt}>
          {article.publishedAt}
        </time>
      </div>

      {article.coverImage ? (
        <figure className="mt-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 sm:aspect-[16/9]">
            <Image
              src={article.coverImage}
              alt={article.coverAlt || article.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {article.coverCaption || article.coverCredit ? (
            <figcaption className="mt-3 text-sm leading-6 text-stone-500">
              {article.coverCaption}
              {article.coverCaption && article.coverCredit ? " " : null}
              {article.coverCredit ? (
                <span className="font-medium">{article.coverCredit}</span>
              ) : null}
            </figcaption>
          ) : article.coverAlt ? (
            <figcaption className="mt-3 text-sm leading-6 text-stone-500">
              {article.coverAlt}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div
        className="article-content mt-12 text-[1.12rem] leading-8 text-stone-800 sm:text-xl sm:leading-9"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </article>
  );
}
