import { siteConfig } from "@/lib/config/site";

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
        Contacto
      </h1>
      <p className="mt-6 leading-8 text-neutral-700">
        Para contacto editorial, colaboraciones o consultas relacionadas con
        Reunión de Arte, escribe a:
      </p>
      <p className="mt-4 font-semibold">{siteConfig.email}</p>
    </section>
  );
}
