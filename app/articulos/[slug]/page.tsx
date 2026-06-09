import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleAuthorBox } from "@/components/articles/ArticleAuthorBox";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleInteractions } from "@/components/articles/ArticleInteractions";
import { ArticleMarkdown } from "@/components/articles/ArticleMarkdown";
import { ArticleShare } from "@/components/articles/ArticleShare";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles/articles";
import { officialArticleSlugFallbacks } from "@/lib/articles/static-routes";
import { formatAuthorNames, getArticleAuthors } from "@/lib/articles/author";
import { formatArticleDate } from "@/lib/articles/dates";
import type { Article } from "@/lib/articles/types";
import {
  getArticleImage,
  getArticleImageAlt,
  getArticleImageCaption,
  getArticleImageCredit,
} from "@/lib/articles/media";
import { siteConfig } from "@/lib/config/site";

const EMPTY_ARTICLES_PLACEHOLDER = "__sin-articulos-publicados__";
const PUBLIC_API_BASE_URL = "https://reuniondearte-api.onrender.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  const slugs = Array.from(
    new Set(
      [...articles.map((article) => article.slug), ...officialArticleSlugFallbacks]
        .map((slug) => normalizeStaticSlug(slug))
        .filter((slug): slug is string => Boolean(slug)),
    ),
  );

  if (slugs.length === 0) {
    return [{ slug: EMPTY_ARTICLES_PLACEHOLDER }];
  }

  return slugs.map((slug) => ({
    slug,
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
  const articleAuthors = getArticleAuthors(article);
  const authorNames = articleAuthors.map((author) => author.name);
  const canonicalPath = `/articulos/${article.slug}/`;

  return {
    title: article.title,
    description: article.excerpt,
    authors: articleAuthors.map((author) => ({ name: author.name })),
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalPath,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: authorNames,
      images: coverImage
        ? [
            {
              url: coverImage,
              alt: coverAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: coverImage ? "summary_large_image" : "summary",
      title: article.title,
      description: article.excerpt,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articleSlug = normalizeStaticSlug(slug);

  if (!articleSlug || articleSlug === EMPTY_ARTICLES_PLACEHOLDER) {
    notFound();
  }

  const article = await getArticleBySlug(articleSlug);

  if (!article || article.status !== "published") {
    notFound();
  }

  const coverImage = getArticleImage(article);
  const coverAlt = getArticleImageAlt(article);
  const coverCaption = getArticleImageCaption(article);
  const coverCredit = getArticleImageCredit(article);
  const relatedArticles = (await getPublishedArticles())
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const articleUrl = new URL(`/articulos/${articleSlug}/`, siteConfig.url).toString();
  const apiBaseUrl = process.env.RDA_API_BASE_URL ?? PUBLIC_API_BASE_URL;
  const readableDate = formatArticleDate(article.publishedAt);
  const articleAuthors = getArticleAuthors(article);
  const jsonLd = getArticleJsonLd({
    article,
    articleAuthors,
    articleUrl,
    coverImage,
  });

  return (
    <main className="article-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbs) }}
      />
      <article className="article-detail__article">
        <header className="article-hero">
          <div className="article-hero__meta">
            <Link className="editorial-kicker" href={`/categorias/${article.category}`}>
              {article.category}
            </Link>
            {readableDate ? (
              <>
                <span aria-hidden="true" />
                <time dateTime={article.publishedAt}>{readableDate}</time>
              </>
            ) : null}
          </div>

          <h1>{article.title}</h1>

          {article.excerpt ? (
            <p className="article-hero__excerpt">{article.excerpt}</p>
          ) : null}

          <p className="article-hero__byline">Por {formatAuthorNames(articleAuthors)}</p>
        </header>

        {coverImage ? (
          <figure className="article-cover">
            <div className="article-cover__image">
              <Image
                src={coverImage}
                alt={coverAlt}
                fill
                preload
                sizes="(min-width: 1120px) 1088px, (min-width: 768px) calc(100vw - 2.5rem), 100vw"
                className="article-cover__img"
              />
            </div>
            {coverCaption || coverCredit ? (
              <figcaption>
                {coverCaption ? <span>{coverCaption}</span> : null}
                {coverCaption && coverCredit ? <span aria-hidden="true"> / </span> : null}
                {coverCredit ? <cite>{coverCredit}</cite> : null}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="article-shell">
          <ArticleAuthorBox authors={articleAuthors} publishedAt={article.publishedAt} />

          <ArticleMarkdown>{article.contentMarkdown}</ArticleMarkdown>

          <ArticleInteractions slug={articleSlug} title={article.title} apiBaseUrl={apiBaseUrl} />

          <ArticleShare title={article.title} url={articleUrl} />
        </div>
      </article>

      {relatedArticles.length > 0 ? (
        <section className="article-related" aria-labelledby="article-related-title">
          <div className="section-heading">
            <h2 id="article-related-title">Más en Reunión de Arte</h2>
            <Link href="/articulos">Todo el archivo</Link>
          </div>

          <div className="article-related__grid">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.slug}
                article={relatedArticle}
                variant="compact"
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function normalizeStaticSlug(slug: string | null | undefined) {
  const cleanSlug = slug?.trim().replace(/^\/?articulos\//, "").replace(/^\/+|\/+$/g, "");
  return cleanSlug || null;
}

type ArticleJsonLdInput = {
  article: Article;
  articleAuthors: ReturnType<typeof getArticleAuthors>;
  articleUrl: string;
  coverImage?: string | null;
};

function getArticleJsonLd({
  article,
  articleAuthors,
  articleUrl,
  coverImage,
}: ArticleJsonLdInput) {
  const dateModified = article.updatedAt ?? article.publishedAt;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: coverImage ? [coverImage] : undefined,
    datePublished: article.publishedAt,
    dateModified,
    author: articleAuthors.map((author) => ({
      "@type": "Person",
      name: author.name,
      url: new URL(`${author.href}/`, siteConfig.url).toString(),
    })),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artículos",
        item: new URL("/articulos/", siteConfig.url).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return {
    article: articleJsonLd,
    breadcrumbs: breadcrumbsJsonLd,
  };
}
