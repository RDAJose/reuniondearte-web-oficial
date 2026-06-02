"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/articles/ArticleCard";
import type { Article } from "@/lib/articles/types";

type SearchResultsProps = {
  articles: Article[];
};

type ArticleWithTags = Article & {
  tags?: unknown;
};

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getTagsText(tags: unknown) {
  if (Array.isArray(tags)) {
    return tags.filter((tag) => typeof tag === "string").join(" ");
  }

  return typeof tags === "string" ? tags : "";
}

function getArticleSearchText(article: Article) {
  const articleWithTags = article as ArticleWithTags;

  return normalizeSearchText(
    [
      article.title,
      article.excerpt,
      article.category,
      getTagsText(articleWithTags.tags),
      article.contentMarkdown,
    ].join(" "),
  );
}

function getUniqueArticles(articles: Article[]) {
  return Array.from(
    articles
      .reduce((uniqueArticles, article) => {
        if (!uniqueArticles.has(article.slug)) {
          uniqueArticles.set(article.slug, article);
        }

        return uniqueArticles;
      }, new Map<string, Article>())
      .values(),
  );
}

export function SearchResults({ articles }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") ?? "";
  const query = rawQuery.replace(/\s+/g, " ").trim();
  const normalizedQuery = normalizeSearchText(query);

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const terms = normalizedQuery.split(" ").filter(Boolean);

    return getUniqueArticles(articles).filter((article) => {
      const searchText = getArticleSearchText(article);
      return (
        searchText.includes(normalizedQuery) ||
        terms.every((term) => searchText.includes(term))
      );
    });
  }, [articles, normalizedQuery]);

  return (
    <>
      <form action="/buscar" className="mt-8 max-w-2xl" role="search">
        <label
          className="text-sm font-bold uppercase tracking-[0.06em] text-stone-600"
          htmlFor="search-page-query"
        >
          Buscar en el archivo
        </label>
        <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row">
          <input
            className="min-h-11 min-w-0 flex-1 border border-stone-300 bg-transparent px-3 py-2 text-base text-stone-950 outline-none transition placeholder:text-stone-500 focus:border-stone-700"
            defaultValue={query}
            id="search-page-query"
            name="q"
            placeholder="Título, tema, categoría o palabra clave"
            type="search"
          />
          <button
            className="min-h-11 border border-stone-950 bg-stone-950 px-5 py-2 text-sm font-bold uppercase tracking-[0.06em] text-[#fffdf8] transition hover:bg-[#8b2418] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b2418]"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </form>

      {!normalizedQuery ? (
        <p className="mt-10 max-w-3xl border-t border-stone-300 pt-6 leading-7 text-stone-700">
          Busca en el archivo editorial de Reunión de Arte por título, tema,
          categoría o palabra clave.
        </p>
      ) : results.length > 0 ? (
        <section className="mt-10" aria-labelledby="search-results-title">
          <div className="section-heading">
            <h2 id="search-results-title">
              {results.length === 1 ? "1 resultado" : `${results.length} resultados`}
            </h2>
            <Link href="/articulos">Todo el archivo</Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {results.map((article, index) => (
              <ArticleCard
                key={article.slug}
                article={article}
                priority={index === 0}
                variant="compact"
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10 border-t border-stone-300 pt-6">
          <p className="max-w-3xl leading-7 text-stone-700">
            No se han encontrado artículos para esta búsqueda. Prueba con otro
            término o explora las categorías.
          </p>
          <Link
            className="mt-5 inline-block text-sm font-bold uppercase tracking-[0.06em] text-stone-950 underline underline-offset-4"
            href="/categorias"
          >
            Explorar categorías
          </Link>
        </div>
      )}
    </>
  );
}
