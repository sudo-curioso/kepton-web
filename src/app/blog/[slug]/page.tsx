import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogArticle from '@/components/BlogArticle'
import { getPost, posts } from '@/lib/posts'
import { FaqPageJsonLd } from '@/lib/seo/faq-json-ld'

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return { title: 'Article not found · Kepton' }
  return {
    title: `${post.title} · Kepton`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()
  return (
    <>
      <BlogArticle post={post} />
      <FaqPageJsonLd post={post} />
    </>
  )
}
