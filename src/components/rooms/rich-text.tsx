import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@/lib/sanity/types";

/** Renders Sanity portable text (synopsis/lyrics/bio body) as real HTML. */
export function RichText({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className={className}>
      <PortableText value={value} />
    </div>
  );
}
