import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleEmbed, getArticleEmbed } from "@/components/articles/ArticleEmbed";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLinkCard } from "@/components/articles/ArticleLinkCard";

type ArticleMarkdownProps = {
  children: string;
};

const standaloneUrlPattern = /^https?:\/\/[^\s<>"']+$/i;

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

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function stringAttribute(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

const markdownComponents: Components = {
  a: ({ children, href = "", ...props }) => (
    <a
      {...props}
      href={href}
      rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
      target={isExternalHref(href) ? "_blank" : undefined}
    >
      {children}
    </a>
  ),
  img: ({ alt, src, title }) => (
    <ArticleImage
      alt={stringAttribute(alt)}
      src={stringAttribute(src)}
      title={stringAttribute(title)}
    />
  ),
  p: ({ children }) => {
    const standaloneUrl = getStandaloneUrl(children);

    if (standaloneUrl) {
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
  return (
    <div className="article-content mt-12 text-[1.12rem] leading-8 text-stone-800 sm:text-xl sm:leading-9">
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
