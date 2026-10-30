import type { MetadataRoute } from "next";
import { getArticleCategories } from "@/lib/articles/categories";
import { getArticleBySlug, getPublishedArticles } from "@/lib/articles/articles";
import { publicAuthors } from "@/lib/articles/author";
import { officialArticleSlugFallbacks } from "@/lib/articles/static-routes";
import type { Article } from "@/lib/articles/types";
import { siteConfig } from "@/lib/config/site";
import { getPublishedSets } from "@/lib/sets/api";

function url(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const fallbackArticles = (
    await Promise.all(officialArticleSlugFallbacks.map((slug) => getArticleBySlug(slug)))
  ).filter((article): article is Article =>
    Boolean(article && article.status === "published"),
  );
  const sitemapArticles = Array.from(
    new Map([...articles, ...fallbackArticles].map((article) => [article.slug, article])).values(),
  );
  const categories = await getArticleCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/articulos/",
    "/sets/",
    "/categorias/",
    "/sobre/",
    "/contacto/",
    "/aviso-legal/",
    "/privacidad/",
    "/cookies/",
  ].map((path) => ({
    url: url(path),
    lastModified: new Date(),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: url(`/categorias/${category.slug}/`),
    lastModified: new Date(),
  }));

  const articleRoutes: MetadataRoute.Sitemap = sitemapArticles.map((article) => ({
    url: url(`/articulos/${article.slug}/`),
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
  }));

  const authorRoutes: MetadataRoute.Sitemap = publicAuthors.map((author) => ({
    url: url(`${author.href}/`),
    lastModified: new Date(),
  }));

  const setRoutes: MetadataRoute.Sitemap = (await getPublishedSets()).map((item) => ({
    url: url(`/sets/${item.id}/`), lastModified: new Date(item.updatedAt),
  }));
  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...authorRoutes, ...setRoutes];
}

export const dynamic = "force-static";
