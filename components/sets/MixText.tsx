import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
import { mixMarkdownOptions } from "@/lib/sets/editorial";
import styles from "./sets.module.css";

function EditorialHeading({ children }: { children?: ReactNode }) {
  return <p className={styles.editorialHeading}><strong>{children}</strong></p>;
}

const components = { h1: EditorialHeading, h2: EditorialHeading, h3: EditorialHeading, h4: EditorialHeading, h5: EditorialHeading, h6: EditorialHeading };

export function MixText({ children }: { children: string }) {
  return <div className={styles.richText}><ReactMarkdown {...mixMarkdownOptions} components={components}>{children}</ReactMarkdown></div>;
}
