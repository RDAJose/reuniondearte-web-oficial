export type ArticleCategory = "cine" | "musica" | "arte" | "libros" | "cultura";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  coverImage?: string;
  coverAlt?: string;
  coverCaption?: string;
  coverCredit?: string;
  status: "published" | "draft";
  contentMarkdown: string;
};
