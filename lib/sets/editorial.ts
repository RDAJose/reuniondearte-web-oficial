import { remark } from "remark";

// Only simple editorial formatting; raw HTML and embedded media are excluded.
export const mixMarkdownOptions = {
  skipHtml: true,
  allowedElements: ["p", "br", "ul", "ol", "li", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6"],
  unwrapDisallowed: true,
};

type TextNode = { type: string; value?: string; children?: TextNode[] };
const parser = remark();

function plainText(node: TextNode): string {
  if (node.type === "html" || node.type === "image" || node.type === "imageReference") return "";
  if (node.type === "break") return " ";
  if (node.value !== undefined) return node.value;
  const separator = ["root", "list", "listItem", "blockquote"].includes(node.type) ? " " : "";
  return (node.children ?? []).map(plainText).join(separator);
}

export function mixExcerpt(markdown: string, limit = 180): string {
  const tree = parser.parse(markdown);
  // Prefer the opening prose over a repeated title or a bold-only subtitle.
  const opening = tree.children.find((node) => node.type === "paragraph"
    && node.children.some((child) => child.type === "text" && child.value.trim()));
  const text = plainText(opening ?? tree).replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit - 1);
  const boundary = clipped.lastIndexOf(" ");
  return `${(boundary > limit / 2 ? clipped.slice(0, boundary) : clipped).trimEnd()}…`;
}
