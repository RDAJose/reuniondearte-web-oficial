import type { MetadataRoute } from "next";
import { getArticleCategories } from "@/lib/articles/categories";
import { getPublishedArticles } from "@/lib/articles/articles";
import { publicAuthors } from "@/lib/articles/author";
import { siteConfig } from "@/lib/config/site";

function url(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const categories = await getArticleCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/articulos/",
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

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: url(`/articulos/${article.slug}/`),
    lastModified: new Date(article.publishedAt),
  }));

  const authorRoutes: MetadataRoute.Sitemap = publicAuthors.map((author) => ({
    url: url(`${author.href}/`),
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...authorRoutes];
}

export const dynamic = "force-static";
