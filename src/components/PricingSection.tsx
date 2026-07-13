'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, Minus, Sparkles, Leaf } from 'lucide-react'
import { useState } from 'react'
import GlareHover from './GlareHover'
import GetStartedLink from './GetStartedLink'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

interface Feature {
  label: string
  free: boolean | string
  pro: boolean | string
}

const FEATURES: Feature[] = [
  { label: 'Unlimited task capture', free: true, pro: true },
  { label: 'Focus timer with tree growth', free: true, pro: true },
  { label: 'Daily streak tracking', free: true, pro: true },
  { label: 'AI micro-steps (break tasks down)', free: '5 / week', pro: 'Unlimited' },
  { label: 'Reminders', free: 'Basic', pro: 'Priority & recurring' },
  { label: 'Forest islands', free: '1 island', pro: 'Unlimited + seasons' },
  { label: 'AI Planner (energy & mood)', free: false, pro: true },
  { label: 'Detailed stats & insights', free: false, pro: true },
  { label: 'Cloud sync across devices', free: false, pro: true },
  { label: 'Custom themes', free: false, pro: true },
  { label: 'Priority support', free: false, pro: true },
]

function Cell({ value, accent }: { value: boolean | string; accent?: boolean }) {
  if (value === true) {
    return (
      <Check
        className={`h-4 w-4 shrink-0 ${accent ? 'text-[#22C55E]' : 'text-[#22C55E]'}`}
        aria-hidden
      />
    )
  }
  if (value === false) {
    return <Minus className="h-4 w-4 shrink-0 text-neutral-600" aria-hidden />
  }
  return (
    <span className={`text-xs font-semibold ${accent ? 'text-[#22C55E]' : 'text-neutral-300'}`}>
      {value}
    </span>
  )
}

const MONTHLY_PRICE = 8.99
const ANNUAL_TOTAL = 85

