import { siteConfig } from "@/lib/config/site";

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Contacto editorial</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Contacto
      </h1>
      <p className="mt-6 border-t border-stone-300 pt-6 leading-8 text-stone-700">
        Para contacto editorial, colaboraciones o consultas relacionadas con
        Reunión de Arte, escribe a:
      </p>
      <p className="mt-4 font-semibold text-stone-950">{siteConfig.email}</p>
    </section>
  );
}
