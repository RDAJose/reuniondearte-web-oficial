import type { MusicSet } from "./contracts";

export function remainingMixes(items: MusicSet[], featuredId?: number) {
  return items.filter((item) => item.id !== featuredId);
}

export function refreshedSelection(current: MusicSet | null, items: MusicSet[], preservePlayback: boolean) {
  // A refresh may bring a new publication. Do not interrupt an intentional listen.
  return preservePlayback && current ? current : items[0] ?? null;
}

export function mergeMixes(previous: MusicSet[], incoming: MusicSet[]) {
  return [...new Map([...previous, ...incoming].map((item) => [item.id, item])).values()];
}
