'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, CalendarDays, Clock, Leaf, Sprout } from 'lucide-react'
import NavBar from './NavBar'
import SiteFooter from './SiteFooter'
import { posts } from '@/lib/posts'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function BlogIndex() {
  const [featured, ...rest] = posts

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-600/[0.07] blur-[150px]" />
        <div className="absolute left-1/4 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-600/[0.05] blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[320px] translate-x-1/2 rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <NavBar />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-28 pt-32 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            The Kepton Blog
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Field notes for neurodivergent focus
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Honest, science-backed writing on ADHD, executive dysfunction, and building a kinder
            relationship with your own attention.
          </p>
        </motion.div>

        {/* Featured post */}
        {featured && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative grid overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:border-[#22C55E]/30 hover:bg-white/[0.03] md:grid-cols-2"
            >
              {/* Visual panel */}
              <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-[#0f2a1a] via-[#0a0a0a] to-[#0a0a0a] md:min-h-full">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(34,197,94,0.22),transparent_60%)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:26px_26px]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] shadow-[0_0_50px_rgba(34,197,94,0.35)] transition-transform duration-500 group-hover:scale-105">
                    <Sprout className="h-11 w-11" aria-hidden />
                  </div>
                </div>
                <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/25 bg-black/40 px-3 py-1 text-xs font-semibold text-[#22C55E] backdrop-blur-md">
                  <Leaf className="h-3.5 w-3.5" aria-hidden />
                  {featured.category}
                </span>
              </div>

              {/* Text panel */}
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <span className="mb-3 w-fit rounded-full border border-white/[0.10] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Featured
                </span>
                <h2 className="text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-[15px]">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {featured.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {featured.readTime}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#22C55E]">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Additional posts */}
        {rest.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <motion.div
                key={post.slug}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 2}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#22C55E]/30 hover:bg-white/[0.03]"
                >
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-[#22C55E]">
                    <Leaf className="h-3 w-3" aria-hidden />
                    {post.category}
                  </span>
                  <h2 className="text-lg font-semibold leading-snug tracking-tight text-white">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-x-4 pt-5 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {post.readTime}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
