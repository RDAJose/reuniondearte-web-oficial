import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/app/buscar/SearchResults";
import { getPublishedArticles } from "@/lib/articles/articles";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Búsqueda en el archivo editorial de Reunión de Arte.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage() {
  const articles = await getPublishedArticles();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Archivo editorial</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Buscar
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
        Consulta artículos publicados en Reunión de Arte por título, tema,
        categoría o palabra clave.
      </p>

      <Suspense
        fallback={
          <p className="mt-10 border-t border-stone-300 pt-6 leading-7 text-stone-700">
            Preparando búsqueda editorial...
          </p>
        }
      >
        <SearchResults articles={articles} />
      </Suspense>
    </section>
  );
}
