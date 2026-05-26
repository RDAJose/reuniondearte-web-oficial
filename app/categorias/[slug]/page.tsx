import Link from "next/link";
import { notFound } from "next/navigation";
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
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
        Categoría
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950">
        {category.name}
      </h1>

      <p className="mt-5 max-w-3xl leading-7 text-neutral-700">
        {category.description}
      </p>

      {articles.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
            Archivo en preparación
          </h2>
          <p className="mt-4 leading-7 text-neutral-700">
            Todavía no hay artículos publicados en esta categoría. Los textos se
            irán incorporando de forma manual, limpia y revisada.
          </p>
          <Link
            href="/articulos"
            className="mt-6 inline-block rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold"
          >
            Ver archivo general
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                <Link href={`/articulos/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>
              <p className="mt-4 leading-7 text-neutral-700">
                {article.excerpt}
              </p>
              <p className="mt-5 text-sm text-neutral-500">
                {article.publishedAt}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}