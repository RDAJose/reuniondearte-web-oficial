import Link from "next/link";
import { articleCategories } from "@/lib/articles/categories";

export default function CategoriasPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
        Categorías
      </h1>

      <p className="mt-5 max-w-3xl leading-7 text-neutral-700">
        Archivo editorial organizado por áreas culturales. Cada categoría reúne
        artículos publicados y revisados manualmente.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {articleCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/categorias/${category.slug}`}
            className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              {category.name}
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
