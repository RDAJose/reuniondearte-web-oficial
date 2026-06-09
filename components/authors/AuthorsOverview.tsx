import Link from "next/link";
import { ArticleAuthorAvatar } from "@/components/articles/ArticleAuthorAvatar";
import { LetterboxdIcon } from "@/components/authors/LetterboxdIcon";
import { publicAuthors } from "@/lib/articles/author";

export function AuthorsOverview() {
  return (
    <section className="authors-overview" aria-labelledby="authors-overview-title">
      <div className="section-heading">
        <h2 id="authors-overview-title">Autores de Reunión de Arte</h2>
      </div>

      <div className="authors-overview__grid">
        {publicAuthors.map((author) => (
          <article className="authors-overview-card" key={author.slug}>
            <ArticleAuthorAvatar
              author={author}
              className="authors-overview-card__avatar"
              imageSizes="72px"
            />

            <div className="authors-overview-card__body">
              <h3>{author.name}</h3>
              {author.role ? <p>{author.role}</p> : null}
            </div>

            <div className="authors-overview-card__actions">
              <Link className="authors-overview-card__link" href={author.href}>
                Ver perfil
              </Link>
              {author.letterboxdUrl ? (
                <a
                  className="authors-overview-card__link"
                  href={author.letterboxdUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <LetterboxdIcon className="authors-overview-card__icon" />
                  <span>Letterboxd</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
