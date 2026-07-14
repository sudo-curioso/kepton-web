import { keptonJsonLdGraph, serializeJsonLd } from '@/lib/seo/json-ld'

/**
 * Sitewide Schema.org JSON-LD graph.
 * Rendered once in the root layout — no UI coupling, SSR-safe string payload.
 */
export default function JsonLd() {
  return (
    <script
      id="kepton-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(keptonJsonLdGraph) }}
    />
  )
}
