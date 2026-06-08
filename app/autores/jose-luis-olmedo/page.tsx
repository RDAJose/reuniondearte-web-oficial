import type { Metadata } from "next";
import { AuthorProfilePage } from "@/components/authors/AuthorProfilePage";
import { articleAuthor } from "@/lib/articles/author";

export const metadata: Metadata = {
  title: articleAuthor.name,
  description: articleAuthor.bio,
  alternates: {
    canonical: articleAuthor.href,
  },
};

export default async function JoseLuisOlmedoAuthorPage() {
  return <AuthorProfilePage author={articleAuthor} />;
}
