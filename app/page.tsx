import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { getPublishedArticles } from "@/lib/articles/articles";
import { formatArticleDate } from "@/lib/articles/dates";
import { getArticleImage, getArticleImageAlt } from "@/lib/articles/media";
import styles from "./home.module.css";

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
    <div className={styles.home}>
      <section className="mx-auto max-w-6xl px-4 py-3 sm:px-5">
        <Link
          href="/"
          className={`${styles.intro} block border-y border-stone-900 py-2 text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b2418]`}
          aria-label="Ir a la portada de Reunión de Arte"
        >
          <p className="editorial-kicker">Revista cultural independiente</p>
          <h1 className="article-card-title mt-1 font-serif text-2xl font-bold leading-tight text-stone-950 sm:text-3xl">
            Reunión de Arte
          </h1>
          <p className="mx-auto mt-1 max-w-2xl text-sm leading-5 text-stone-600">
            Cine, música, arte y libros con mirada crítica, archivo cuidado y
            lectura clara en móvil y escritorio.
          </p>
        </Link>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-7 sm:px-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(16rem,0.8fr)]">
        <div className="min-w-0">
          <div className="section-heading">
            <p>Portada</p>
          </div>

          {leadArticle ? (
            <article
              className={
                leadImage
                  ? styles.lead
                  : styles.leadTextOnly
              }
            >
              {leadImage ? (
                <Link
                  href={`/articulos/${leadArticle.slug}`}
                  className={`article-lead-media ${styles.leadMedia} relative aspect-[4/3] w-full min-w-0 overflow-hidden`}
                  aria-label={leadArticle.title}
                >
                  <Image
                    src={leadImage}
                    alt={leadImageAlt}
                    fill
                    preload
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 46vw, 100vw"
                    className="article-lead-media__img"
                  />
                </Link>
              ) : null}

              <div className={styles.leadBody}>
                <p className="editorial-kicker">{leadArticle.category}</p>
                <h2 className={`article-card-title ${styles.leadTitle} mt-2 font-serif font-bold text-stone-950`}>
                  <Link
                    href={`/articulos/${leadArticle.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {leadArticle.title}
                  </Link>
                </h2>
                {leadArticle.excerpt ? (
                  <p className={styles.leadExcerpt}>
                    {leadArticle.excerpt}
                  </p>
                ) : null}
                {leadDate ? (
                  <time
                    className="mt-3 block text-xs font-medium uppercase tracking-[0.04em] text-stone-600"
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
            <section className="mt-5" aria-labelledby="home-recent-title">
              <div className="section-heading">
                <h2 id="home-recent-title">Más recientes</h2>
                <Link href="/articulos">Ver archivo</Link>
              </div>

              <div className={`${styles.recent} grid min-w-0 gap-5 sm:grid-cols-2`}>
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
          <div className={styles.secondary}>
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
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-px px-4 py-4 sm:px-5 md:grid-cols-4">
          {featuredSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="border-t border-stone-300 py-3 md:border-l md:border-t-0 md:px-5"
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

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-5">
        <NewsletterSignup />
      </section>

      {articleFeed.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-3 sm:px-5">
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
