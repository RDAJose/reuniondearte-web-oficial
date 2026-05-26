import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles/articles";

export default async function ArticulosPage() {
  const articles = await getPublishedArticles();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
        Artículos
      </h1>

      <p className="mt-5 max-w-3xl leading-7 text-neutral-700">
        Archivo editorial limpio de Reunión de Arte. Solo se publican artículos
        revisados, migrados manualmente y ordenados fuera de WordPress.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="rounded-2xl border border-neutral-200 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              {article.category}
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
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
    </section>
  );
}
