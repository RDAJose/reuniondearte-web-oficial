import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type ArticleMarkdownProps = {
  children: string;
};

const markdownComponents: Components = {
  a: ({ children, ...props }) => (
    <a {...props} rel="noreferrer">
      {children}
    </a>
  ),
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
