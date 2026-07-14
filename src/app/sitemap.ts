import type { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'
import { SITE_ORIGIN } from '@/lib/seo/json-ld'

/** Public indexable routes — excludes /auth and /dashboard (session-gated). */
const STATIC_ROUTES: ReadonlyArray<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/download', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/terms', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/subscription-policy', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/health-disclaimer', changeFrequency: 'monthly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(route => ({
    url: `${SITE_ORIGIN}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${SITE_ORIGIN}/blog/${post.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...blogEntries]
}
