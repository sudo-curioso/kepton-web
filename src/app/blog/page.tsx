import type { Metadata } from 'next'
import BlogIndex from '@/components/BlogIndex'

export const metadata: Metadata = {
  title: 'Blog · Kepton',
  description:
    'Honest, science-backed writing on ADHD, executive dysfunction, and building a kinder relationship with your own attention.',
}

export default function BlogPage() {
  return <BlogIndex />
}
