'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Bell, CalendarDays, Leaf, Sparkles, TreePine, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface PlannerEmulatorProps {
  phase: number
  cycle: number
  onAdvance: () => void
}

type Screen = 'form' | 'generating' | 'plan'

const MOODS = ['Calm', 'Focused', 'Overwhelmed', 'Energized', 'Tired', 'Anxious']
const DEADLINE = 'end of sprint'
const MIND = 'presentation at 3pm, feeling scattered'

const PLAN = [
  { time: '09:00', title: 'Deep work · Maths problem solving', tag: 'High' },
  { time: '11:30', title: 'Review lecture notes', tag: 'Medium' },
  { time: '14:00', title: 'Presentation prep', tag: 'High' },
  { time: '16:30', title: 'Quick wins & inbox', tag: 'Low' },
]

const TAG_STYLES: Record<string, string> = {
  High: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  Medium: 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]',
  Low: 'border-white/[0.12] bg-white/[0.04] text-neutral-400',
}

export default function PlannerEmulator({ phase, cycle, onAdvance }: PlannerEmulatorProps) {
  const [screen, setScreen] = useState<Screen>('form')
  const [scrolled, setScrolled] = useState(false)
  const [energyReady, setEnergyReady] = useState(false)
  const [moods, setMoods] = useState<string[]>([])
  const [deadline, setDeadline] = useState('')
  const [mind, setMind] = useState('')
  const [planShown, setPlanShown] = useState(0)

  const advanceRef = useRef(onAdvance)
  advanceRef.current = onAdvance

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>(res => {
        const id = setTimeout(res, ms)
        timers.push(id)
      })

    async function run() {
      if (phase === 0) {
        // Tune energy & mood
        setScreen('form')
        setScrolled(false)
        setEnergyReady(false)
        setMoods([])
        setDeadline('')
        setMind('')
        setPlanShown(0)
        await wait(650)
        if (cancelled) return
        setEnergyReady(true)
        await wait(700)
        if (cancelled) return
        setMoods(['Focused'])
        await wait(550)
        if (cancelled) return
        setMoods(['Focused', 'Energized'])
        await wait(1100)
        if (cancelled) return
        advanceRef.current()
      } else if (phase === 1) {
        // Add context
        setScreen('form')
        setEnergyReady(true)
        setMoods(['Focused', 'Energized'])
        setPlanShown(0)
        setDeadline('')
        setMind('')
        setScrolled(true)
        await wait(650)
        for (let i = 0; i <= DEADLINE.length; i++) {
          if (cancelled) return
          setDeadline(DEADLINE.slice(0, i))
          await wait(45)
        }
        await wait(400)
        for (let i = 0; i <= MIND.length; i++) {
          if (cancelled) return
          setMind(MIND.slice(0, i))
          await wait(32)
        }
        await wait(800)
        if (cancelled) return
        advanceRef.current()
      } else {
        // Generate offline plan
        setScreen('form')
        setEnergyReady(true)
        setMoods(['Focused', 'Energized'])
        setDeadline(DEADLINE)
        setMind(MIND)
        setScrolled(true)
        setPlanShown(0)
        await wait(600)
        if (cancelled) return
        setScreen('generating')
        await wait(1400)
        if (cancelled) return
        setScreen('plan')
        for (let i = 1; i <= PLAN.length; i++) {
          if (cancelled) return
          setPlanShown(i)
          await wait(280)
        }
        await wait(1800)
        if (cancelled) return
        advanceRef.current()
      }
    }

    void run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [phase, cycle])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0a0f0b] text-white">
      {/* ambient bokeh */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-4 top-28 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute -right-6 bottom-32 h-28 w-28 rounded-full bg-emerald-600/10 blur-2xl" />
      </div>

      {/* header */}
      <div className="relative px-4 pb-3 pt-8">
        <h2 className="text-2xl font-bold tracking-tight">AI Planner</h2>
        <p className="text-[11px] text-neutral-500">Your consistent companion</p>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ───────────── FORM ───────────── */}
          {(screen === 'form' || screen === 'generating') && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 px-4"
            >
              <motion.div
                animate={{ y: scrolled ? -214 : 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                className="flex flex-col gap-3"
              >
                {/* Energy */}
                <Card>
                  <Label>Energy</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map(e => {
                      const active = e === 'Medium' && energyReady
                      return (
                        <motion.div
                          key={e}
                          animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className={`flex h-9 items-center justify-center rounded-lg border text-[12px] font-medium ${
                            active
                              ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
                              : 'border-white/[0.08] bg-white/[0.02] text-neutral-400'
                          }`}
                        >
                          {e}
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>

                {/* Mood */}
                <Card>
                  <Label>Mood (optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map(m => {
                      const active = moods.includes(m)
                      return (
                        <motion.div
                          key={m}
                          animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                          transition={{ duration: 0.35 }}
                          className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                            active
                              ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
                              : 'border-white/[0.10] bg-white/[0.02] text-neutral-400'
                          }`}
                        >
                          {m}
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>

                {/* Deadline + mind */}
                <Card>
                  <Label>Deadline (optional)</Label>
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[12px]">
                    {deadline ? (
                      <span className="text-neutral-200">{deadline}</span>
                    ) : (
                      <span className="truncate text-neutral-600">
                        e.g. 2026-04-30 or end of sprint
                      </span>
                    )}
                    {screen === 'form' && deadline.length > 0 && deadline.length < DEADLINE.length && (
                      <Caret />
                    )}
                  </div>
                  <Label>What&apos;s on your mind? (optional)</Label>
                  <div className="h-16 rounded-lg border border-white/[0.08] bg-white/[0.03] p-2.5 text-[12px] leading-snug">
                    {mind ? (
                      <span className="text-neutral-200">{mind}</span>
                    ) : (
                      <span className="text-neutral-600">
                        What&apos;s on your mind? e.g. presentation at 3pm, feeling scattered…
                      </span>
                    )}
                    {screen === 'form' &&
                      mind.length > 0 &&
                      mind.length < MIND.length &&
                      deadline.length === DEADLINE.length && <Caret />}
                  </div>
                </Card>

                {/* Context */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[12px] font-semibold text-white">Context</p>
                  <p className="mt-1 text-[11px] leading-snug text-neutral-500">
                    4 open tasks on your list. Plans are built offline from energy and mood.
                  </p>
                </div>
              </motion.div>

              {/* generating overlay */}
              <AnimatePresence>
                {screen === 'generating' && (
                  <motion.div
                    key="gen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0a0f0b]/92 backdrop-blur-sm"
                  >
                    <div className="relative flex h-14 w-14 items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[#22C55E] motion-safe:animate-spin" />
                      <Sparkles className="h-6 w-6 text-[#22C55E]" aria-hidden />
                    </div>
                    <p className="text-sm font-semibold text-white">Building your plan</p>
                    <p className="text-[10px] text-neutral-500">Offline · from energy &amp; mood</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ───────────── PLAN RESULT ───────────── */}
          {screen === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 px-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#22C55E]" aria-hidden />
                <span className="text-[15px] font-bold">Your plan</span>
                <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[9px] font-semibold text-[#22C55E]">
                  built offline
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {PLAN.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={planShown > i ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5"
                  >
                    <span className="w-11 shrink-0 text-[13px] font-bold text-[#3ee07a]">{p.time}</span>
                    <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-neutral-200">
                      {p.title}
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${TAG_STYLES[p.tag]}`}
                    >
                      {p.tag}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Generate button (form only) */}
      {screen !== 'plan' && (
        <div className="relative px-4 pb-6 pt-3">
          <motion.div
            animate={screen === 'generating' ? { scale: 0.97 } : { scale: 1 }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#22C55E] py-3.5 text-[15px] font-bold text-black shadow-[0_8px_30px_rgba(34,197,94,0.35)]"
          >
            Generate my plan
          </motion.div>
        </div>
      )}

      {/* bottom nav */}
      <div className="relative flex items-center justify-around border-t border-white/[0.06] bg-[#0a0f0b]/90 px-2 py-2 backdrop-blur">
        {[
          { icon: Leaf, label: 'Focus', active: false },
          { icon: Bell, label: 'Reminders', active: false },
          { icon: TreePine, label: 'Forest', active: false },
          { icon: CalendarDays, label: 'Plan', active: true },
          { icon: User, label: 'Profile', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <Icon
              className={`h-4 w-4 ${active ? 'text-[#22C55E]' : 'text-neutral-600'}`}
              aria-hidden
            />
            <span className={`text-[8px] ${active ? 'text-[#22C55E]' : 'text-neutral-600'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">{children}</div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium text-neutral-400">{children}</p>
}

function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-3.5 w-[2px] bg-[#22C55E]"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity }}
    />
  )
}
