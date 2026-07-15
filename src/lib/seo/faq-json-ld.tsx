import type { FaqPair, Post } from '@/lib/posts'
import { getPostFaq } from '@/lib/posts'
import { SITE_ORIGIN, serializeJsonLd } from '@/lib/seo/json-ld'

export function buildFaqPageJsonLd(post: Post, faq: FaqPair[] = getPostFaq(post)) {
  if (faq.length === 0) return null

  const pageUrl = `${SITE_ORIGIN}/blog/${post.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faq.map(pair => ({
      '@type': 'Question',
      name: pair.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: pair.answer,
      },
    })),
    isPartOf: {
      '@type': 'BlogPosting',
      '@id': `${pageUrl}#article`,
      headline: post.title,
      url: pageUrl,
    },
  }
}

/** Server-safe FAQPage script for Answer-First blog articles. */
export function FaqPageJsonLd({ post }: { post: Post }) {
  const data = buildFaqPageJsonLd(post)
  if (!data) return null

  return (
    <script
      id={`kepton-faq-${post.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
