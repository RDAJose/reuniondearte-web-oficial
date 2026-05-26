import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertSafeSlug,
  buildArticleMarkdown,
  sanitizeImageExtension,
  slugify,
  validateArticleInput,
} from "./utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const articlesRoot = path.join(projectRoot, "content", "articles");
const mediaRoot = path.join(projectRoot, "public", "media", "articles");
const port = Number(process.env.ARTICLE_EDITOR_PORT || 4173);

const staticFiles = new Map([
  ["/", { file: "editor.html", type: "text/html; charset=utf-8" }],
  ["/editor.css", { file: "editor.css", type: "text/css; charset=utf-8" }],
  ["/editor.js", { file: "editor.js", type: "text/javascript; charset=utf-8" }],
]);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12 * 1024 * 1024) {
        reject(new Error("La peticion es demasiado grande."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("JSON invalido."));
      }
    });
    request.on("error", reject);
  });
}

async function serveStatic(request, response) {
  const route = staticFiles.get(new URL(request.url, "http://localhost").pathname);

  if (!route) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const filePath = path.join(__dirname, route.file);
  const contents = await fs.readFile(filePath);
  response.writeHead(200, {
    "content-type": route.type,
    "cache-control": "no-store",
  });
  response.end(contents);
}

async function createArticle(request, response) {
  const input = await readJson(request);
  const errors = validateArticleInput(input);

  const slug = slugify(input.slug || input.title || "");
  if (!slug) errors.push("No se pudo generar un slug valido.");

  if (errors.length > 0) {
    sendJson(response, 400, { ok: false, errors });
    return;
  }

  assertSafeSlug(slug);

  const articleDir = path.join(articlesRoot, slug);
  const mediaDir = path.join(mediaRoot, slug);

  if (existsSync(articleDir)) {
    sendJson(response, 409, {
      ok: false,
      errors: [`Ya existe un articulo con el slug "${slug}". No se ha sobrescrito nada.`],
    });
    return;
  }

  let coverImage = "";
  if (input.image?.data) {
    const extension = sanitizeImageExtension(input.image.name, input.image.type);
    if (!extension) {
      sendJson(response, 400, {
        ok: false,
        errors: ["Formato de imagen no permitido. Usa jpg, png, webp o avif."],
      });
      return;
    }

    const imageBuffer = Buffer.from(String(input.image.data), "base64");
    if (imageBuffer.length > 8 * 1024 * 1024) {
      sendJson(response, 400, {
        ok: false,
        errors: ["La imagen supera 8 MB. Comprimela antes de guardarla."],
      });
      return;
    }

    await fs.mkdir(mediaDir, { recursive: true });
    await fs.writeFile(path.join(mediaDir, `cover${extension}`), imageBuffer, { flag: "wx" });
    coverImage = `/media/articles/${slug}/cover${extension}`;
  }

  await fs.mkdir(articleDir, { recursive: false });
  const markdown = buildArticleMarkdown({
    title: String(input.title).trim(),
    excerpt: String(input.excerpt).trim(),
    category: String(input.category).trim(),
    publishedAt: String(input.publishedAt).trim(),
    status: String(input.status || "draft").trim(),
    body: String(input.body || "").trim(),
    coverImage,
    coverAlt: String(input.coverAlt || "").trim(),
    coverCaption: String(input.coverCaption || "").trim(),
    externalUrl: String(input.externalUrl || "").trim(),
    videoUrl: String(input.videoUrl || "").trim(),
  });

  await fs.writeFile(path.join(articleDir, "index.md"), markdown, { flag: "wx" });

  sendJson(response, 201, {
    ok: true,
    slug,
    articlePath: path.relative(projectRoot, path.join(articleDir, "index.md")).replaceAll(path.sep, "/"),
    coverImage,
  });
}

const server = http.createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url || "/", "http://localhost");

    if (request.method === "POST" && pathname === "/api/articles") {
      await createArticle(request, response);
      return;
    }

    if (request.method === "GET") {
      await serveStatic(request, response);
      return;
    }

    response.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
    response.end("Method not allowed");
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      errors: [error instanceof Error ? error.message : "Error inesperado."],
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Editor local de articulos: http://127.0.0.1:${port}`);
  console.log("Guarda borradores en content/articles/ y media en public/media/articles/.");
  console.log("Pulsa Ctrl+C para cerrar.");
});
