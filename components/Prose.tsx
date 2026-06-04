import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Editorial markdown renderer for ported page copy. Defaults to the navy-band
 * treatment (light text); pass variant="light" for white bands (dark text).
 * Styling lives in the .editorial-prose utilities in globals.css.
 */
export function Prose({
  children,
  variant = "dark",
  className,
}: {
  children: string;
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Wider measure (~max-w-4xl) centered within .editorial, balanced
        // rather than hugging the left with dead space to the right.
        "editorial-prose max-w-4xl mx-auto",
        variant === "light" && "editorial-prose-light",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
