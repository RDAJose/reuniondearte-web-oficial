import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SetsCatalog } from "@/components/sets/SetsCatalog";
import { getPublishedSets, getSetsApiBaseUrl } from "@/lib/sets/api";
import { siteConfig } from "@/lib/config/site";

type Props = { params: Promise<{ id: string }> };
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const params = (await getPublishedSets()).map((item) => ({ id: String(item.id) }));
  // Next 16.2 export rejects an empty parameter list. Reserved ID 0 resolves to
  // notFound() below (noindex), never a session, catalogue link or sitemap entry.
  return params.length ? params : [{ id: "0" }];
}

async function findSet(params: Props["params"]) {
  const { id } = await params;
  const item = (await getPublishedSets()).find((set) => String(set.id) === id);
  if (!item) notFound();
  return item;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await findSet(params);
  const title = `${item.title} · ${item.artist}`;
  const description = item.description.replace(/\s+/g, " ").slice(0, 170);
  return {
    title, description, alternates: { canonical: `/sets/${item.id}/` },
    openGraph: { title, description, url: `/sets/${item.id}/`, siteName: siteConfig.name, locale: "es_ES",
      type: "website", images: [{ url: item.coverUrl, alt: item.coverAlt }] },
    twitter: { card: "summary_large_image", title, description, images: [item.coverUrl] },
  };
}

export default async function SetPage({ params }: Props) {
  const item = await findSet(params);
  return <SetsCatalog apiBaseUrl={getSetsApiBaseUrl()} initialPage={{ items: [item], nextCursor: null }}
    archive={[{ id: item.id, title: item.title, artist: item.artist }]} detailId={item.id} />;
}
