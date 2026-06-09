export type ArticleCategory = "cine" | "musica" | "arte" | "libros" | "cultura";

export type ArticleAuthorDetails = {
  id?: number;
  name: string;
  slug?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  author?: string | ArticleAuthorDetails | null;
  authorDetails?: ArticleAuthorDetails | null;
  authors?: Array<string | ArticleAuthorDetails> | null;
  publishedAt: string;
  featuredMedia?: {
    publicUrl?: string;
    altText?: string;
    caption?: string;
    credit?: string;
  };
  coverImage?: string;
  coverImageUrl?: string;
  coverAlt?: string;
  coverAltText?: string;
  coverCaption?: string;
  coverCredit?: string;
  featuredImageUrl?: string;
  thumbnailImageUrl?: string;
  canonicalUrl?: string;
  updatedAt?: string;
  status: "published" | "draft";
  contentMarkdown: string;
};
