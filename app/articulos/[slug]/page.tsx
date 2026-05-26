import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles/articles";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {article.category}
      </p>

      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
        {article.title}
      </h1>

      <p className="mt-6 text-lg leading-8 text-neutral-700">
        {article.excerpt}
      </p>

      <p className="mt-5 text-sm text-neutral-500">{article.publishedAt}</p>

      <div
        className="mt-12 space-y-6 text-lg leading-9 text-neutral-800"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </article>
  );
}