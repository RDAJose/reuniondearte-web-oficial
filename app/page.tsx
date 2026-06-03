import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getPublishedArticles } from "@/lib/articles/articles";
import { formatArticleDate } from "@/lib/articles/dates";
import { getArticleImage, getArticleImageAlt } from "@/lib/articles/media";

const featuredSections = [
  {
    title: "Cine",
    href: "/categorias/cine",
    description: "Crítica, memoria visual, festivales y análisis cultural.",
  },
  {
    title: "Música",
    href: "/categorias/musica",
    description: "Álbumes, escenas, artistas, entrevistas y cultura sonora.",
  },
  {
    title: "Arte",
    href: "/categorias/arte",
    description: "Imagen, patrimonio, iconografía y pensamiento visual.",
  },
  {
    title: "Libros",
    href: "/categorias/libros",
    description: "Lecturas, ensayo, literatura y cultura editorial.",
  },
];

export default async function Home() {
  const latestArticles = await getPublishedArticles();
  const leadArticle = latestArticles[0];
  const secondaryArticles = latestArticles.slice(1, 4);
  const recentArticles = latestArticles.slice(4, 7);
  const articleFeed = latestArticles.slice(7, 16);
  const leadImage = leadArticle ? getArticleImage(leadArticle) : undefined;
  const leadImageAlt = leadArticle ? getArticleImageAlt(leadArticle) : "";
  const leadDate = leadArticle ? formatArticleDate(leadArticle.publishedAt) : "";

  return (
    <div className="bg-[#fffdf8]">
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-6">
        <Link
          href="/"
          className="group block border-y border-stone-900 py-3.5 text-center no-underline transition-colors duration-200 hover:border-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b2418] sm:py-4"
          aria-label="Ir a la portada de Reunión de Arte"
        >
          <p className="editorial-kicker">Revista cultural independiente</p>
          <h1 className="article-card-title mt-2 font-serif text-[2.35rem] font-bold leading-none text-stone-950 transition-colors duration-200 group-hover:text-[#8b2418] sm:text-5xl">
            Reunión de Arte
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">
            Cine, música, arte y libros con mirada crítica, archivo cuidado y
            lectura clara en móvil y escritorio.
          </p>
        </Link>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-10 sm:px-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.8fr)]">
        <div className="min-w-0">
          <div className="section-heading">
            <p>Portada</p>
          </div>

          {leadArticle ? (
            <article
              className={
                leadImage
                  ? "grid min-w-0 grid-cols-1 gap-6 border-b border-stone-300 pb-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
                  : "border-b border-stone-300 pb-8"
              }
            >
              {leadImage ? (
                <Link
                  href={`/articulos/${leadArticle.slug}`}
                  className="relative aspect-[4/3] w-full min-w-0 overflow-hidden bg-stone-100 md:order-2"
                  aria-label={leadArticle.title}
                >
                  <Image
                    src={leadImage}
                    alt={leadImageAlt}
                    fill
                    preload
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 46vw, 100vw"
                    className="object-cover"
                  />
                </Link>
              ) : null}

              <div className="min-w-0 md:order-1">
                <p className="editorial-kicker">{leadArticle.category}</p>
                <h2 className="article-card-title mt-3 font-serif text-2xl font-bold leading-[1.12] text-stone-950 sm:text-5xl">
                  <Link
                    href={`/articulos/${leadArticle.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {leadArticle.title}
                  </Link>
                </h2>
                {leadArticle.excerpt ? (
                  <p className="mt-5 text-lg leading-8 text-stone-700">
                    {leadArticle.excerpt}
                  </p>
                ) : null}
                {leadDate ? (
                  <time
                    className="mt-5 block text-sm font-medium uppercase tracking-[0.04em] text-stone-500"
                    dateTime={leadArticle.publishedAt}
                  >
                    {leadDate}
                  </time>
                ) : null}
              </div>
            </article>
          ) : (
            <div className="border-b border-stone-300 pb-8">
              <h2 className="font-serif text-4xl font-bold leading-tight text-stone-950">
                Archivo cultural en preparación
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
                La web está lista para publicar artículos revisados en Markdown,
                con imágenes locales, enlaces y estructura editorial estable.
              </p>
            </div>
          )}

          {recentArticles.length > 0 ? (
            <section className="mt-8" aria-labelledby="home-recent-title">
              <div className="section-heading">
                <h2 id="home-recent-title">Más recientes</h2>
                <Link href="/articulos">Ver archivo</Link>
              </div>

              <div className="grid min-w-0 gap-6 sm:grid-cols-2">
                {recentArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="compact" />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="min-w-0 border-t border-stone-900 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="section-heading">
            <p>Destacados</p>
          </div>
          <div className="space-y-6">
            {secondaryArticles.length > 0 ? (
              secondaryArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))
            ) : leadArticle ? (
              <div className="border-t border-stone-300 pt-4">
                <p className="text-sm leading-6 text-stone-700">
                  El archivo irá creciendo con artículos publicados de forma
                  manual, selectiva y revisada.
                </p>
                <Link
                  href="/articulos"
                  className="mt-4 inline-block text-sm font-semibold text-stone-950 underline underline-offset-4"
                >
                  Ver archivo completo
                </Link>
              </div>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="border-y border-stone-300 bg-[#f6f3ec]">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-px px-4 py-8 sm:px-5 md:grid-cols-4">
          {featuredSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="border-t border-stone-300 py-5 md:border-l md:border-t-0 md:px-5"
            >
              <h2 className="font-serif text-2xl font-bold text-stone-950">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {articleFeed.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
          <div className="section-heading">
            <p>Últimas publicaciones</p>
            <Link href="/articulos">Todo el archivo</Link>
          </div>

          <div className="home-article-flow">
            {articleFeed.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="compact"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
