import test from "node:test";
import assert from "node:assert/strict";
import { parseTracklist } from "../lib/sets/tracklist.ts";
import { isMusicSet, isSetPage, formatSetDate } from "../lib/sets/contracts.ts";

test("tracklist converts minutes and hours, including zero", () => {
  const tracks = parseTracklist("00:00 - Artista - Inicio\n05:32 - Artista - Canción\n1:11:48 - Artista - Final");
  assert.deepEqual(tracks.map((track) => track.seconds), [0, 332, 4308]);
  assert.equal(tracks[1].text, "Artista - Canción");
});
test("invalid times and markup remain plain text, never seek targets", () => {
  const lines = ["05:99 - Error", "-1:00 - Error", "1:99:00 - Error", "12:10x - Error", "<script>alert(1)</script>"];
  assert.deepEqual(parseTracklist(lines.join("\n")).map((track) => track.seconds), lines.map(() => null));
  assert.equal(parseTracklist(lines.join("\n"))[4].text, lines[4]);
});
test("blank lines, Windows newlines and typographic separators are supported", () => {
  assert.deepEqual(parseTracklist("\r\n  11:48 – Artista - Canción  \r\n\r\nNota editorial"), [
    { timestamp: "11:48", seconds: 708, text: "Artista - Canción" },
    { timestamp: null, seconds: null, text: "Nota editorial" },
  ]);
});
const item = {
  id: 1, title: "Sesión", artist: "DJ", description: "Descripción", credits: "Créditos", coverAlt: "Portada", coverCredit: "Autor",
  coverUrl: "https://media.example.test/cover.png", audioUrl: "https://media.example.test/audio.wav", audioMimeType: "audio/wav",
  audioSizeBytes: 1000, publishedAt: "2026-10-29T12:00:00Z", updatedAt: "2026-10-29T12:00:00Z", sessionDate: "2026-10-28", genre: "House", tracklist: "",
};
test("public contract rejects executable URLs and embedded credentials", () => {
  assert.equal(isMusicSet(item), true);
  for (const audioUrl of ["javascript:alert(1)", "data:audio/wav;base64,AAAA", "https://user:password@media.example.test/a.wav"])
    assert.equal(isMusicSet({ ...item, audioUrl }), false);
  assert.equal(isMusicSet({ ...item, audioUrl: "http://localhost:8087/audio.wav" }), true);
});
test("catalogue validates page size, cursors and date metadata", () => {
  assert.equal(isSetPage({ items: [item], nextCursor: null }), true);
  assert.equal(isSetPage({ items: [item], nextCursor: -1 }), false);
  assert.equal(isSetPage({ items: Array(51).fill(item), nextCursor: null }), false);
  assert.equal(isMusicSet({ ...item, updatedAt: "invalid" }), false);
  assert.equal(formatSetDate("2026-10-28"), "28/10/2026");
});
