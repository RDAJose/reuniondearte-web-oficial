import path from "node:path";

export const categories = ["cine", "musica", "arte", "libros", "cultura"];
export const statuses = ["draft", "published"];

export function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function sanitizeImageExtension(filename, mimeType = "") {
  const extension = path.extname(filename || "").toLowerCase();
  const allowed = new Map([
    [".jpg", ".jpg"],
    [".jpeg", ".jpg"],
    [".png", ".png"],
    [".webp", ".webp"],
    [".avif", ".avif"],
  ]);

  if (allowed.has(extension)) {
    return allowed.get(extension);
  }

  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/avif") return ".avif";

  return null;
}

export function assertSafeSlug(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("El slug solo puede contener letras, numeros y guiones.");
  }
}

export function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

export function buildArticleMarkdown(article) {
  const frontmatter = [
    "---",
    `title: ${yamlString(article.title)}`,
    `excerpt: ${yamlString(article.excerpt)}`,
    `category: ${yamlString(article.category)}`,
    `publishedAt: ${yamlString(article.publishedAt)}`,
    `coverImage: ${yamlString(article.coverImage || "")}`,
    `coverAlt: ${yamlString(article.coverAlt || "")}`,
    `coverCaption: ${yamlString(article.coverCaption || "")}`,
    `externalUrl: ${yamlString(article.externalUrl || "")}`,
    `videoUrl: ${yamlString(article.videoUrl || "")}`,
    `status: ${yamlString(article.status || "draft")}`,
    "---",
    "",
  ];

  return `${frontmatter.join("\n")}${String(article.body || "").trim()}\n`;
}

export function validateArticleInput(input) {
  const errors = [];
  const title = String(input.title || "").trim();
  const excerpt = String(input.excerpt || "").trim();
  const category = String(input.category || "").trim();
  const publishedAt = String(input.publishedAt || "").trim();
  const status = String(input.status || "draft").trim();
  const body = String(input.body || "").trim();
  const coverAlt = String(input.coverAlt || "").trim();

  if (!title) errors.push("El titulo es obligatorio.");
  if (!excerpt) errors.push("El excerpt/subtitulo es obligatorio.");
  if (!categories.includes(category)) errors.push("La categoria no es valida.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) errors.push("La fecha debe tener formato YYYY-MM-DD.");
  if (!statuses.includes(status)) errors.push("El status no es valido.");
  if (!body) errors.push("El cuerpo en Markdown es obligatorio.");
  if (input.image?.data && !coverAlt) errors.push("El alt text es obligatorio si hay imagen principal.");

  return errors;
}
