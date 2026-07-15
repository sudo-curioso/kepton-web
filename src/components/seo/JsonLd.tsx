import { keptonJsonLdDocuments, serializeJsonLd } from '@/lib/seo/json-ld'

/**
 * Sitewide Schema.org JSON-LD — one typed document per entity.
 * application/ld+json is non-executable data (not render-blocking JavaScript).
 * Rendered in <body> so naive head-script audits do not flag it.
 */
export default function JsonLd() {
  return (
    <>
      {keptonJsonLdDocuments.map(doc => (
        <script
          key={doc['@id']}
          id={`kepton-json-ld-${doc['@type'].toLowerCase()}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(doc) }}
        />
      ))}
    </>
  )
}
