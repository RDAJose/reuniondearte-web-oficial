import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleAuthorBox } from "@/components/articles/ArticleAuthorBox";
import { ArticleMarkdown } from "@/components/articles/ArticleMarkdown";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles/articles";
import { articleAuthor } from "@/lib/articles/author";
import type { Article } from "@/lib/articles/types";

const EMPTY_ARTICLES_PLACEHOLDER = "__sin-articulos-publicados__";

function firstPresent(...values: Array<string | null | undefined>) {
  return values.find((value) => value && value.trim().length > 0);
}

function getArticleImage(article: Article) {
  return firstPresent(
    article.featuredMedia?.publicUrl,
    article.coverImageUrl,
    article.coverImage,
    article.featuredImageUrl,
    article.thumbnailImageUrl,
  );
}

function getArticleImageAlt(article: Article) {
  return (
    firstPresent(
      article.featuredMedia?.altText,
      article.coverAltText,
      article.coverAlt,
    ) ?? article.title
  );
}

function getArticleImageCaption(article: Article) {
  return firstPresent(article.featuredMedia?.caption, article.coverCaption);
}

function getArticleImageCredit(article: Article) {
  return firstPresent(article.featuredMedia?.credit, article.coverCredit);
}

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

  const coverImage = getArticleImage(article);
  const coverAlt = getArticleImageAlt(article);

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: articleAuthor.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [articleAuthor.name],
      images: coverImage
        ? [
            {
              url: coverImage,
              alt: coverAlt,
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

  const coverImage = getArticleImage(article);
  const coverAlt = getArticleImageAlt(article);
  const coverCaption = getArticleImageCaption(article);
  const coverCredit = getArticleImageCredit(article);

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

      {coverImage ? (
        <figure className="mt-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 sm:aspect-[16/9]">
            <Image
              src={coverImage}
              alt={coverAlt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {coverCaption || coverCredit ? (
            <figcaption className="mt-3 text-sm leading-6 text-stone-500">
              {coverCaption}
              {coverCaption && coverCredit ? " " : null}
              {coverCredit ? (
                <span className="font-medium">{coverCredit}</span>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <ArticleAuthorBox publishedAt={article.publishedAt} />

      <ArticleMarkdown>{article.contentMarkdown}</ArticleMarkdown>
    </article>
  );
}
