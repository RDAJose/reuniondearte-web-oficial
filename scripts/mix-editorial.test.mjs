import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { mixExcerpt, mixMarkdownOptions } from "../lib/sets/editorial.ts";

const render = (children) => renderToStaticMarkup(createElement(ReactMarkdown, mixMarkdownOptions, children));

test("mix editorial renders paragraphs, line breaks, lists and emphasis", () => {
  const html = render("Un **mix** con *calma*.\nSegunda línea.\n\nOtro párrafo.\n\n- Uno\n- Dos\n\n1. Tres\n2. Cuatro");
  assert.match(html, /<p>Un <strong>mix<\/strong> con <em>calma<\/em>\.\nSegunda línea\.<\/p>/);
  assert.match(html, /<p>Otro párrafo\.<\/p>/);
  assert.match(html, /<ul>\n<li>Uno<\/li>\n<li>Dos<\/li>\n<\/ul>/);
  assert.match(html, /<ol>/);
  assert.match(render("Uno  \nDos"), /<br\/>/);
});

test("mix editorial excludes raw HTML, executable links and embedded media", () => {
  const html = render('<script>alert(1)</script>\n\n<img src=x onerror=alert(2)>\n\n[Escuchar](javascript:alert%283%29) ![Portada](https://example.com/p.png)\n\nTexto **seguro**.');
  assert.doesNotMatch(html, /script|onerror|javascript:|<img|<a\b|alert\(/);
  assert.match(html, /Escuchar/);
  assert.match(html, /Texto <strong>seguro<\/strong>/);
});

test("excerpts prefer opening prose and fall back to lists or formatted text", () => {
  assert.equal(mixExcerpt("# Un **mix**\n\n**Subtítulo**\n\nCon *calma* y [música](https://example.com).\n\n- Uno\n- Dos"), "Con calma y música.");
  assert.equal(mixExcerpt("Primera línea\r\nSegunda línea\r\n\r\nTercer párrafo."), "Primera línea Segunda línea");
  assert.equal(mixExcerpt("- Uno\n- Dos"), "Uno Dos");
  assert.equal(mixExcerpt("**Un mix**"), "Un mix");
  assert.equal(mixExcerpt("![Portada](https://example.com/a.png)\n\nTexto"), "Texto");
  const excerpt = mixExcerpt("Un recorrido musical para escuchar con calma. ".repeat(20));
  assert.ok(excerpt.length <= 180);
  assert.ok(excerpt.endsWith("…"));
  assert.equal(mixExcerpt("Breve."), "Breve.");
});
