import { ArticleCard } from "@/components/articles/ArticleCard";
import { getPublishedArticles } from "@/lib/articles/articles";

export default async function ArticulosPage() {
  const articles = await getPublishedArticles();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Archivo editorial</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Artículos
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
        Lecturas, críticas y ensayos publicados en Reunión de Arte. Un archivo
        cultural organizado con criterio editorial, pensado para consultar cine,
        música, arte y libros desde una mirada independiente.
      </p>

      {articles.length === 0 ? (
        <div className="mt-10 border-t border-stone-300 bg-[#fffdf8] pt-6">
          <h2 className="font-serif text-2xl font-bold text-stone-950">
            Archivo en preparación
          </h2>
          <p className="mt-4 leading-7 text-stone-700">
             Estamos preparando nuevas publicaciones revisadas editorialmente. El archivo
             se irá ampliando de forma progresiva con textos seleccionados y contenidos
             organizados por áreas culturales.
          </p>
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
