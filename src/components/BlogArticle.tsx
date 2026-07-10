'use client'

import Link from 'next/link'
import { KeptonMark } from '@/components/KeptonLogo'
import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Leaf } from 'lucide-react'
import NavBar from './NavBar'
import GetStartedLink from './GetStartedLink'
import SiteFooter from './SiteFooter'
import type { Block, Post } from '@/lib/posts'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

function ArticleBlock({ block }: { block: Block }) {
  if (block.type === 'heading') {
    return (
      <h2 className="mt-12 scroll-mt-28 text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
        <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          {block.text}
        </span>
      </h2>
    )
  }

  if (block.type === 'table') {
    return (
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              <th className="w-2/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#22C55E]">
                {block.head[0]}
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {block.head[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map(([label, desc], i) => (
              <tr
                key={label}
                className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'}
              >
                <td className="border-t border-white/[0.06] px-5 py-4 align-top text-sm font-semibold text-white">
                  {label}
                </td>
                <td className="border-t border-white/[0.06] px-5 py-4 align-top text-sm leading-relaxed text-neutral-400">
                  {desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <p className="mt-5 text-[17px] leading-[1.8] text-neutral-300/90">{block.text}</p>
  )
}

export default function BlogArticle({ post }: { post: Post }) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-[#22C55E]"
      />

      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-600/[0.07] blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 h-[360px] w-[360px] translate-x-1/3 rounded-full bg-emerald-500/[0.04] blur-[130px]" />
      </div>

      <NavBar />

      <article className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
        {/* Back link */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All articles
          </Link>
        </motion.div>

        {/* Category */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="mt-8"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/[0.08] px-3 py-1 text-xs font-semibold text-[#22C55E]">
            <Leaf className="h-3.5 w-3.5" aria-hidden />
            {post.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mt-5 text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-[44px]"
        >
          {post.title}
        </motion.h1>

        {/* Lede */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mt-6 text-lg leading-relaxed text-neutral-400"
        >
          {post.lede}
        </motion.p>

        {/* Meta */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/[0.08] py-4 text-sm text-neutral-500"
        >
          <span className="flex items-center gap-2">
            <KeptonMark size="md" />
            <span className="font-medium text-neutral-300">{post.author}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden />
            {post.readTime}
          </span>
        </motion.div>

        {/* Body */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
          className="mt-2"
        >
          {post.content.map((block, i) => (
            <ArticleBlock key={i} block={block} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-[#22C55E]/25 bg-gradient-to-br from-[#22C55E]/[0.08] via-white/[0.02] to-transparent p-8 backdrop-blur-xl sm:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
          />
          <h3 className="relative text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
            Grow a forest, not a to-do list.
          </h3>
          <p className="relative mt-3 max-w-xl text-base leading-relaxed text-neutral-400">
            Kepton is built for brains that freeze — instant dopamine rewards, zero guilt, and a
            living forest that turns every focus session into visible growth. No red badges. Ever.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center gap-3">
            <GetStartedLink className="inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-bold text-black shadow-[0_10px_30px_rgba(34,197,94,0.35)] transition-all hover:brightness-105">
              Start your forest
              <ArrowRight className="h-4 w-4" aria-hidden />
            </GetStartedLink>
            <Link
              href="/#features"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-transparent px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/[0.28] hover:bg-white/[0.04]"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        {/* Footer back link */}
        <div className="mt-12 border-t border-white/[0.08] pt-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to all articles
          </Link>
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
