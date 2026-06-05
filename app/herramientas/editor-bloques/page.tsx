import type { Metadata } from "next";
import { VisualBlockComposer } from "@/components/editorial/VisualBlockComposer";

export const metadata: Metadata = {
  title: "Editor interno de bloques visuales",
  robots: {
    follow: false,
    index: false,
  },
};

function isInternalToolEnabled() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_RDA_INTERNAL_TOOLS === "enabled"
  );
}

export default function EditorialBlockEditorPage() {
  if (!isInternalToolEnabled()) {
    return (
      <div className="internal-tool-unavailable">
        <p className="editorial-kicker">Herramienta interna</p>
        <h1>Herramienta no disponible</h1>
      </div>
    );
  }

  return <VisualBlockComposer />;
}
