import { LetterboxdIcon } from "@/components/authors/LetterboxdIcon";
import type { ArticleAuthor } from "@/lib/articles/author";

type AuthorProfileLinksProps = {
  author: ArticleAuthor;
};

export function AuthorProfileLinks({ author }: AuthorProfileLinksProps) {
  if (!author.letterboxdUrl) {
    return null;
  }

  return (
    <section className="author-profile-links" aria-labelledby="author-profile-links-title">
      <h2 id="author-profile-links-title">Perfiles</h2>
      <a
        className="author-profile-link"
        href={author.letterboxdUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <LetterboxdIcon className="author-profile-link__icon" />
        <span>Letterboxd</span>
      </a>
    </section>
  );
}
