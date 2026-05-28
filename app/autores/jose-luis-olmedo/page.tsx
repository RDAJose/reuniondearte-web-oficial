import type { Metadata } from "next";
import Link from "next/link";
import { ArticleAuthorAvatar } from "@/components/articles/ArticleAuthorAvatar";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getPublishedArticles } from "@/lib/articles/articles";
import { articleAuthor } from "@/lib/articles/author";
import type { Article } from "@/lib/articles/types";

type ArticleWithPossibleAuthor = Article & {
  author?: string | { name?: string; slug?: string } | null;
  authors?: Array<string | { name?: string; slug?: string }> | null;
};

export const metadata: Metadata = {
  title: articleAuthor.name,
  description: articleAuthor.bio,
  alternates: {
    canonical: articleAuthor.href,
  },
};

function matchesAuthorValue(value: ArticleWithPossibleAuthor["author"]) {
  if (!value) {
    return false;
  }

  if (typeof value === "string") {
    return value === articleAuthor.name || value === articleAuthor.slug;
  }

  return value.name === articleAuthor.name || value.slug === articleAuthor.slug;
}

function getArticlesForAuthor(articles: Article[]) {
  const matchedArticles = articles.filter((article) => {
    const articleWithAuthor = article as ArticleWithPossibleAuthor;

    return (
      matchesAuthorValue(articleWithAuthor.author) ||
      articleWithAuthor.authors?.some(matchesAuthorValue)
    );
  });

  return matchedArticles.length > 0 ? matchedArticles : articles;
}

export default async function JoseLuisOlmedoAuthorPage() {
  const publishedArticles = await getPublishedArticles();
  const authorArticles = getArticlesForAuthor(publishedArticles);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-5 sm:py-14">
      <section className="author-profile">
        <ArticleAuthorAvatar
          className="author-profile__avatar"
          imageSizes="(min-width: 640px) 144px, 96px"
        />

        <div className="author-profile__body">
          <p className="editorial-kicker">Autor</p>
          <h1>{articleAuthor.name}</h1>
          <p className="author-profile__role">{articleAuthor.role}</p>
          <p className="author-profile__bio">{articleAuthor.bio}</p>
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
