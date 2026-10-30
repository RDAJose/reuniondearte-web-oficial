export type MusicSet = {
  id: number;
  title: string;
  artist: string;
  description: string;
  credits: string;
  coverUrl: string;
  coverAlt: string;
  coverCredit: string;
  audioUrl: string;
  audioMimeType: string;
  audioSizeBytes: number;
  publishedAt: string;
  updatedAt: string;
  sessionDate: string | null;
  genre: string;
  tracklist: string;
};
export type SetPage = { items: MusicSet[]; nextCursor: number | null };

function safeUrl(value: unknown) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return !url.username && !url.password && (url.protocol === "https:"
      || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)));
  } catch { return false; }
}

export function isMusicSet(value: unknown): value is MusicSet {
  if (!value || typeof value !== "object") return false;
  const item = value as MusicSet;
  return Number.isSafeInteger(item.id) && item.id > 0
    && [item.title, item.artist, item.description, item.credits, item.coverAlt, item.coverCredit, item.audioMimeType, item.genre, item.tracklist].every((v) => typeof v === "string")
    && typeof item.publishedAt === "string" && Number.isFinite(Date.parse(item.publishedAt))
    && typeof item.updatedAt === "string" && Number.isFinite(Date.parse(item.updatedAt))
    && (item.sessionDate === null || (typeof item.sessionDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.sessionDate)))
    && safeUrl(item.audioUrl) && safeUrl(item.coverUrl);
}

export function isSetPage(value: unknown): value is SetPage {
  if (!value || typeof value !== "object") return false;
  const page = value as SetPage;
  return Array.isArray(page.items) && page.items.length <= 50 && page.items.every(isMusicSet)
    && (page.nextCursor === null || (Number.isSafeInteger(page.nextCursor) && page.nextCursor > 0));
}

export function formatSetDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
