import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          {siteConfig.name}
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-700">
          {siteConfig.navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
