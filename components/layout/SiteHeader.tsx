import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-300 bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="w-fit text-stone-950">
          <span className="block font-serif text-2xl font-bold leading-none">
            {siteConfig.name}
          </span>
          <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-stone-500">
            Cultura, crítica y archivo
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="flex w-full min-w-0 flex-wrap gap-x-4 gap-y-2 border-t border-stone-200 pt-3 text-sm font-semibold text-stone-700 md:w-auto md:border-t-0 md:pt-0"
        >
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 py-1 hover:text-stone-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
