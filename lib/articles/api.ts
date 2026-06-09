import type { Article, ArticleAuthorDetails, ArticleCategory } from "./types";

type ApiArticleSummary = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  category?: string | null;
  author?: string | RawApiAuthor | null;
  authorDetails?: RawApiAuthor | null;
  authors?: Array<string | RawApiAuthor> | null;
  featuredMedia?: {
    publicUrl?: string | null;
    altText?: string | null;
    caption?: string | null;
    credit?: string | null;
  } | null;
  coverImage?: string | null;
  coverAlt?: string | null;
  coverCaption?: string | null;
  coverCredit?: string | null;
  coverImageUrl?: string | null;
  coverAltText?: string | null;
  featuredImageUrl?: string | null;
  thumbnailImageUrl?: string | null;
  canonicalUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

type ApiArticleDetail = ApiArticleSummary & {
  contentHtml?: string | null;
  contentMarkdown?: string | null;
  content?: string | null;
};

type RawApiAuthor = {
  id?: number | null;
  name?: string | null;
  slug?: string | null;
  role?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
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

const PUBLIC_API_BASE_URL = "https://reuniondearte-api.onrender.com";

export function shouldUseApiContent() {
  return process.env.RDA_CONTENT_SOURCE === "api" || Boolean(getApiBaseUrl());
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
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${pathname}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: false },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${pathname}`);
  }

  return response.json() as Promise<T>;
}

function getApiBaseUrl() {
  return process.env.RDA_API_BASE_URL ?? PUBLIC_API_BASE_URL;
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
    author: mapApiAuthorValue(item.author) ?? undefined,
    authorDetails: mapApiAuthorObject(item.authorDetails) ?? undefined,
    authors: item.authors
      ?.map(mapApiAuthorValue)
      .filter((author): author is string | ArticleAuthorDetails => Boolean(author)),
    publishedAt: item.publishedAt ?? "",
    featuredMedia: item.featuredMedia
      ? {
          publicUrl: item.featuredMedia.publicUrl ?? undefined,
          altText: item.featuredMedia.altText ?? undefined,
          caption: item.featuredMedia.caption ?? undefined,
          credit: item.featuredMedia.credit ?? undefined,
        }
      : undefined,
    coverImage: item.coverImage ?? item.coverImageUrl ?? undefined,
    coverImageUrl: item.coverImageUrl ?? undefined,
    coverAlt: item.coverAlt ?? item.coverAltText ?? undefined,
    coverAltText: item.coverAltText ?? undefined,
    coverCaption: item.coverCaption ?? undefined,
    coverCredit: item.coverCredit ?? undefined,
    featuredImageUrl: item.featuredImageUrl ?? undefined,
    thumbnailImageUrl: item.thumbnailImageUrl ?? undefined,
    canonicalUrl: item.canonicalUrl ?? undefined,
    updatedAt: item.updatedAt ?? undefined,
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

function mapApiAuthorValue(
  value: string | RawApiAuthor | null | undefined,
): string | ArticleAuthorDetails | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return mapApiAuthorObject(value);
}

function mapApiAuthorObject(value: RawApiAuthor | null | undefined): ArticleAuthorDetails | null {
  if (!value?.name) {
    return null;
  }

  return {
    id: value.id ?? undefined,
    name: value.name,
    slug: value.slug ?? undefined,
    role: value.role ?? undefined,
    bio: value.bio ?? undefined,
    avatarUrl: value.avatarUrl ?? undefined,
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
