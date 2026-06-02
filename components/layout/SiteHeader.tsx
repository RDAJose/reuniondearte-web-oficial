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

        <div className="flex w-full min-w-0 flex-col gap-3 border-t border-stone-200 pt-3 md:w-auto md:flex-row md:items-center md:border-t-0 md:pt-0">
          <nav
            aria-label="Navegación principal"
            className="flex min-w-0 flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-stone-700"
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

          <form
            action="/buscar"
            className="relative w-full min-w-0 md:w-44 lg:w-52"
            role="search"
          >
            <input
              aria-label="Buscar artículos"
              className="h-9 w-full border border-stone-300 bg-transparent py-1.5 pl-3 pr-9 text-sm font-medium text-stone-950 outline-none transition placeholder:text-stone-500 focus:border-stone-700"
              name="q"
              placeholder="Buscar"
              type="search"
            />
            <button
              aria-label="Buscar"
              className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-stone-500 transition hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b2418]"
              type="submit"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
