import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Article, ArticleCategory } from "./types";
import {
  getApiArticleBySlug,
  getApiPublishedArticles,
  getApiPublishedArticlesByCategory,
  shouldUseApiContent,
} from "./api";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

type ArticleFrontmatter = {
  title?: string;
  excerpt?: string;
  category?: ArticleCategory;
  publishedAt?: string;
  coverImage?: string;
  coverAlt?: string;
  coverCaption?: string;
  coverCredit?: string;
  status?: "published" | "draft";
};

export function getArticleSlugs() {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (shouldUseApiContent()) {
    try {
      const article = await getApiArticleBySlug(slug);
      if (article) {
        return article;
      }
    } catch {
      // Keep the static Markdown site working when the local API is unavailable.
    }
  }

  return getMarkdownArticleBySlug(slug);
}

async function getMarkdownArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, slug, "index.md");

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as ArticleFrontmatter;

  if (
    !frontmatter.title ||
    !frontmatter.excerpt ||
    !frontmatter.category ||
    !frontmatter.publishedAt
  ) {
    throw new Error(`Article "${slug}" is missing required frontmatter.`);
  }

  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    category: frontmatter.category,
    publishedAt: frontmatter.publishedAt,
    coverImage: frontmatter.coverImage,
    coverAlt: frontmatter.coverAlt,
    coverCaption: frontmatter.coverCaption,
    coverCredit: frontmatter.coverCredit,
    status: frontmatter.status ?? "draft",
    contentHtml: processedContent.toString(),
  };
}

export async function getPublishedArticles() {
  if (shouldUseApiContent()) {
    try {
      return await getApiPublishedArticles();
    } catch {
      // Fall back to Markdown so GitHub Pages builds remain independent of the API.
    }
  }

  return getMarkdownPublishedArticles();
}

export async function getPublishedArticlesByCategory(category: ArticleCategory) {
  if (shouldUseApiContent()) {
    try {
      return await getApiPublishedArticlesByCategory(category);
    } catch {
      // Fall back to filtering Markdown articles if the API is offline.
    }
  }

  return (await getMarkdownPublishedArticles()).filter(
    (article) => article.category === category,
  );
}

async function getMarkdownPublishedArticles() {
  const articles = await Promise.all(
    getArticleSlugs().map((slug) => getMarkdownArticleBySlug(slug)),
  );

  return articles
    .filter((article): article is Article => Boolean(article))
    .filter((article) => article.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
