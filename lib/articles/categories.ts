import type { ArticleCategory } from "./types";

export const articleCategories: {
  slug: ArticleCategory;
  name: string;
  description: string;
}[] = [
  {
    slug: "cine",
    name: "Cine",
    description: "Crítica, memoria visual, festivales, películas vistas y análisis cultural.",
  },
  {
    slug: "musica",
    name: "Música",
    description: "Álbumes, escenas, artistas, entrevistas y cultura sonora.",
  },
  {
    slug: "arte",
    name: "Arte",
    description: "Pintura, imagen, patrimonio, iconografía y pensamiento visual.",
  },
  {
    slug: "libros",
    name: "Libros",
    description: "Lecturas, ensayos, literatura, librerías y cultura editorial.",
  },
  {
    slug: "cultura",
    name: "Cultura",
    description: "Textos culturales, pensamiento, archivo, relatos y observación contemporánea.",
  },
];

export function getCategoryBySlug(slug: string) {
  return articleCategories.find((category) => category.slug === slug) ?? null;
}
