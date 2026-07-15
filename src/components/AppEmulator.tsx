'use client'

import { AnimatePresence, motion } from 'motion/react'
import {
  Bell,
  CalendarDays,
  Check,
  Globe,
  Leaf,
  Loader2,
  Pause,
  Play,
  Plus,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const TASK_TITLE = 'Maths problem solving'
const MICRO_STEPS = [
  'Open calculator app',
  'Write down problem on paper',
  'Identify key numbers and symbols',
  'Circle the unknown value',
  'Draw a simple diagram',
]
const PRESETS = ['1m', '5m', '15m', '25m', '45m', '60m']
const FOCUS_SECONDS = 60

type Screen = 'dashboard' | 'newTask' | 'timer'

export interface AppEmulatorProps {
  phase: number
  cycle: number
  onAdvance: () => void
}

// Tree growth is replicated frame-for-frame from the app demo video.
const TREE_FRAMES = 46
const treeFrame = (i: number) => `/assets/tree/tree_${String(i + 1).padStart(2, '0')}.jpg`

function ProgressRing({ progress, grow }: { progress: number; grow: number }) {
  const size = 168
  const stroke = 5
  const r = (size - stroke) / 2 - 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - progress)

  // leading dot position along the arc (ring is rotated -90deg → starts at top)
  const angle = (progress * 360 - 90) * (Math.PI / 180)
  const dotX = size / 2 + r * Math.cos(angle)
  const dotY = size / 2 + r * Math.sin(angle)
  const discR = r - 16

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
      {/* soft glow behind the disc */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(34,197,94,0.18)] blur-2xl"
      />
      <svg width={size} height={size}>
        <defs>
          <radialGradient id="discGrad" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#0f1a12" />
            <stop offset="100%" stopColor="#060a07" />
          </radialGradient>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>

        {/* faint concentric guide rings */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <circle cx={size / 2} cy={size / 2} r={r - 8} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />

        {/* dark disc that holds the tree */}
        <circle cx={size / 2} cy={size / 2} r={discR} fill="url(#discGrad)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* progress arc */}
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.6))', transition: 'stroke-dashoffset 0.15s linear' }}
          />
        </g>

        {/* leading dot */}
        {progress > 0.008 && progress < 0.999 && (
          <circle
            cx={dotX}
            cy={dotY}
            r={4.5}
            fill="#eafff0"
            style={{ filter: 'drop-shadow(0 0 5px rgba(74,222,128,0.9))' }}
          />
        )}
      </svg>

      {/* tree grows inside the disc — exact frames from the app video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <TreeSequence grow={grow} px={discR * 2 + 6} />
      </div>
    </div>
  )
}

function TreeSequence({ grow, px }: { grow: number; px: number }) {
  // Preload every frame once so scrubbing is flicker-free.
  useEffect(() => {
    for (let i = 0; i < TREE_FRAMES; i++) {
      const img = new window.Image()
      img.src = treeFrame(i)
    }
  }, [])

  const idx = Math.min(TREE_FRAMES - 1, Math.max(0, Math.round(grow * (TREE_FRAMES - 1))))
  const mask = 'radial-gradient(circle at 50% 50%, #000 60%, transparent 76%)'

  return (
    <motion.div
      className="relative overflow-hidden rounded-full"
      style={{ width: px, height: px }}
      animate={{ scale: [1, 1.015, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Image
        src={treeFrame(idx)}
        alt=""
        aria-hidden
        width={px}
        height={px}
        draggable={false}
        className="h-full w-full select-none object-cover mix-blend-lighten"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />
    </motion.div>
  )
}

function BottomNav({ active = 'Focus' }: { active?: string }) {
  const items = [
    { label: 'Focus', icon: Leaf },
    { label: 'Reminders', icon: Bell },
    { label: 'Forest', icon: Globe },
    { label: 'Plan', icon: CalendarDays },
    { label: 'Profile', icon: User },
  ]
  return (
    <div className="flex items-center justify-around border-t border-white/[0.06] px-2 py-2">
      {items.map(({ label, icon: Icon }) => {
        const on = label === active
        return (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <Icon className={`h-3.5 w-3.5 ${on ? 'text-[#22C55E]' : 'text-neutral-600'}`} aria-hidden />
            <span className={`text-[7px] ${on ? 'text-[#22C55E]' : 'text-neutral-600'}`}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

const listVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const itemVariant = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export default function AppEmulator({ phase, cycle, onAdvance }: AppEmulatorProps) {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [typed, setTyped] = useState('')
  const [hasTask, setHasTask] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [stepsShown, setStepsShown] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS)
  const [done, setDone] = useState(false)
  const [taskDone, setTaskDone] = useState(false)

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
        // Phase 1 — Task creation
        setScreen('dashboard')
        setHasTask(false)
        setTaskDone(false)
        setStepsShown(false)
        setAiLoading(false)
        setTyped('')
        await wait(750)
        if (cancelled) return
        setScreen('newTask')
        await wait(600)
        for (let i = 0; i <= TASK_TITLE.length; i++) {
          if (cancelled) return
          setTyped(TASK_TITLE.slice(0, i))
          await wait(52)
        }
        await wait(650)
        if (cancelled) return
        setScreen('dashboard')
        setHasTask(true)
        await wait(1500)
        if (cancelled) return
        advanceRef.current()
      } else if (phase === 1) {
        // Phase 2 — AI step generation
        setScreen('dashboard')
        setHasTask(true)
        setTaskDone(false)
        setTyped(TASK_TITLE)
        setStepsShown(false)
        setAiLoading(false)
        await wait(800)
        if (cancelled) return
        setAiLoading(true)
        await wait(1050)
        if (cancelled) return
        setAiLoading(false)
        setStepsShown(true)
        await wait(2400)
        if (cancelled) return
        advanceRef.current()
      } else {
        // Phase 3 — Focus timer + tree growth
        setHasTask(true)
        setTaskDone(false)
        setStepsShown(true)
        setTyped(TASK_TITLE)
        setDone(false)
        setSecondsLeft(FOCUS_SECONDS)
        await wait(500)
        if (cancelled) return
        setScreen('timer')
        await wait(500)
        for (let s = FOCUS_SECONDS; s >= 0; s--) {
          if (cancelled) return
          setSecondsLeft(s)
          await wait(105)
        }
        if (cancelled) return
        setDone(true)
        await wait(1000)
        if (cancelled) return
        setScreen('dashboard')
        setTaskDone(true)
        setDone(false)
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

  const elapsed = (FOCUS_SECONDS - secondsLeft) / FOCUS_SECONDS
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="relative h-full w-full bg-[#0a0f0b] text-white">
      {/* ambient blobs inside screen */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-6 top-10 h-28 w-28 rounded-full bg-emerald-600/10 blur-2xl" />
        <div className="absolute -left-8 bottom-16 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />
      </div>

      <AnimatePresence mode="wait">
        {/* ───────────── DASHBOARD ───────────── */}
        {screen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-full flex-col"
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-8">
              <span className="text-lg font-bold">Focus</span>
              <span className="flex items-center gap-1 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-semibold text-[#22C55E]">
                <Leaf className="h-3 w-3" aria-hidden /> 3
              </span>
            </div>

            {/* date strip */}
            <div className="flex gap-1.5 px-4 pb-3">
              {['9', '10', '11', '12', '13'].map((d, i) => (
                <div
                  key={d}
                  className={`flex h-9 flex-1 flex-col items-center justify-center rounded-lg text-[9px] ${
                    i === 0 ? 'bg-[#22C55E] font-bold text-black' : 'border border-white/[0.06] text-neutral-500'
                  }`}
                >
                  <span className="opacity-70">Tue</span>
                  <span className="text-[11px] font-semibold">{d}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 space-y-3 overflow-hidden px-4">
              <AnimatePresence>
                {hasTask && (
                  <motion.div
                    key="task"
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-amber-300/15 px-1.5 py-0.5 text-[8px] font-bold text-amber-300">
                        MED
                      </span>
                      {taskDone && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-[8px] font-semibold text-[#22C55E]"
                        >
                          <Check className="h-3 w-3" aria-hidden /> Completed
                        </motion.span>
                      )}
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        taskDone ? 'text-neutral-500 line-through' : 'text-white'
                      }`}
                    >
                      {TASK_TITLE}
                    </p>

                    {!taskDone && (
                      <>
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {PRESETS.map(p => (
                            <span
                              key={p}
                              className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${
                                p === '25m'
                                  ? 'bg-[#22C55E] text-black'
                                  : 'border border-white/[0.08] text-neutral-500'
                              }`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>

                        <AnimatePresence>
                          {stepsShown && (
                            <motion.div
                              key="microsteps"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35 }}
                              className="mt-3 overflow-hidden rounded-xl border border-[#22C55E]/15 bg-black/30 p-2.5"
                            >
                              <p className="mb-1.5 text-[8px] font-bold uppercase tracking-widest text-[#22C55E]">
                                Micro-steps
                              </p>
                              <motion.ul variants={listVariant} initial="hidden" animate="show" className="space-y-1">
                                {MICRO_STEPS.map(s => (
                                  <motion.li
                                    key={s}
                                    variants={itemVariant}
                                    className="flex items-start gap-1.5 text-[9px] text-neutral-400"
                                  >
                                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#22C55E]" />
                                    {s}
                                  </motion.li>
                                ))}
                              </motion.ul>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-3 flex gap-2">
                          <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#22C55E] py-1.5 text-[10px] font-bold text-black">
                            <Play className="h-3 w-3 fill-current" aria-hidden /> Start
                          </span>
                          <span className="flex items-center justify-center gap-1 rounded-lg border border-[#22C55E]/30 px-3 py-1.5 text-[10px] font-semibold text-[#22C55E]">
                            {aiLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                            ) : (
                              <Sparkles className="h-3 w-3" aria-hidden />
                            )}
                            {aiLoading ? 'Thinking' : 'AI Steps'}
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!hasTask && (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                    <Leaf className="h-5 w-5 text-neutral-600" aria-hidden />
                  </div>
                  <p className="text-[10px] text-neutral-600">No tasks yet — add your first focus</p>
                </div>
              )}
            </div>

            {/* New task button */}
            <div className="px-4 pb-2 pt-2">
              <div className="flex items-center justify-center gap-1 rounded-2xl bg-[#22C55E] py-3 text-xs font-bold text-black shadow-[0_4px_20px_rgba(34,197,94,0.3)]">
                <Plus className="h-4 w-4" aria-hidden /> New Task
              </div>
            </div>
            <BottomNav active="Focus" />
          </motion.div>
        )}

        {/* ───────────── NEW TASK ───────────── */}
        {screen === 'newTask' && (
          <motion.div
            key="newTask"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full flex-col px-4 pt-8"
          >
            <div className="flex items-center justify-between pb-4">
              <span className="text-[11px] font-medium text-[#22C55E]">Cancel</span>
              <span className="text-sm font-bold">New task</span>
              <span className="w-10" />
            </div>

            <p className="mb-2 text-[11px] font-medium text-neutral-300">What will you focus on?</p>
            <div className="min-h-[64px] rounded-xl border border-white/[0.10] bg-white/[0.02] p-3 text-sm text-white">
              {typed || <span className="text-neutral-600">e.g. Design homepage</span>}
              <motion.span
                aria-hidden
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-[#22C55E]"
              />
            </div>

            <p className="mb-1.5 mt-4 text-[11px] font-medium text-neutral-300">Priority</p>
            <div className="flex gap-2">
              {['Urgent', 'Medium', 'Low'].map(p => (
                <span
                  key={p}
                  className={`rounded-lg border px-3 py-1.5 text-[10px] font-medium ${
                    p === 'Medium'
                      ? 'border-[#22C55E] text-[#22C55E]'
                      : 'border-white/[0.08] text-neutral-500'
                  }`}
                >
                  {p}
                </span>
              ))}
            </div>

            <p className="mb-1.5 mt-4 text-[11px] font-medium text-neutral-300">When</p>
            <div className="flex gap-2">
              {['Today', 'This Week', 'Later'].map(w => (
                <span
                  key={w}
                  className={`rounded-lg border px-3 py-1.5 text-[10px] font-medium ${
                    w === 'Today'
                      ? 'border-[#22C55E] text-[#22C55E]'
                      : 'border-white/[0.08] text-neutral-500'
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>

            <motion.div
              className="mt-auto mb-6 flex items-center justify-center rounded-2xl bg-[#22C55E] py-3 text-sm font-bold text-black shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
              animate={typed === TASK_TITLE ? { scale: [1, 0.96, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              Save task
            </motion.div>
          </motion.div>
        )}

        {/* ───────────── TIMER ───────────── */}
        {screen === 'timer' && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full flex-col items-center px-4 pt-8"
          >
            <div className="flex w-full items-center justify-between pb-6">
              <X className="h-4 w-4 text-white" aria-hidden />
              <span className="text-sm font-bold">Timer</span>
              <span className="w-4" />
            </div>

            <div className="mt-2">
              <ProgressRing progress={elapsed} grow={elapsed} />
            </div>

            <p className="mt-6 font-mono text-4xl font-bold tracking-tight">
              {mm}:{ss}
            </p>

            <div className="mt-5 w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <p className="text-sm font-semibold text-white">{TASK_TITLE}</p>
              <p className="mt-0.5 text-[10px] text-neutral-500">Stay focused until the ring fills.</p>
            </div>

            <div className="mt-auto mb-4 w-full">
              <div className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#22C55E] py-3 text-sm font-bold text-black">
                <Pause className="h-4 w-4 fill-current" aria-hidden /> Pause
              </div>
              <p className="mt-3 text-center text-xs font-semibold text-[#22C55E]">Give up</p>
            </div>

            {/* Completion overlay */}
            <AnimatePresence>
              {done && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0a0f0b]/90 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E] shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                  >
                    <Check className="h-8 w-8 text-black" strokeWidth={3} aria-hidden />
                  </motion.div>
                  <p className="text-sm font-semibold text-white">Session complete</p>
                  <p className="text-[10px] text-neutral-400">A tree was planted in your forest</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
