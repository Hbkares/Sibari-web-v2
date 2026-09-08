type JsonLdValue = Record<string, unknown>;

/**
 * `<` is escaped so CMS-sourced strings (titles, synopses) can never break
 * out of the script tag when this starts consuming real content.
 */
export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
