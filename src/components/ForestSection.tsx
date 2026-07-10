'use client'

import { motion } from 'motion/react'
import { Sprout, Globe2, Flame } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import ForestEmulator from '@/components/ForestEmulator'

interface Step {
  n: string
  title: string
  desc: string
  icon: LucideIcon
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Plant a tree every session',
    desc: 'Every focus session you finish plants a real tree on your personal island.',
    icon: Sprout,
  },
  {
    n: '02',
    title: 'Grow forest according to the season',
    desc: 'Your trees compound into a lush 3D world that shifts with the seasons over time.',
    icon: Globe2,
  },
  {
    n: '03',
    title: 'Build an unbreakable streak',
    desc: 'Keep showing up — track trees planted, acres grown, and your daily streak at a glance.',
    icon: Flame,
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

export default function ForestSection() {
  const [phase, setPhase] = useState(0)
  const [cycle, setCycle] = useState(0)

  const goTo = useCallback((next: number) => {
    setPhase(next)
    setCycle(c => c + 1)
  }, [])

  const advance = useCallback(() => {
    setPhase(p => (p + 1) % STEPS.length)
    setCycle(c => c + 1)
  }, [])

  return (
    <section
      id="forest"
      className="relative overflow-hidden bg-[#0a0a0a] px-4 py-28 sm:px-6 lg:px-8"
    >
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-0 h-[420px] w-[420px] translate-x-1/2 rounded-full bg-emerald-600/6 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            Forest
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Watch your focus become a forest
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Every session you complete grows a living island you can be proud of — a beautiful,
            visual reward for staying focused.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — interactive steps */}
          <div className="order-2 flex flex-col gap-3 lg:order-1">
            {STEPS.map((step, i) => {
              const isActive = i === phase
              const Icon = step.icon
              return (
                <motion.button
                  key={step.n}
                  type="button"
                  onClick={() => goTo(i)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i + 1}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-2xl transition-all duration-500 sm:p-6 ${
                    isActive
                      ? 'border-[#22C55E]/40 bg-white/[0.06] shadow-[0_8px_40px_rgba(34,197,94,0.10),inset_0_1px_0_0_rgba(255,255,255,0.10)]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="relative flex gap-4">
                    <div className="flex shrink-0 flex-col items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-500 ${
                          isActive
                            ? 'border-[#22C55E]/50 bg-[#22C55E]/15 text-[#22C55E]'
                            : 'border-white/[0.10] bg-white/[0.03] text-neutral-500'
                        }`}
                      >
                        {step.n}
                      </span>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-500 ${
                          isActive
                            ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]'
                            : 'border-white/[0.08] bg-white/[0.03] text-neutral-500'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-base font-semibold transition-colors duration-500 sm:text-lg ${
                            isActive ? 'text-white' : 'text-neutral-300'
                          }`}
                        >
                          {step.title}
                        </h3>
                        {isActive && (
                          <motion.span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
                            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-500">{step.desc}</p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Right — phone mockup with live emulation */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 flex justify-center lg:order-2 lg:justify-start"
          >
            <div className="relative mx-auto w-full max-w-[300px]">
              {/* Ambient glow behind device */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(34,197,94,0.15)] blur-3xl"
              />

              {/* Device frame */}
              <div className="relative rounded-[2.75rem] border border-white/[0.10] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-2.5 shadow-[0_20px_70px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <div className="relative aspect-[368/816] w-full overflow-hidden rounded-[2.25rem] bg-[#0a0f0b]">
                  {/* Notch */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80 ring-1 ring-white/[0.06]"
                  />
                  <ForestEmulator phase={phase} cycle={cycle} onAdvance={advance} />
                </div>
              </div>

              {/* Side buttons */}
              <div aria-hidden className="absolute -left-0.5 top-28 h-12 w-0.5 rounded-full bg-white/[0.10]" />
              <div aria-hidden className="absolute -right-0.5 top-24 h-8 w-0.5 rounded-full bg-white/[0.10]" />
              <div aria-hidden className="absolute -right-0.5 top-36 h-14 w-0.5 rounded-full bg-white/[0.10]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
