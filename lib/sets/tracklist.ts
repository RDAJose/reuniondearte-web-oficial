export type TracklistEntry = { timestamp: string | null; seconds: number | null; text: string };

// Plain text only. Invalid timestamps remain readable, without a seek control.
export function parseTracklist(value: string): TracklistEntry[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const match = /^(\d{1,3}:[0-5]\d(?::[0-5]\d)?)\s+[-–—]\s+(.+)$/.exec(line);
    if (!match) return { timestamp: null, seconds: null, text: line };
    const parts = match[1].split(":").map(Number);
    const seconds = parts.reduce((total, part) => total * 60 + part, 0);
    return { timestamp: match[1], seconds, text: match[2] };
  });
}
