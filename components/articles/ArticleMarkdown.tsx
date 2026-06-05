import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArticleEmbed,
  ArticleMedia,
  getArticleEmbed,
  getArticleMedia,
  type MediaDefinition,
  type MediaType,
} from "@/components/articles/ArticleEmbed";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLinkCard } from "@/components/articles/ArticleLinkCard";
import {
  ArticleVisualBlock,
  getSafeArticleUrl,
  parseArticleMarkdownParts,
} from "@/components/articles/ArticleVisualBlocks";

type ArticleMarkdownProps = {
  children: string;
};

const standaloneUrlPattern = /^https?:\/\/[^\s<>"']+$/i;
const mediaLinkPattern = /^(audio|video)\s*:\s*(.*)$/i;

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

function getStandaloneUrl(children: ReactNode) {
  const childList = Children.toArray(children);

  if (childList.length !== 1) {
    return null;
  }

  const onlyChild = childList[0];
  const text = getTextContent(onlyChild).trim();

  if (!standaloneUrlPattern.test(text)) {
    return null;
  }

  if (isValidElement<{ href?: string }>(onlyChild)) {
    return onlyChild.props.href === text ? text : null;
  }

  return text;
}

function getStandaloneMediaLink(children: ReactNode): MediaDefinition | null {
  const childList = Children.toArray(children);

  if (childList.length !== 1) {
    return null;
  }

  const onlyChild = childList[0];

  if (!isValidElement<{ children?: ReactNode; href?: string }>(onlyChild)) {
    return null;
  }

  const href = onlyChild.props.href;

  if (!href) {
    return null;
  }

  const match = getTextContent(onlyChild.props.children).trim().match(mediaLinkPattern);

  if (!match) {
    return null;
  }

  return getArticleMedia(href, match[1].toLowerCase() as MediaType, match[2]);
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function stringAttribute(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

const markdownComponents: Components = {
  a: ({ children, href = "", ...props }) => {
    const safeHref = getSafeArticleUrl(href) ?? "#";

    return (
      <a
        {...props}
        href={safeHref}
        rel={isExternalHref(safeHref) ? "noopener noreferrer" : undefined}
        target={isExternalHref(safeHref) ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  },
  img: ({ alt, src, title }) => (
    <ArticleImage
      alt={stringAttribute(alt)}
      src={stringAttribute(src)}
      title={stringAttribute(title)}
    />
  ),
  p: ({ children }) => {
    const standaloneMediaLink = getStandaloneMediaLink(children);

    if (standaloneMediaLink) {
      return <ArticleMedia media={standaloneMediaLink} />;
    }

    const standaloneUrl = getStandaloneUrl(children);

    if (standaloneUrl) {
      const standaloneMedia = getArticleMedia(standaloneUrl);

      if (standaloneMedia) {
        return <ArticleMedia media={standaloneMedia} />;
      }

      return getArticleEmbed(standaloneUrl) ? (
        <ArticleEmbed url={standaloneUrl} />
      ) : (
        <ArticleLinkCard url={standaloneUrl} />
      );
    }

    return <p>{children}</p>;
  },
};

export function ArticleMarkdown({ children }: ArticleMarkdownProps) {
  const parts = parseArticleMarkdownParts(children);

  return (
    <div className="article-content">
      {parts.map((part, index) =>
        part.type === "markdown" ? (
          <ReactMarkdown
            key={`markdown-${index}`}
            components={markdownComponents}
            remarkPlugins={[remarkGfm]}
            skipHtml
          >
            {part.content}
          </ReactMarkdown>
        ) : (
          <ArticleVisualBlock
            key={`${part.kind}-${index}`}
            attrs={part.attrs}
            items={part.items}
            kind={part.kind}
            type={part.type}
          />
        ),
      )}
    </div>
  );
}
