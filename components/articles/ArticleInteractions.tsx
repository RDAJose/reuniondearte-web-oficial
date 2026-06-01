"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ArticleInteractionsProps = {
  slug: string;
  title: string;
  apiBaseUrl: string;
};

type InteractionsResponse = {
  likeCount: number;
  commentCount: number;
};

type Comment = {
  id: number;
  publicName: string;
  body: string;
  createdAt: string;
};

const CLIENT_ID_KEY = "rda:anonymous-client-id";

function normalizeApiBaseUrl(apiBaseUrl: string) {
  return apiBaseUrl.replace(/\/$/, "");
}

function formatLikeCount(count: number) {
  return `${count} me gusta`;
}

function getAnonymousClientId() {
  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) {
    return existing;
  }

  const clientId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(CLIENT_ID_KEY, clientId);
  return clientId;
}

export function ArticleInteractions({ slug, title, apiBaseUrl }: ArticleInteractionsProps) {
  const likedKey = `rda:article-liked:${slug}`;
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(() =>
    typeof window === "undefined" ? false : window.localStorage.getItem(likedKey) === "true",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLikePending, setIsLikePending] = useState(false);
  const [isCommentPending, setIsCommentPending] = useState(false);
  const [status, setStatus] = useState("");
  const [publicName, setPublicName] = useState("");
  const [body, setBody] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [website, setWebsite] = useState("");

  const baseUrl = useMemo(() => normalizeApiBaseUrl(apiBaseUrl), [apiBaseUrl]);
  const articlePath = useMemo(() => `/api/articles/${encodeURIComponent(slug)}`, [slug]);

  useEffect(() => {
    let isMounted = true;

    async function loadInteractions() {
      setIsLoading(true);
      setStatus("");

      try {
        const [interactionsResponse, commentsResponse] = await Promise.all([
          fetch(`${baseUrl}${articlePath}/interactions`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${baseUrl}${articlePath}/comments`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!interactionsResponse.ok || !commentsResponse.ok) {
          throw new Error("No se han podido cargar las interacciones.");
        }

        const interactions = (await interactionsResponse.json()) as InteractionsResponse;
        const approvedComments = (await commentsResponse.json()) as Comment[];

        if (!isMounted) {
          return;
        }

        setLikeCount(interactions.likeCount);
        setCommentCount(interactions.commentCount);
        setComments(approvedComments);
      } catch {
        if (isMounted) {
          setStatus("No se han podido cargar las interacciones en este momento.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInteractions();

    return () => {
      isMounted = false;
    };
  }, [articlePath, baseUrl, likedKey]);

  async function toggleLike() {
    const nextLiked = !liked;

    setIsLikePending(true);
    setStatus("");

    try {
      const response = await fetch(`${baseUrl}${articlePath}/likes`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: getAnonymousClientId(),
          liked: nextLiked,
        }),
      });

      if (!response.ok) {
        throw new Error("No se ha podido actualizar el me gusta.");
      }

      const result = (await response.json()) as { liked: boolean; likeCount: number };
      setLiked(result.liked);
      setLikeCount(result.likeCount);
      window.localStorage.setItem(likedKey, String(result.liked));
    } catch {
      setStatus("No se ha podido guardar tu me gusta. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLikePending(false);
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = publicName.trim();
    const trimmedBody = body.trim();

    if (!trimmedName || !trimmedBody || !consentAccepted) {
      setStatus("Completa el nombre, el comentario y la aceptación legal.");
      return;
    }

    setIsCommentPending(true);
    setStatus("");

    try {
      const response = await fetch(`${baseUrl}${articlePath}/comments`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicName: trimmedName,
          body: trimmedBody,
          consentAccepted,
          website,
        }),
      });

      if (!response.ok) {
        throw new Error("No se ha podido enviar el comentario.");
      }

      setPublicName("");
      setBody("");
      setConsentAccepted(false);
      setWebsite("");
      setStatus("Comentario enviado. Quedará visible cuando sea aprobado.");
    } catch {
      setStatus("No se ha podido enviar el comentario. Inténtalo de nuevo más tarde.");
    } finally {
      setIsCommentPending(false);
    }
  }

  return (
    <section className="article-interactions" aria-labelledby="article-interactions-title">
      <div className="article-interactions__header">
        <div>
          <h2 id="article-interactions-title">Participa</h2>
          <p>
            Una lectura tranquila también puede dejar conversación: {formatLikeCount(likeCount)} y{" "}
            {commentCount} {commentCount === 1 ? "comentario aprobado" : "comentarios aprobados"}.
          </p>
        </div>

        <button
          type="button"
          className="article-interactions__like"
          aria-pressed={liked}
          disabled={isLikePending}
          onClick={toggleLike}
        >
          <span>{liked ? "Te gusta" : "Me gusta"}</span>
          <strong>{formatLikeCount(likeCount)}</strong>
        </button>
      </div>

      <div className="article-comments" aria-labelledby="article-comments-title">
        <h3 id="article-comments-title">Comentarios</h3>

        {isLoading ? <p className="article-comments__empty">Cargando comentarios...</p> : null}

        {!isLoading && comments.length === 0 ? (
          <p className="article-comments__empty">Aún no hay comentarios aprobados.</p>
        ) : null}

        {comments.length > 0 ? (
          <ol className="article-comments__list">
            {comments.map((comment) => (
              <li key={comment.id} className="article-comments__item">
                <div className="article-comments__meta">
                  <strong>{comment.publicName}</strong>
                  <time dateTime={comment.createdAt}>
                    {new Intl.DateTimeFormat("es", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(comment.createdAt))}
                  </time>
                </div>
                <p>{comment.body}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <form className="article-comment-form" onSubmit={submitComment}>
        <h3>Enviar un comentario</h3>

        <label>
          <span>Nombre público</span>
          <input
            type="text"
            name="publicName"
            maxLength={80}
            required
            value={publicName}
            onChange={(event) => setPublicName(event.target.value)}
          />
        </label>

        <label>
          <span>Comentario</span>
          <textarea
            name="body"
            maxLength={1500}
            required
            rows={6}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>

        <label className="article-comment-form__checkbox">
          <input
            type="checkbox"
            required
            checked={consentAccepted}
            onChange={(event) => setConsentAccepted(event.target.checked)}
          />
          <span>He leído y acepto el tratamiento de mis datos para enviar este comentario.</span>
        </label>

        <label className="article-comment-form__honeypot" aria-hidden="true">
          <span>Sitio web</span>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>

        <p className="article-comment-form__legal">
          Tu nombre público y comentario se usarán únicamente para gestionar y mostrar comentarios
          en Reunión de Arte tras moderación. No introduzcas datos sensibles. Puedes consultar la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>

        <button type="submit" disabled={isCommentPending}>
          {isCommentPending ? "Enviando..." : "Enviar comentario"}
        </button>
      </form>

      <p className="article-interactions__status" aria-live="polite">
        {status}
      </p>

      <span className="sr-only">{title}</span>
    </section>
  );
}
