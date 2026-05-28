export type ArticleCategory = "cine" | "musica" | "arte" | "libros" | "cultura";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
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
  status: "published" | "draft";
  contentMarkdown: string;
};
