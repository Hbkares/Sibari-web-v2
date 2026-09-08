import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  isSanityConfigured,
} from "./env";

const QUERY_REVALIDATE_SECONDS = 60;

type QueryParams = Record<string, string | number | boolean>;

/**
 * Hits the Sanity Query API directly with `fetch` (rather than the
 * `@sanity/client` SDK) so Next.js's patched `fetch` handles request
 * memoization and ISR revalidation the same way it does for any other
 * server-rendered data source.
 *
 * Returns `null` when the project isn't configured or the query fails —
 * every room page treats `null` as "no content yet" rather than crashing,
 * since the Sanity project itself hasn't been provisioned.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  if (!isSanityConfigured) return null;

  const url = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
  );
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: QUERY_REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      throw new Error(`Sanity query failed with status ${res.status}`);
    }
    const { result } = (await res.json()) as { result: T };
    return result;
  } catch (error) {
    console.error("[sanity] query failed:", error);
    return null;
  }
}
