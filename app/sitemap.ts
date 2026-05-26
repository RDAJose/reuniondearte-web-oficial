import type { MetadataRoute } from "next";
import { articleCategories } from "@/lib/articles/categories";
import { getPublishedArticles } from "@/lib/articles/articles";
import { siteConfig } from "@/lib/config/site";

function url(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();

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

  const categoryRoutes: MetadataRoute.Sitemap = articleCategories.map((category) => ({
    url: url(`/categorias/${category.slug}/`),
    lastModified: new Date(),
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: url(`/articulos/${article.slug}/`),
    lastModified: new Date(article.publishedAt),
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}

export const dynamic = "force-static";
