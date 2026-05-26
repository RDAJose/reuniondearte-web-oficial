import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/ArticleCard";
import {
  articleCategories,
  getCategoryBySlug,
} from "@/lib/articles/categories";
import { getPublishedArticles } from "@/lib/articles/articles";

export function generateStaticParams() {
  return articleCategories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = (await getPublishedArticles()).filter(
    (article) => article.category === category.slug,
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Categoría</p>

      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        {category.name}
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
        {category.description}
      </p>

      {articles.length === 0 ? (
        <div className="mt-10 border-t border-stone-300 bg-[#fffdf8] pt-6">
          <h2 className="font-serif text-2xl font-bold text-stone-950">
            Archivo en preparación
          </h2>
          <p className="mt-4 leading-7 text-stone-700">
            Todavía no hay artículos publicados en esta categoría. Los textos se
            irán incorporando de forma manual, limpia y revisada.
          </p>
          <Link
            href="/articulos"
            className="mt-6 inline-block rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:border-stone-500"
          >
            Ver archivo general
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {articles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} priority={index === 0} />
          ))}
        </div>
      )}
    </section>
  );
}
