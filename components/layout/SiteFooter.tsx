import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm text-neutral-700 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-semibold text-neutral-950">{siteConfig.name}</p>
          <p className="mt-3 max-w-xl leading-6">{siteConfig.description}</p>
        </div>

        <div>
          <p className="font-semibold text-neutral-950">Secciones</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/articulos">Artículos</Link>
            <Link href="/categorias">Categorías</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-neutral-950">Legal</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
