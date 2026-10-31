import type { Metadata } from "next";
import { SetsCatalog } from "@/components/sets/SetsCatalog";
import { getPublishedSets, getSetsApiBaseUrl } from "@/lib/sets/api";
import { siteConfig } from "@/lib/config/site";

// Export fresh API content into HTML without a persistent Next fetch cache.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mixes",
  description: "Sesiones musicales de Reunión de Arte. Selecciones para escuchar con tiempo, de principio a fin.",
  alternates: { canonical: "/sets/" },
  openGraph: {
    title: "Mixes · Reunión de Arte", description: "Sesiones musicales, DJs y selecciones de Reunión de Arte.",
    url: "/sets/", siteName: siteConfig.name, locale: "es_ES", type: "website",
  },
  twitter: { card: "summary", title: "Mixes · Reunión de Arte", description: "Sesiones musicales, DJs y selecciones de Reunión de Arte." },
};

export default async function SetsPage() {
  const sets = await getPublishedSets();
  const initialPage = { items: sets.slice(0, 12), nextCursor: sets.length > 12 ? sets[11].id : null };
  return <SetsCatalog apiBaseUrl={getSetsApiBaseUrl()} initialPage={initialPage}
    archive={sets.map(({ id, title, artist }) => ({ id, title, artist }))} />;
}
