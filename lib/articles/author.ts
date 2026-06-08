import type { Article, ArticleAuthorDetails } from "./types";

export type ArticleAuthor = ArticleAuthorDetails & {
  avatarPath?: string;
  href: string;
  initials: string;
  slug: string;
};

type ArticleAuthorValue =
  | string
  | (Partial<ArticleAuthorDetails> & {
      avatarPath?: string | null;
      href?: string | null;
      initials?: string | null;
    })
  | null
  | undefined;

const localAvatarPathsBySlug: Record<string, string> = {
  "jose-luis-olmedo": "/authors/jose-luis-olmedo.jpg",
  "maria-garcia-santiago": "/authors/maria-garcia-santiago.jpg",
};

const knownAuthors: ArticleAuthor[] = [
  {
    avatarPath: localAvatarPathsBySlug["jose-luis-olmedo"],
    bio: "Creador, desarrollador y editor de Reunión de Arte. Crítica cultural, cine, música y arte.",
    href: "/autores/jose-luis-olmedo",
    initials: "JO",
    name: "José Luis Olmedo Barrionuevo",
    role: "Creador, desarrollador y editor de Reunión de Arte",
    slug: "jose-luis-olmedo",
  },
  {
    bio: "Pintora, amante del arte y el cine, y editora en Reunión de Arte.",
    avatarPath: localAvatarPathsBySlug["maria-garcia-santiago"],
    href: "/autores/maria-garcia-santiago",
    initials: "MG",
    name: "María García Santiago",
    role: "Pintora, amante del arte y el cine, y editora en Reunión de Arte.",
    slug: "maria-garcia-santiago",
  },
];

export const publicAuthors = knownAuthors;
export const articleAuthor = knownAuthors[0];

export function getKnownAuthorBySlug(slug: string) {
  return knownAuthors.find((author) => author.slug === slug) ?? null;
}

export function getArticleAuthors(article: Article): ArticleAuthor[] {
  if (article.authors?.length) {
    const authors = article.authors
      .map((author) => normalizeAuthorValue(author))
      .filter((author): author is ArticleAuthor => Boolean(author));

    if (authors.length > 0) {
      return dedupeAuthors(authors);
    }
  }

  const authorDetails = normalizeAuthorValue(article.authorDetails);
  if (authorDetails) {
    return [authorDetails];
  }

  const author = normalizeAuthorValue(article.author);
  if (author) {
    return [author];
  }

  return [articleAuthor];
}

export function formatAuthorNames(authors: ArticleAuthor[]) {
  const names = authors.map((author) => author.name).filter(Boolean);

  if (names.length <= 1) {
    return names[0] ?? articleAuthor.name;
  }

  if (names.length === 2) {
    return `${names[0]} y ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

export function articleMatchesAuthor(article: Article, author: ArticleAuthor) {
  return getArticleAuthors(article).some((articleAuthorItem) =>
    sameAuthor(articleAuthorItem, author),
  );
}

function normalizeAuthorValue(value: ArticleAuthorValue): ArticleAuthor | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const cleanValue = value.trim();
    if (!cleanValue) {
      return null;
    }

    return withKnownAuthorDefaults({
      href: `/autores/${slugFromName(cleanValue)}`,
      initials: initialsFromName(cleanValue),
      name: cleanValue,
      slug: slugFromName(cleanValue),
    });
  }

  const name = value.name?.trim();
  const slug = value.slug?.trim() || (name ? slugFromName(name) : "");

  if (!name || !slug) {
    return null;
  }

  return withKnownAuthorDefaults({
    avatarPath: value.avatarPath ?? undefined,
    avatarUrl: value.avatarUrl ?? undefined,
    bio: value.bio ?? undefined,
    href: value.href ?? `/autores/${slug}`,
    id: value.id,
    initials: value.initials ?? initialsFromName(name),
    name,
    role: value.role ?? undefined,
    slug,
  });
}

function withKnownAuthorDefaults(author: ArticleAuthor): ArticleAuthor {
  const knownAuthor = knownAuthors.find((known) => sameAuthor(known, author));
  const localAvatarPath = localAvatarPathsBySlug[author.slug];

  if (!knownAuthor) {
    return {
      ...author,
      avatarPath: author.avatarPath ?? localAvatarPath,
    };
  }

  return {
    ...author,
    ...knownAuthor,
    avatarPath: author.avatarPath ?? knownAuthor.avatarPath ?? localAvatarPath,
    avatarUrl: author.avatarUrl ?? knownAuthor.avatarUrl,
    id: author.id ?? knownAuthor.id,
  };
}

function dedupeAuthors(authors: ArticleAuthor[]) {
  const seen = new Set<string>();

  return authors.filter((author) => {
    const key = comparableAuthorKey(author.slug || author.name);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function sameAuthor(left: ArticleAuthor, right: ArticleAuthor) {
  return (
    comparableAuthorKey(left.slug) === comparableAuthorKey(right.slug) ||
    comparableAuthorKey(left.name) === comparableAuthorKey(right.name)
  );
}

function comparableAuthorKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugFromName(name: string) {
  return comparableAuthorKey(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function initialsFromName(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase() || "RA";
}
