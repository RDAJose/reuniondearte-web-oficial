import { cache } from "react";
import { isSetPage, type MusicSet } from "./contracts";

export function getSetsApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_RDA_API_BASE_URL ?? process.env.RDA_API_BASE_URL
    ?? "https://reuniondearte-api.onrender.com").replace(/\/$/, "");
}

// A fresh build reads the API; never silently export an empty catalogue after an outage.
export const getPublishedSets = cache(async (): Promise<MusicSet[]> => {
  const items: MusicSet[] = [];
  const seen = new Set<number>();
  let before: number | null = null;
  for (let page = 0; page < 1000; page++) {
    const response = await fetch(`${getSetsApiBaseUrl()}/api/sets?limit=50${before ? `&before=${before}` : ""}`, {
      cache: "no-store", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`No se puede exportar SETS: API HTTP ${response.status}. Inicia o actualiza la API con V11 antes de compilar la web.`);
    const data: unknown = await response.json();
    if (!isSetPage(data)) throw new Error("La API de SETS devuelve un contrato no válido. La exportación se ha detenido para conservar el contenido publicado.");
    for (const item of data.items) {
      if (seen.has(item.id) || (before !== null && item.id >= before)) throw new Error("Paginación inconsistente en SETS.");
      seen.add(item.id); items.push(item);
    }
    if (data.nextCursor === null) return items;
    if (!data.items.length || data.nextCursor !== data.items.at(-1)?.id || (before !== null && data.nextCursor >= before)) {
      throw new Error("Cursor no válido en SETS.");
    }
    before = data.nextCursor;
  }
  throw new Error("El archivo SETS supera el límite de esta exportación; revisa su paginación estática.");
});
