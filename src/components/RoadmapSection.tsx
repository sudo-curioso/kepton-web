'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import {
  Sprout,
  Sparkles,
  Flame,
  TreePine,
  Trophy,
  MapPin,
} from 'lucide-react'
import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import GetStartedLink from './GetStartedLink'

interface Milestone {
  stage: string
  title: string
  desc: string
  reward: string
  icon: LucideIcon
}

const MILESTONES: Milestone[] = [
  {
    stage: 'Day 1',
    title: 'Plant your first seed',
    desc: 'Capture what’s on your mind and finish one focus session. Your very first tree takes root.',
    reward: 'First tree',
    icon: Sprout,
  },
  {
    stage: 'Day 3',
    title: 'Find your rhythm',
    desc: 'Let AI break the hard stuff into micro-steps. Small wins stack into real momentum.',
    reward: 'Momentum',
    icon: Sparkles,
  },
  {
    stage: 'Week 1',
    title: 'Light your streak',
    desc: 'Seven days of showing up. Your streak flame is lit — and you won’t want to break it.',
    reward: '7-day streak',
    icon: Flame,
  },
  {
    stage: 'Month 1',
    title: 'Grow your first acre',
    desc: 'Dozens of sessions later, scattered trees become a living, breathing forest of your own.',
    reward: '1 acre grown',
    icon: TreePine,
  },
  {
    stage: 'Day 100',
    title: 'Become unstoppable',
    desc: 'Focus is a habit now, not a chore. Your forest — and your mind — are thriving.',
    reward: 'Forest guardian',
    icon: Trophy,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function RoadmapSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.75', 'end 0.55'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 20, restDelta: 0.001 })
  const fillHeight = useTransform(smooth, [0, 1], ['0%', '100%'])

  return (
    <section
      id="roadmap"
      className="relative overflow-hidden bg-[#0a0a0a] px-4 py-28 sm:px-6 lg:px-8"
    >
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-emerald-600/6 blur-[130px]" />
        <div className="absolute bottom-10 left-1/4 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            Your journey
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            The road from scattered to unstoppable
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Every focus session moves you forward. Here’s the path your future self will thank you
            for — one tree, one streak, one acre at a time.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={trackRef} className="relative">
          {/* Dim track */}
          <div
            aria-hidden
            className="absolute bottom-0 left-6 top-0 w-px -translate-x-1/2 bg-white/[0.08] lg:left-1/2"
          />
          {/* Animated fill */}
          <motion.div
            aria-hidden
            style={{ height: fillHeight }}
            className="absolute left-6 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-[#22C55E] via-[#22C55E] to-emerald-400/40 shadow-[0_0_12px_rgba(34,197,94,0.7)] lg:left-1/2"
          />

          {/* Start marker */}
          <div className="relative mb-14 flex items-center">
            <div className="absolute left-6 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 lg:left-1/2">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#111] shadow-[0_0_20px_rgba(34,197,94,0.35)]"
              >
                <MapPin className="h-4 w-4 text-[#22C55E]" aria-hidden />
              </motion.div>
            </div>
            <span className="pl-16 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 lg:w-1/2 lg:pl-0 lg:pr-14 lg:text-right">
              You start here
            </span>
          </div>

          {/* Milestones */}
          {MILESTONES.map((m, i) => {
            const isLeft = i % 2 === 0
            const Icon = m.icon
            return (
              <div key={m.title} className="relative mb-12 flex items-center last:mb-0 lg:mb-20">
                {/* Node */}
                <div className="absolute left-6 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 lg:left-1/2">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                    className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#0c130e] shadow-[0_0_22px_rgba(34,197,94,0.35)]"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[#22C55E]/10 blur-md"
                    />
                    <Icon className="relative h-5 w-5 text-[#22C55E]" aria-hidden />
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full pl-16 ${
                    isLeft
                      ? 'lg:w-1/2 lg:pl-0 lg:pr-14'
                      : 'lg:ml-auto lg:w-1/2 lg:pl-14'
                  }`}
                >
                  <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-2xl transition-colors duration-500 hover:border-[#22C55E]/30 hover:bg-white/[0.04] sm:p-6">
                    <div
                      className={`mb-3 flex items-center gap-2 ${
                        isLeft ? 'lg:justify-end' : ''
                      }`}
                    >
                      <span className="rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#22C55E]">
                        {m.stage}
                      </span>
                      <span className="rounded-full border border-white/[0.10] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium text-neutral-400">
                        + {m.reward}
                      </span>
                    </div>
                    <h3
                      className={`text-lg font-semibold text-white sm:text-xl ${
                        isLeft ? 'lg:text-right' : ''
                      }`}
                    >
                      {m.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed text-neutral-400 ${
                        isLeft ? 'lg:text-right' : ''
                      }`}
                    >
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Motivational close + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-20 max-w-xl text-center"
        >
          <p className="text-lg font-medium text-neutral-300 sm:text-xl">
            The best day to plant a tree was yesterday. The second best day is{' '}
            <span className="text-[#22C55E]">today</span>.
          </p>
          <GetStartedLink className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#22C55E] px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_30px_rgba(34,197,94,0.35)] transition-transform hover:scale-[1.03]">
            Start your journey
          </GetStartedLink>
        </motion.div>
      </div>
    </section>
  )
}
