import type { Metadata } from "next";
import { AuthorProfilePage } from "@/components/authors/AuthorProfilePage";
import { getKnownAuthorBySlug, type ArticleAuthor } from "@/lib/articles/author";

const author = getFranciscoAuthor();

function getFranciscoAuthor(): ArticleAuthor {
  const author = getKnownAuthorBySlug("francisco-manuel-luque-martinez");

  if (!author) {
    throw new Error("Author profile not found: francisco-manuel-luque-martinez");
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

export default async function FranciscoManuelLuqueMartinezAuthorPage() {
  return <AuthorProfilePage author={author} />;
}
