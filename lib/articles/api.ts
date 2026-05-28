import type { Article, ArticleCategory } from "./types";

type ApiArticleSummary = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  category?: string | null;
  coverImage?: string | null;
  coverAlt?: string | null;
  coverCaption?: string | null;
  coverCredit?: string | null;
  coverImageUrl?: string | null;
  coverAltText?: string | null;
  publishedAt?: string | null;
};

type ApiArticleDetail = ApiArticleSummary & {
  contentHtml?: string | null;
  contentMarkdown?: string | null;
  content?: string | null;
};

export type ApiCategory = {
  slug: ArticleCategory;
  name: string;
  description: string;
};

type RawApiCategory = {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
};

const categoryFallbacks: Record<ArticleCategory, { name: string; description: string }> = {
  cine: {
    name: "Cine",
    description: "Crítica, memoria visual, festivales, películas vistas y análisis cultural.",
  },
  musica: {
    name: "Música",
    description: "Álbumes, escenas, artistas, entrevistas y cultura sonora.",
  },
  arte: {
    name: "Arte",
    description: "Pintura, imagen, patrimonio, iconografía y pensamiento visual.",
  },
  libros: {
    name: "Libros",
    description: "Lecturas, ensayos, literatura, librerías y cultura editorial.",
  },
  cultura: {
    name: "Cultura",
    description: "Textos culturales, pensamiento, archivo, relatos y observación contemporánea.",
  },
};

export function shouldUseApiContent() {
  return process.env.RDA_CONTENT_SOURCE === "api" && Boolean(process.env.RDA_API_BASE_URL);
}

export async function getApiPublishedArticles(): Promise<Article[]> {
  const items = await apiGet<ApiArticleSummary[]>("/api/articles");
  return items.map(mapApiArticleSummary).filter((article): article is Article => Boolean(article));
}

export async function getApiArticleBySlug(slug: string): Promise<Article | null> {
  const item = await apiGet<ApiArticleDetail>(`/api/articles/${encodeURIComponent(slug)}`);
  return mapApiArticleDetail(item);
}

export async function getApiCategories(): Promise<ApiCategory[]> {
  const items = await apiGet<RawApiCategory[]>("/api/categories");
  return items.map(mapApiCategory).filter((category): category is ApiCategory => Boolean(category));
}

export async function getApiPublishedArticlesByCategory(slug: string): Promise<Article[]> {
  const items = await apiGet<ApiArticleSummary[]>(
    `/api/categories/${encodeURIComponent(slug)}/articles`,
  );
  return items.map(mapApiArticleSummary).filter((article): article is Article => Boolean(article));
}

async function apiGet<T>(pathname: string): Promise<T> {
  const baseUrl = process.env.RDA_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("RDA_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${pathname}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: false },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${pathname}`);
  }

  return response.json() as Promise<T>;
}

function mapApiArticleSummary(item: ApiArticleSummary): Article | null {
  if (!item.title || !item.slug) {
    return null;
  }

  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt ?? "",
    category: mapCategorySlug(item.category),
    publishedAt: item.publishedAt ?? "",
    coverImage: item.coverImage ?? item.coverImageUrl ?? undefined,
    coverAlt: item.coverAlt ?? item.coverAltText ?? undefined,
    coverCaption: item.coverCaption ?? undefined,
    coverCredit: item.coverCredit ?? undefined,
    status: "published",
    contentMarkdown: "",
  };
}

async function mapApiArticleDetail(item: ApiArticleDetail): Promise<Article | null> {
  const summary = mapApiArticleSummary(item);
  if (!summary) {
    return null;
  }

  return {
    ...summary,
    contentMarkdown: item.contentMarkdown ?? item.content ?? "",
  };
}

function mapApiCategory(item: RawApiCategory): ApiCategory | null {
  const slug = mapCategorySlug(item.slug);
  const fallback = categoryFallbacks[slug];

  if (!item.slug && !fallback) {
    return null;
  }

  return {
    slug,
    name: item.name ?? fallback?.name ?? slug,
    description: item.description ?? fallback?.description ?? "",
  };
}

function mapCategorySlug(value: string | null | undefined): ArticleCategory {
  const slug = (value ?? "").toLowerCase();
  if (slug === "cine" || slug === "musica" || slug === "arte" || slug === "libros") {
    return slug;
  }
  return "cultura";
}
