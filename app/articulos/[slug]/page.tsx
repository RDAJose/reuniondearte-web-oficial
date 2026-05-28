import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleAuthorBox } from "@/components/articles/ArticleAuthorBox";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleMarkdown } from "@/components/articles/ArticleMarkdown";
import { ArticleShare } from "@/components/articles/ArticleShare";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles/articles";
import { articleAuthor } from "@/lib/articles/author";
import {
  getArticleImage,
  getArticleImageAlt,
  getArticleImageCaption,
  getArticleImageCredit,
} from "@/lib/articles/media";
import { siteConfig } from "@/lib/config/site";

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
  const relatedArticles = (await getPublishedArticles())
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const articleUrl = new URL(`/articulos/${article.slug}/`, siteConfig.url).toString();

  return (
    <main className="article-detail">
      <article className="article-detail__article">
        <header className="article-hero">
          <div className="article-hero__meta">
            <Link className="editorial-kicker" href={`/categorias/${article.category}`}>
              {article.category}
            </Link>
            <span aria-hidden="true" />
            <time dateTime={article.publishedAt}>{article.publishedAt}</time>
          </div>

          <h1>{article.title}</h1>

          {article.excerpt ? (
            <p className="article-hero__excerpt">{article.excerpt}</p>
          ) : null}

          <p className="article-hero__byline">Por {articleAuthor.name}</p>
        </header>

        {coverImage ? (
          <figure className="article-cover">
            <div className="article-cover__image">
              <Image
                src={coverImage}
                alt={coverAlt}
                fill
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
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
          <ArticleAuthorBox publishedAt={article.publishedAt} />

          <ArticleMarkdown>{article.contentMarkdown}</ArticleMarkdown>

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
