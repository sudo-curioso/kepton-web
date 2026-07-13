'use client'

import Link from 'next/link'
import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import NavBar from './NavBar'
import SiteFooter from './SiteFooter'
import type { PolicyBlock, PolicyDocument } from '@/lib/policies'

function PolicyBlockView({ block }: { block: PolicyBlock }) {
  if (block.type === 'heading') {
    if (block.level === 3) {
      return (
        <h3 className="mt-8 scroll-mt-28 text-lg font-semibold tracking-tight text-white sm:text-xl">
          {block.text}
        </h3>
      )
    }
    return (
      <h2 className="mt-12 scroll-mt-28 text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
        <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          {block.text}
        </span>
      </h2>
    )
  }

  if (block.type === 'list') {
    return (
      <ul className="mt-4 space-y-2.5 pl-1">
        {block.items.map(item => (
          <li key={item} className="flex gap-3 text-[17px] leading-[1.75] text-neutral-300/90">
            <span
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]/80"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === 'notice') {
    return (
      <div className="mt-5 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-5 py-4">
        <p className="text-sm leading-relaxed text-amber-100/90">{block.text}</p>
      </div>
    )
  }

  return <p className="mt-5 text-[17px] leading-[1.8] text-neutral-300/90">{block.text}</p>
}

export default function LegalDocument({ document }: { document: PolicyDocument }) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-[#22C55E]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]"
      />

      <NavBar />

      <main className="relative mx-auto max-w-3xl px-4 pb-8 pt-32 sm:px-6 sm:pt-36">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            Legal
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            {document.title}
          </h1>
          {document.subtitle && (
            <p className="mt-4 text-base leading-relaxed text-neutral-400">{document.subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-white/[0.08] py-4 text-sm text-neutral-500">
            <span>Effective date: {document.effectiveDate}</span>
            {document.lastUpdated && <span>Last updated: {document.lastUpdated}</span>}
          </div>
          {document.meta && (
            <p className="mt-4 text-sm text-neutral-500">{document.meta}</p>
          )}
        </motion.header>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="pb-12"
        >
          {document.blocks.map((block, i) => (
            <PolicyBlockView key={`${block.type}-${i}`} block={block} />
          ))}
        </motion.article>
      </main>

      <SiteFooter />
    </div>
  )
}
