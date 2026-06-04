"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";

type NewsletterSignupProps = {
  variant?: "default" | "compact";
};

const NEWSLETTER_ENDPOINT =
  "https://reuniondearte-api.onrender.com/api/newsletter/subscribe";

const SUCCESS_MESSAGE = "Te hemos enviado un correo para confirmar tu suscripción.";
const ERROR_MESSAGE =
  "No se ha podido completar la suscripción. Inténtalo de nuevo más tarde.";

export function NewsletterSignup({ variant = "default" }: NewsletterSignupProps) {
  const emailId = useId();
  const consentId = useId();
  const [email, setEmail] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<"success" | "error" | "">("");

  const isCompact = variant === "compact";

  async function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !consentAccepted) {
      setStatusKind("error");
      setStatus(ERROR_MESSAGE);
      return;
    }

    setIsSubmitting(true);
    setStatus("");
    setStatusKind("");

    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          consentAccepted,
          website,
        }),
      });

      if (!response.ok) {
        throw new Error("Newsletter subscription failed.");
      }

      setEmail("");
      setConsentAccepted(false);
      setWebsite("");
      setStatusKind("success");
      setStatus(SUCCESS_MESSAGE);
    } catch {
      setStatusKind("error");
      setStatus(ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className={`newsletter-signup newsletter-signup--${variant}`}
      aria-labelledby={isCompact ? undefined : "newsletter-signup-title"}
    >
      <div className="newsletter-signup__intro">
        {isCompact ? (
          <>
            <p className="font-semibold text-stone-950">Newsletter</p>
            <p>Recibe nuevos artículos de Reunión de Arte.</p>
          </>
        ) : (
          <>
            <p className="editorial-kicker">Newsletter</p>
            <h2 id="newsletter-signup-title">
              Recibe nuevos artículos de Reunión de Arte
            </h2>
            <p>
              Cine, arte, música, libros y cultura. Te enviaremos solo avisos de nuevos
              artículos y podrás darte de baja en cualquier momento.
            </p>
          </>
        )}
      </div>

      <form className="newsletter-signup__form" onSubmit={submitNewsletter}>
        <label className="newsletter-signup__email" htmlFor={emailId}>
          <span>Email</span>
          <input
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="newsletter-signup__checkbox" htmlFor={consentId}>
          <input
            id={consentId}
            type="checkbox"
            name="consentAccepted"
            required
            checked={consentAccepted}
            onChange={(event) => setConsentAccepted(event.target.checked)}
          />
          <span>
            Acepto recibir por email comunicaciones editoriales de Reunión de Arte y he
            leído la <Link href="/privacidad">política de privacidad</Link>.
          </span>
        </label>

        <label className="newsletter-signup__honeypot" aria-hidden="true">
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Suscribirme"}
        </button>
      </form>

      <p
        className={`newsletter-signup__status${
          statusKind ? ` newsletter-signup__status--${statusKind}` : ""
        }`}
        aria-live="polite"
      >
        {status}
      </p>
    </section>
  );
}