export default function PricingSection() {
  const [annual, setAnnual] = useState(true)
  const dollars = annual ? String(ANNUAL_TOTAL) : String(Math.floor(MONTHLY_PRICE))
  const cents = annual ? null : MONTHLY_PRICE.toFixed(2).split('.')[1]
  const unit = annual ? '/ year' : '/ month'
  const perMonth = (ANNUAL_TOTAL / 12).toFixed(2)
  const savings = Math.round((1 - ANNUAL_TOTAL / (MONTHLY_PRICE * 12)) * 100)

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#0a0a0a] px-4 py-28 sm:px-6 lg:px-8"
    >
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-emerald-600/6 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[320px] translate-x-1/2 rounded-full bg-emerald-500/5 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            Pricing
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Start free. Grow when you’re ready.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Everything you need to build focus for free — upgrade to Pro when you want AI planning,
            unlimited forests, and sync everywhere.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.span
            animate={{ color: annual ? 'rgb(115 115 115)' : 'rgb(255 255 255)' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="text-sm font-medium"
          >
            Monthly
          </motion.span>

          <motion.button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
            onClick={() => setAnnual(a => !a)}
            whileTap={{ scale: 0.96 }}
            animate={{
              backgroundColor: annual ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.05)',
              borderColor: annual ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.12)',
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative inline-flex h-11 w-14 shrink-0 items-center rounded-full border p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:h-8 sm:w-14"
          >
            <motion.span
              className="block h-6 w-6 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
              animate={{
                x: annual ? 24 : 0,
                backgroundColor: annual ? '#22C55E' : '#737373',
                boxShadow: annual
                  ? '0 0 14px rgba(34,197,94,0.55), 0 2px 8px rgba(0,0,0,0.35)'
                  : '0 2px 8px rgba(0,0,0,0.35)',
              }}
              transition={{ type: 'spring', stiffness: 520, damping: 32, mass: 0.75 }}
            />
          </motion.button>

          <motion.span
            animate={{ color: annual ? 'rgb(255 255 255)' : 'rgb(115 115 115)' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="text-sm font-medium"
          >
            Annual
          </motion.span>

          <motion.span
            initial={false}
            animate={{
              opacity: annual ? 1 : 0.45,
              scale: annual ? 1 : 0.94,
              x: annual ? 0 : -4,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]"
          >
            Save {savings}%
          </motion.span>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
          {/* FREE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={2}
            className="h-full"
          >
            <GlareHover
              width="100%"
              height="100%"
              background="rgba(255,255,255,0.02)"
              borderColor="rgba(255,255,255,0.08)"
              borderRadius="1.5rem"
              glareColor="#ffffff"
              glareOpacity={0.18}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              className="!block h-full w-full backdrop-blur-2xl"
            >
              <div className="flex h-full w-full flex-col p-7 sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.10] bg-white/[0.03] text-neutral-300">
                <Leaf className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold text-white">Seedling</h3>
              <span className="ml-auto rounded-full border border-white/[0.10] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium text-neutral-400">
                Free forever
              </span>
            </div>

            <div className="mb-1 flex items-start gap-0.5">
              <span className="mt-2 text-2xl font-semibold text-neutral-400">$</span>
              <span className="text-4xl font-bold leading-none tracking-tight text-white [font-variant-numeric:tabular-nums] sm:text-5xl">
                0
              </span>
              <span className="mb-1 ml-1 self-end text-sm font-medium text-neutral-500">
                / month
              </span>
            </div>
            <p className="mb-6 text-sm text-neutral-500">
              For getting started and building the habit.
            </p>

            <GetStartedLink className="mb-7 flex w-full items-center justify-center rounded-xl border border-white/[0.14] bg-transparent py-3 text-sm font-semibold text-white transition-colors hover:border-white/[0.28] hover:bg-white/[0.04]">
              Get started free
            </GetStartedLink>

            <ul className="flex flex-col gap-3">
              {FEATURES.map(f => (
                <li key={f.label} className="flex items-start justify-between gap-3 sm:items-center">
                  <span
                    className={`min-w-0 flex-1 text-sm leading-snug ${
                      f.free === false ? 'text-neutral-600' : 'text-neutral-300'
                    }`}
                  >
                    {f.label}
                  </span>
                  <Cell value={f.free} />
                </li>
              ))}
            </ul>
              </div>
            </GlareHover>
          </motion.div>

          {/* PRO */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={3}
            className="relative h-full lg:scale-[1.04]"
          >
            {/* Recommended badge — kept outside the glare clip so it can overhang */}
            <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
              <span className="flex items-center gap-1 rounded-full bg-[#22C55E] px-3 py-1 text-[11px] font-bold text-black shadow-[0_4px_20px_rgba(34,197,94,0.5)]">
                <Sparkles className="h-3 w-3" aria-hidden /> Most popular
              </span>
            </div>

            <GlareHover
              width="100%"
              height="100%"
              background="rgba(255,255,255,0.03)"
              borderColor="rgba(34,197,94,0.5)"
              borderRadius="1.5rem"
              glareColor="#86EFAC"
              glareOpacity={0.28}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              className="!block h-full w-full backdrop-blur-2xl md:shadow-[0_20px_70px_rgba(34,197,94,0.15)]"
              style={{ borderWidth: '2px' }}
            >
              <div className="relative flex h-full w-full flex-col p-7 sm:p-8">
                {/* PRD radial glow #FDE68A at ~5% */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(253,230,138,0.06),transparent_60%)]"
                />

            <div className="relative mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold text-white">Forest Pro</h3>
            </div>

            <div className="relative mb-1 flex items-start gap-0.5">
              <span className="mt-2 text-2xl font-semibold text-neutral-400">$</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={dollars}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="text-4xl font-bold leading-none tracking-tight text-white [font-variant-numeric:tabular-nums] sm:text-5xl"
                >
                  {dollars}
                </motion.span>
              </AnimatePresence>
              {cents && (
                <span className="mt-1.5 text-3xl font-bold tracking-tight text-white [font-variant-numeric:tabular-nums]">
                  .{cents}
                </span>
              )}
              <span className="mb-1 ml-1 self-end text-sm font-medium text-neutral-500">
                {unit}
              </span>
            </div>
            <p className="relative mb-6 text-sm text-neutral-500">
              {annual
                ? `Just $${perMonth}/mo, billed annually · 14-day free trial`
                : 'Billed monthly · 14-day free trial'}
            </p>

            <GetStartedLink className="relative mb-7 flex w-full items-center justify-center rounded-xl bg-[#22C55E] py-3 text-sm font-bold text-black shadow-[0_8px_0_0_#15803d,0_14px_30px_rgba(34,197,94,0.4)] transition-all hover:brightness-105 active:translate-y-1 active:shadow-[0_4px_0_0_#15803d,0_8px_20px_rgba(34,197,94,0.4)]">
              Start your forest
            </GetStartedLink>

            <ul className="relative flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm font-semibold text-white">
                <Check className="h-4 w-4 shrink-0 text-[#22C55E]" aria-hidden />
                Everything in Seedling, plus:
              </li>
              {FEATURES.map(f => (
                <li key={f.label} className="flex items-start justify-between gap-3 sm:items-center">
                  <span className="min-w-0 flex-1 text-sm leading-snug text-neutral-200">{f.label}</span>
                  <Cell value={f.pro} accent />
                </li>
              ))}
            </ul>
              </div>
            </GlareHover>
          </motion.div>
        </div>

        {/* Footnote */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={4}
          className="mt-10 text-center text-xs text-neutral-500"
        >
          Every plan is offline-first, private by design, and GDPR compliant with EU data residency.
        </motion.p>
      </div>
    </section>
  )
}
