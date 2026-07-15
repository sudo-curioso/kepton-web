/**
 * Kepton JSON-LD entities — Schema.org graphs for rich results.
 * Preferred host is www (Vercel primary alias) so sitemap/canonical URLs return 200.
 *
 * Strict SEO auditors require every *root* object to declare @type. We therefore
 * emit discrete documents (not a typeless `@graph` wrapper) that still cross-link
 * via stable @id anchors.
 */

export const SITE_ORIGIN = 'https://www.kepton.app' as const

const WEBSITE_ID = `${SITE_ORIGIN}/#website`
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`
const APPLICATION_ID = `${SITE_ORIGIN}/#application`
const LOGO_URL = `${SITE_ORIGIN}/assets/brand/kepton-logo.png`

const PRODUCT_DESCRIPTION =
  'A gamified ADHD productivity application and visual planner designed to overcome focus challenges, time blindness, and executive dysfunction through interactive spatial layouts and game mechanics.'

const organizationRef = {
  '@type': 'Organization' as const,
  '@id': ORGANIZATION_ID,
}

const applicationRef = {
  '@type': 'SoftwareApplication' as const,
  '@id': APPLICATION_ID,
}

const logoImage = {
  '@type': 'ImageObject' as const,
  url: LOGO_URL,
  width: 512,
  height: 512,
}

/** Discrete typed Schema.org documents — each root has an explicit @type. */
export const keptonJsonLdDocuments = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Kepton',
    url: SITE_ORIGIN,
    description: PRODUCT_DESCRIPTION,
    publisher: organizationRef,
    about: applicationRef,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_ORIGIN}/blog?q={search_term_string}`,
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueRequired: true,
        valueName: 'search_term_string',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Kepton',
    url: SITE_ORIGIN,
    logo: logoImage,
    image: logoImage,
    email: 'support@kepton.app',
    description: PRODUCT_DESCRIPTION,
    knowsAbout: [
      'ADHD productivity',
      'Focus tools',
      'Executive dysfunction',
      'Time blindness',
      'Gamified planners',
    ],
    sameAs: ['https://www.linkedin.com/company/kepton', 'https://x.com/keptonapp'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': APPLICATION_ID,
    name: 'Kepton',
    url: SITE_ORIGIN,
    applicationCategory: 'ProductivityApplication',
    applicationSubCategory: 'Health & Focus Utilities',
    operatingSystem: 'iOS, Android, Web',
    description: PRODUCT_DESCRIPTION,
    image: logoImage,
    publisher: organizationRef,
    author: organizationRef,
    offers: {
      '@type': 'Offer',
      name: 'Kepton Free (Seedling)',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: 'Free',
    },
    featureList: [
      'Gamified focus timer with tree growth',
      'Visual forest and spatial task planning',
      'ADHD-friendly micro-steps and reminders',
      'Offline-first productivity for executive dysfunction',
    ],
  },
] as const

/** Serialize for <script type="application/ld+json"> — escapes `<` to avoid HTML breakout. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
