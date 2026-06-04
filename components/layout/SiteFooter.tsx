import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-300 bg-[#f6f3ec]">
      <div className="mx-auto grid max-w-6xl gap-9 px-4 py-10 text-sm text-stone-700 sm:px-5 md:grid-cols-[1.5fr_0.8fr_0.8fr_1.4fr]">
        <div>
          <p className="font-serif text-2xl font-bold text-stone-950">{siteConfig.name}</p>
          <p className="mt-3 max-w-xl leading-7">{siteConfig.description}</p>
        </div>

        <div>
          <p className="font-semibold text-stone-950">Secciones</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/articulos">Artículos</Link>
            <Link href="/categorias">Categorías</Link>
            <Link href="/suscribirse">Suscribirse</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-stone-950">Legal</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>

        <NewsletterSignup variant="compact" />
      </div>
    </footer>
  );
}
