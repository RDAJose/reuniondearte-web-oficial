import Link from "next/link";
import { ArticleAuthorAvatar } from "@/components/articles/ArticleAuthorAvatar";
import { ArticleCard } from "@/components/articles/ArticleCard";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles/articles";
import {
  articleMatchesAuthor,
  type ArticleAuthor,
} from "@/lib/articles/author";
import type { Article } from "@/lib/articles/types";

type AuthorProfilePageProps = {
  author: ArticleAuthor;
};

const authorArticleSlugFallbacks: Record<string, string[]> = {
  "maria-garcia-santiago": ["peliculas-ambientadas-en-hoteles"],
};

export async function AuthorProfilePage({ author }: AuthorProfilePageProps) {
  const authorArticles = await getArticlesForAuthor(author);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-5 sm:py-14">
      <section className="author-profile">
        <ArticleAuthorAvatar
          author={author}
          className="author-profile__avatar"
          imageSizes="(min-width: 640px) 144px, 96px"
        />

        <div className="author-profile__body">
          <p className="editorial-kicker">Autor</p>
          <h1>{author.name}</h1>
          {author.role ? <p className="author-profile__role">{author.role}</p> : null}
          {author.bio ? <p className="author-profile__bio">{author.bio}</p> : null}
        </div>
      </section>

      <section className="mt-12">
        <div className="section-heading">
          <p>Artículos publicados</p>
          <Link href="/articulos">Ver todos</Link>
        </div>

        {authorArticles.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {authorArticles.map((article, index) => (
              <ArticleCard
                key={article.slug}
                article={article}
                priority={index < 2}
              />
            ))}
          </div>
        ) : (
          <p className="border-t border-stone-300 pt-5 text-stone-600">
            Todavía no hay artículos publicados.
          </p>
        )}
      </section>
    </main>
  );
}

async function getArticlesForAuthor(author: ArticleAuthor) {
  const publishedArticles = await getPublishedArticles();
  const summaryMatches = publishedArticles.filter((article) =>
    articleMatchesAuthor(article, author),
  );

  if (summaryMatches.length > 0) {
    return summaryMatches;
  }

  const fallbackSlugs = authorArticleSlugFallbacks[author.slug] ?? [];
  const candidateSlugs = Array.from(
    new Set([...publishedArticles.map((article) => article.slug), ...fallbackSlugs]),
  );
  const detailedArticles = await Promise.all(candidateSlugs.map(getArticleBySlug));

  return detailedArticles
    .filter((article): article is Article => Boolean(article))
    .filter((article) => article.status === "published")
    .filter((article) => articleMatchesAuthor(article, author));
}
