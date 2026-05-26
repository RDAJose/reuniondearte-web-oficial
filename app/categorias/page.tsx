import Link from "next/link";
import { articleCategories } from "@/lib/articles/categories";

export default function CategoriasPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Mapa editorial</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Categorías
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
        Archivo editorial organizado por áreas culturales. Cada categoría reúne
        artículos publicados y revisados manualmente.
      </p>

      <div className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2">
        {articleCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/categorias/${category.slug}`}
            className="border-t border-stone-300 bg-[#fffdf8] pt-5"
          >
            <h2 className="font-serif text-3xl font-bold text-stone-950">
              {category.name}
            </h2>
            <p className="mt-4 leading-7 text-stone-700">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
