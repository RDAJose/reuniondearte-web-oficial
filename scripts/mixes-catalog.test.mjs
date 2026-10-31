import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mergeMixes, refreshedSelection, remainingMixes } from "../lib/sets/catalog.ts";

// Render the real component with Node's test runner and the installed TS compiler.
// Only Next's link/image adapters and CSS imports are replaced for this SSR test.
const root = new URL("../", import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.startsWith("mix-test:")) return next(specifier, { ...context, parentURL: import.meta.url });
    if (["next/image", "next/link"].includes(specifier)) return { url: `mix-test:${specifier}`, shortCircuit: true };
    const local = specifier.startsWith("@/") ? new URL(specifier.slice(2), root)
      : specifier.startsWith(".") && context.parentURL?.startsWith(root.href) ? new URL(specifier, context.parentURL) : null;
    if (local) {
      for (const suffix of ["", ".tsx", ".ts"]) {
        const url = new URL(local.href + suffix);
        if (existsSync(fileURLToPath(url))) return { url: url.href, shortCircuit: true };
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith("mix-test:")) return {
      format: "module", shortCircuit: true,
      source: `import { createElement } from 'react'; export default function Adapter(props) {
        const clean = {...props}; delete clean.unoptimized; delete clean.prefetch;
        return createElement('${url.endsWith("image") ? "img" : "a"}', clean);
      }`,
    };
    if (url.endsWith(".css")) return { format: "module", shortCircuit: true, source: "export default new Proxy({}, {get: (_, key) => key});" };
    if (url.startsWith(root.href) && /\.tsx?$/.test(url) && !url.includes("/node_modules/")) return {
      format: "module", shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText,
    };
    return next(url, context);
  },
});
const { SetsCatalog } = await import("../components/sets/SetsCatalog.tsx");
const mix = (id) => ({
  id, title: `Mix de prueba ${id}`, artist: "Artista", description: "Una descripción **editorial**.\n\nSegundo párrafo.",
  credits: "Grabado por el artista.", coverUrl: "https://example.com/cover.jpg", coverAlt: "Portada", coverCredit: "Autor de portada",
  audioUrl: `https://example.com/${id}.wav`, audioMimeType: "audio/wav", audioSizeBytes: 1000,
  publishedAt: "2026-10-29T12:00:00Z", updatedAt: "2026-10-29T12:00:00Z", sessionDate: "2026-10-29", genre: "House", tracklist: "00:00 - Inicio\n01:00 - Continuación",
});
const render = (items, { archive = items, detailId, nextCursor = null } = {}) => renderToStaticMarkup(createElement(SetsCatalog, {
  apiBaseUrl: "https://example.com", initialPage: { items, nextCursor }, archive, detailId,
}));

test("empty catalogue has no empty player or duplicate section", () => {
  const html = render([]);
  assert.match(html, /El archivo está por sonar/);
  assert.doesNotMatch(html, /aria-label="Reproductor de mixes"|Mixes publicados|Más mixes/);
});

test("one mix renders one cover and one main record, with metadata preload", () => {
  const html = render([mix(1)]);
  assert.equal((html.match(/<img\b/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<article|sets-catalog-title/);
  assert.match(html, /<audio[^>]*preload="metadata"/);
  assert.match(html, /Duración pendiente de cargar/);
  assert.doesNotMatch(html, /autoPlay|autoplay|Duración total 0:00/);
});

test("multiple mixes keep the featured mix out of the remaining catalogue", () => {
  const html = render([mix(3), mix(2), mix(1)]);
  assert.equal((html.match(/<img\b/g) ?? []).length, 3);
  assert.equal((html.match(/<article\b/g) ?? []).length, 2);
  assert.match(html, /Más mixes/);
  assert.doesNotMatch(html.slice(html.indexOf("<article")), /Mix de prueba 3/);
});

test("newly published mixes appear and can be played without linking to an unbuilt page", () => {
  const old = mix(1), incoming = [mix(3), mix(2), old];
  const featured = refreshedSelection(old, incoming, false);
  assert.equal(featured.id, 3);
  assert.deepEqual(remainingMixes(incoming, featured.id).map(({ id }) => id), [2, 1]);
  const html = render(incoming, { archive: [old] });
  assert.match(html, /Mix de prueba 3/);
  assert.match(html, /aria-label="Escuchar Mix de prueba 2"/);
  assert.match(html, /href="\/sets\/1\/"/);
  assert.doesNotMatch(html, /href="\/sets\/[23]\//);
});

test("refresh preserves an intentional listen, pagination deduplicates, empty refresh clears idle selection", () => {
  const current = mix(1), incoming = [mix(2), current];
  assert.equal(refreshedSelection(current, incoming, true), current);
  assert.equal(refreshedSelection(current, [], false), null);
  assert.equal(refreshedSelection(null, incoming, true).id, 2);
  assert.deepEqual(mergeMixes(incoming, [current, mix(4)]).map(({ id }) => id), [2, 1, 4]);
});

test("detail preserves reading order, full text and tracklist with one cover", () => {
  const html = render([mix(1)], { detailId: 1, archive: [mix(2), mix(1)] });
  assert.equal((html.match(/<img\b/g) ?? []).length, 1);
  const sections = ['<h1>', 'aria-label="Reproductor de mixes"', 'id="tracklist-title"', 'id="about-mix-title"', 'id="other-mixes-title"'].map((text) => html.indexOf(text));
  assert.ok(sections.every((index, i) => index >= 0 && (i === 0 || index > sections[i - 1])));
  assert.match(html, /Una descripción <strong>editorial<\/strong>/);
  assert.match(html, /Segundo párrafo/);
  assert.match(html, /Reproducir desde 01:00: Continuación/);
});
