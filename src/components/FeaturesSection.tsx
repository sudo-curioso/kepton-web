'use client'

import { motion } from 'motion/react'
import {
  Bell,
  CalendarDays,
  Check,
  Leaf,
  Play,
  Shield,
  Sparkles,
  Timer,
} from 'lucide-react'
import type { ReactNode } from 'react'
import FocusTimerMockup from '@/components/FocusTimerMockup'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

function GlassCard({
  children,
  className = '',
  glow = false,
}: {
  children: ReactNode
  className?: string
  glow?: boolean
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-[0_8px_40px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.10)] backdrop-blur-2xl transition-all duration-500 hover:border-[#22C55E]/25 hover:bg-white/[0.05] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-700 group-hover:bg-emerald-400/20"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

function MicroStepsMockup() {
  const steps = ['Open calculator app', 'Write down the problem', 'Identify key numbers']
  return (
    <div className="space-y-2 rounded-xl border border-emerald-500/15 bg-black/30 p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Micro-steps</p>
      {steps.map(step => (
        <div key={step} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
          <span className="text-xs leading-relaxed text-zinc-400">{step}</span>
        </div>
      ))}
    </div>
  )
}

function TaskCaptureMockup() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-xs text-zinc-500">
        What will you focus on?
      </div>
      <div className="flex flex-wrap gap-1.5">
        {['Urgent', 'Medium', 'Low'].map((p, i) => (
          <span
            key={p}
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
              i === 1
                ? 'border-emerald-400/60 text-emerald-400'
                : 'border-white/10 text-zinc-500'
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

function ReminderMockup() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 p-3">
      <span className="font-mono text-lg font-bold text-emerald-400">4:50</span>
      <div>
        <p className="text-sm font-medium text-white">Study session</p>
        <p className="text-[10px] text-zinc-500">Mon, 8 Jun 2026</p>
      </div>
    </div>
  )
}

function PlannerMockup() {
  const days = ['Mon 8', 'Tue 9', 'Wed 10', 'Thu 11']
  return (
    <div className="flex gap-1.5 overflow-hidden">
      {days.map((d, i) => (
        <div
          key={d}
          className={`shrink-0 rounded-lg px-2.5 py-2 text-center text-[10px] ${
            i === 1
              ? 'bg-emerald-500 font-semibold text-black'
              : 'border border-white/10 text-zinc-500'
          }`}
        >
          {d.split(' ').map((part, j) => (
            <span key={part} className={j === 0 ? 'block opacity-70' : 'block font-bold'}>
              {part}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function ForestMockup() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="flex -space-x-2">
        {['🌱', '🌿', '🌳'].map((t, i) => (
          <span
            key={t}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg"
            style={{ zIndex: 3 - i }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
          <Leaf className="h-3.5 w-3.5" aria-hidden />
          3 trees
        </span>
      </div>
    </div>
  )
}

function FeatureLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
        {icon}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">
        {label}
      </span>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#0a0a0a] px-4 pt-10 pb-28 sm:px-6 lg:px-8"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-emerald-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-emerald-500/6 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            Features
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Built for brains that need clarity, not complexity
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-500 sm:text-lg">
            Everything in Kepton is designed around one flow — capture, focus, grow. No
            overwhelming systems. Just the tools your mind actually uses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {/* Focus timer — hero card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={1}
            className="md:col-span-7"
          >
            <GlassCard glow className="h-full p-6 sm:p-8">
              <FeatureLabel icon={<Timer className="h-4 w-4" aria-hidden />} label="Focus timer" />
              <h3 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
                Deep work, one ring at a time
              </h3>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-zinc-500">
                Pick a task, choose 1–60 minute presets, and start. Your timer keeps running
                while you navigate — with a growing tree that rewards every focused minute.
              </p>
              <FocusTimerMockup />
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[1, 5, 15, 25, 45, 60].map(m => (
                  <span
                    key={m}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      m === 25
                        ? 'bg-emerald-500 text-black'
                        : 'border border-white/10 text-zinc-500'
                    }`}
                  >
                    {m}m
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* AI micro-steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={2}
            className="md:col-span-5"
          >
            <GlassCard glow className="flex h-full flex-col p-6 sm:p-8">
              <FeatureLabel icon={<Sparkles className="h-4 w-4" aria-hidden />} label="AI steps" />
              <h3 className="mb-2 text-xl font-semibold text-white">Overwhelming? Slice it.</h3>
              <p className="mb-5 text-sm leading-relaxed text-zinc-500">
                One tap breaks any task into 3–5 small, specific micro-steps you can actually
                start.
              </p>
              <MicroStepsMockup />
              <div className="mt-auto flex gap-2 pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black">
                  <Play className="h-3 w-3 fill-current" aria-hidden />
                  Start
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  AI Steps
                </span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick capture */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={3}
            className="md:col-span-4"
          >
            <GlassCard className="h-full p-6">
              <FeatureLabel icon={<Check className="h-4 w-4" aria-hidden />} label="Task capture" />
              <h3 className="mb-2 text-lg font-semibold text-white">Dump it. Don&apos;t organize it.</h3>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                Add what&apos;s on your mind with priority and timing — no structure required.
              </p>
              <TaskCaptureMockup />
            </GlassCard>
          </motion.div>

          {/* Reminders */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={4}
            className="md:col-span-4"
          >
            <GlassCard className="h-full p-6">
              <FeatureLabel icon={<Bell className="h-4 w-4" aria-hidden />} label="Reminders" />
              <h3 className="mb-2 text-lg font-semibold text-white">Never miss what matters</h3>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                Set priority-based reminders with a clean calendar and time picker.
              </p>
              <ReminderMockup />
            </GlassCard>
          </motion.div>

          {/* Forest */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={5}
            className="md:col-span-4"
          >
            <GlassCard glow className="h-full p-6">
              <FeatureLabel icon={<Leaf className="h-4 w-4" aria-hidden />} label="Your forest" />
              <h3 className="mb-2 text-lg font-semibold text-white">Focus that grows</h3>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                Every completed session plants a tree. Watch your virtual forest flourish.
              </p>
              <ForestMockup />
            </GlassCard>
          </motion.div>

          {/* Planner — wide card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={6}
            className="md:col-span-8"
          >
            <GlassCard className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-sm">
                  <FeatureLabel
                    icon={<CalendarDays className="h-4 w-4" aria-hidden />}
                    label="Weekly planner"
                  />
                  <h3 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    Today, this week, or later
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    Filter tasks by urgency with a visual week strip. Always know your next
                    right action.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {['Today', 'This Week', 'Later', 'Done'].map((tab, i) => (
                      <span
                        key={tab}
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                          i === 0
                            ? 'bg-emerald-500 text-black'
                            : 'border border-white/10 text-zinc-500'
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full sm:max-w-xs">
                  <PlannerMockup />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={7}
            className="md:col-span-4"
          >
            <GlassCard className="flex h-full flex-col justify-center p-6 sm:p-8">
              <FeatureLabel icon={<Shield className="h-4 w-4" aria-hidden />} label="Privacy" />
              <h3 className="mb-2 text-lg font-semibold text-white">Private by design</h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                GDPR compliant. Encrypted. EU data residency. Your focus stays yours.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
