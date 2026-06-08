import type { Metadata } from "next";
import { AuthorProfilePage } from "@/components/authors/AuthorProfilePage";
import { getKnownAuthorBySlug, type ArticleAuthor } from "@/lib/articles/author";

const author = getMariaAuthor();

function getMariaAuthor(): ArticleAuthor {
  const author = getKnownAuthorBySlug("maria-garcia-santiago");

  if (!author) {
    throw new Error("Author profile not found: maria-garcia-santiago");
  }

  return author;
}

export const metadata: Metadata = {
  title: author.name,
  description: author.bio,
  alternates: {
    canonical: author.href,
  },
};

export default async function MariaGarciaSantiagoAuthorPage() {
  return <AuthorProfilePage author={author} />;
}
