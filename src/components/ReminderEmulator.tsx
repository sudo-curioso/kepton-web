'use client'

import { AnimatePresence, motion } from 'motion/react'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Trash2,
  TreePine,
  User,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const R_TITLE = 'Medicine'
const R_NOTES = 'Tommorow'

type Screen = 'list' | 'form' | 'saved'

export interface ReminderEmulatorProps {
  phase: number
  cycle: number
  onAdvance: () => void
}

interface Reminder {
  time: string
  meridiem: string
  title: string
  date: string
}

const BASE_REMINDERS: Reminder[] = [
  { time: '4:50', meridiem: 'pm', title: 'Study', date: 'Mon, 8 Jun 2026' },
]

const NEW_REMINDER: Reminder = {
  time: '9:00',
  meridiem: 'am',
  title: R_TITLE,
  date: 'Tue, 9 Jun 2026',
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const MERIDIEM = ['AM', 'PM']

// ───────────────────────── Wheel column ─────────────────────────
function WheelColumn({
  values,
  selected,
  wide = false,
}: {
  values: string[]
  selected: number
  wide?: boolean
}) {
  const ITEM = 34
  return (
    <div className="relative overflow-hidden" style={{ height: ITEM * 3 }}>
      <motion.div
        animate={{ y: -(selected - 1) * ITEM }}
        transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        className="flex flex-col"
      >
        {values.map((v, i) => {
          const dist = Math.abs(i - selected)
          const isSel = i === selected
          return (
            <div
              key={v + i}
              className="flex items-center justify-center"
              style={{ height: ITEM }}
            >
              <span
                className={
                  isSel
                    ? `font-bold text-white ${wide ? 'text-2xl' : 'text-3xl'}`
                    : `font-medium ${wide ? 'text-base' : 'text-lg'}`
                }
                style={{
                  opacity: isSel ? 1 : dist === 1 ? 0.4 : 0.15,
                  color: isSel ? '#fff' : '#6b7280',
                }}
              >
                {v}
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

// ───────────────────────── Reminder card ─────────────────────────
function ReminderCard({ r, isNew }: { r: Reminder; isNew?: boolean }) {
  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: -14, scale: 0.94 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`overflow-hidden rounded-2xl border p-3 ${
        isNew
          ? 'border-[#22C55E]/40 bg-[#22C55E]/[0.06]'
          : 'border-white/[0.07] bg-white/[0.03]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-14 shrink-0">
          <p className="flex items-baseline gap-1 text-[15px] font-bold leading-none text-[#3ee07a]">
            {r.time}
            <span className="text-[10px] font-semibold">{r.meridiem}</span>
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white">{r.title}</p>
          <p className="mt-0.5 text-[9px] text-neutral-500">{r.date}</p>
        </div>
        <button
          type="button"
          aria-label="Delete reminder"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-neutral-600 transition-colors hover:bg-white/[0.05] hover:text-neutral-400"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </motion.div>
  )
}

export default function ReminderEmulator({ phase, cycle, onAdvance }: ReminderEmulatorProps) {
  const [screen, setScreen] = useState<Screen>('list')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [showCal, setShowCal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hour, setHour] = useState(1) // index into HOURS (02)
  const [minute, setMinute] = useState(2)
  const [mer, setMer] = useState(0)
  const [daySel, setDaySel] = useState(0)
  const [tapFab, setTapFab] = useState(false)
  const [added, setAdded] = useState(false)

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
        // Phase 1 — capture the reminder
        setScreen('list')
        setAdded(false)
        setTitle('')
        setNotes('')
        setShowCal(false)
        setScrolled(false)
        setHour(1)
        setMinute(2)
        setMer(0)
        setDaySel(0)
        await wait(900)
        if (cancelled) return
        setTapFab(true)
        await wait(260)
        if (cancelled) return
        setTapFab(false)
        setScreen('form')
        await wait(650)
        for (let i = 0; i <= R_TITLE.length; i++) {
          if (cancelled) return
          setTitle(R_TITLE.slice(0, i))
          await wait(60)
        }
        await wait(450)
        for (let i = 0; i <= R_NOTES.length; i++) {
          if (cancelled) return
          setNotes(R_NOTES.slice(0, i))
          await wait(60)
        }
        await wait(700)
        if (cancelled) return
        advanceRef.current()
      } else if (phase === 1) {
        // Phase 2 — pick time & date
        setScreen('form')
        setTitle(R_TITLE)
        setNotes(R_NOTES)
        setShowCal(false)
        setScrolled(false)
        setAdded(false)
        setHour(1)
        setMinute(2)
        setMer(0)
        setDaySel(0)
        await wait(600)
        if (cancelled) return
        setHour(8) // 09
        await wait(650)
        if (cancelled) return
        setMinute(0) // 00
        await wait(700)
        if (cancelled) return
        setScrolled(true) // scroll form up
        await wait(450)
        if (cancelled) return
        setShowCal(true)
        await wait(750)
        if (cancelled) return
        setDaySel(10) // Wed 10
        await wait(1100)
        if (cancelled) return
        advanceRef.current()
      } else {
        // Phase 3 — save & get reminded
        setScreen('form')
        setTitle(R_TITLE)
        setNotes(R_NOTES)
        setHour(8)
        setMinute(0)
        setMer(0)
        setShowCal(true)
        setScrolled(true)
        setDaySel(10)
        setAdded(false)
        await wait(600)
        if (cancelled) return
        setScreen('saved')
        await wait(1200)
        if (cancelled) return
        setScreen('list')
        setAdded(true)
        await wait(2200)
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

  const reminders = added ? [NEW_REMINDER, ...BASE_REMINDERS] : BASE_REMINDERS

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0f0b] text-white">
      {/* ambient bokeh */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-6 top-24 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute -right-8 bottom-28 h-32 w-32 rounded-full bg-emerald-600/10 blur-2xl" />
      </div>

      <AnimatePresence mode="wait">
        {/* ───────────── REMINDERS LIST ───────────── */}
        {screen === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full flex-col px-4 pt-8"
          >
            <h2 className="mb-4 text-2xl font-bold tracking-tight">Reminders</h2>
            <div className="flex flex-col gap-2.5">
              {reminders.map((r, i) => (
                <ReminderCard key={r.title + i} r={r} isNew={added && i === 0} />
              ))}
            </div>

            {/* FAB */}
            <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2">
              <motion.div
                animate={tapFab ? { scale: 0.86 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#22C55E] shadow-[0_0_28px_rgba(34,197,94,0.55)]"
              >
                <span className="text-3xl font-light leading-none text-black">+</span>
              </motion.div>
            </div>

            {/* bottom nav */}
            <BottomNav />
          </motion.div>
        )}

        {/* ───────────── SET REMINDER FORM ───────────── */}
        {(screen === 'form' || screen === 'saved') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full flex-col"
          >
            {/* header */}
            <div className="flex items-center gap-2 px-4 pb-3 pt-8">
              <ChevronDown className="h-5 w-5 text-[#22C55E]" aria-hidden />
              <span className="text-lg font-bold">Set Reminder</span>
            </div>

            {/* scrollable body */}
            <div className="relative flex-1 overflow-hidden px-4">
              <motion.div
                animate={{ y: scrolled ? -196 : 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                className="flex flex-col gap-4"
              >
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-[11px] text-neutral-400">Title (optional)</label>
                  <div className="flex h-10 items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-[13px]">
                    {title ? (
                      <span className="text-white">{title}</span>
                    ) : (
                      <span className="truncate text-neutral-600">
                        Short header — defaults to first line of…
                      </span>
                    )}
                    {screen === 'form' && title.length < R_TITLE.length && title.length > 0 && (
                      <Caret />
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-[11px] text-neutral-400">Details / Notes</label>
                  <div className="h-16 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-[13px]">
                    {notes ? (
                      <span className="text-white">{notes}</span>
                    ) : (
                      <span className="text-neutral-600">Add details for this reminder…</span>
                    )}
                    {screen === 'form' &&
                      notes.length > 0 &&
                      notes.length < R_NOTES.length &&
                      title.length === R_TITLE.length && <Caret />}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-1.5 block text-[11px] text-neutral-400">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map(p => {
                      const active = p === 'Medium'
                      return (
                        <div
                          key={p}
                          className={`flex h-9 items-center justify-center rounded-lg border text-[12px] font-medium ${
                            active
                              ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
                              : 'border-white/[0.08] bg-white/[0.02] text-neutral-400'
                          }`}
                        >
                          {p}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Time picker */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                  <p className="mb-1 text-center text-[12px] text-neutral-400">Select Time</p>
                  <div className="relative">
                    {/* selection guides */}
                    <div className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-[17px] border-t border-[#22C55E]/40" />
                    <div className="pointer-events-none absolute inset-x-2 top-1/2 translate-y-[17px] border-t border-[#22C55E]/40" />
                    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
                      <WheelColumn values={HOURS} selected={hour} />
                      <span className="pb-1 text-2xl font-bold text-white">:</span>
                      <WheelColumn values={MINUTES} selected={minute} />
                      <span className="w-2" />
                      <WheelColumn values={MERIDIEM} selected={mer} wide />
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <AnimatePresence>
                  {showCal && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <div className="mb-2 flex items-center justify-between px-1">
                        <ChevronLeft className="h-4 w-4 text-neutral-500" aria-hidden />
                        <span className="text-[13px] font-semibold text-white">June 2026</span>
                        <ChevronRight className="h-4 w-4 text-neutral-500" aria-hidden />
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-neutral-500">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <span key={d} className="py-0.5">
                            {d}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 grid grid-cols-7 gap-1">
                        <span />
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
                          const isSel = d === daySel
                          const past = d < 7
                          return (
                            <div
                              key={d}
                              className="flex items-center justify-center py-0.5"
                            >
                              <motion.span
                                animate={isSel ? { scale: [0.6, 1.15, 1] } : { scale: 1 }}
                                transition={{ duration: 0.35 }}
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                                  isSel
                                    ? 'bg-[#22C55E] font-bold text-black shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                                    : past
                                      ? 'text-neutral-700'
                                      : 'bg-white/[0.03] text-neutral-300'
                                }`}
                              >
                                {d}
                              </motion.span>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Save button (pinned) */}
            <div className="px-4 pb-6 pt-3">
              <motion.div
                animate={screen === 'saved' ? { scale: 0.96 } : { scale: 1 }}
                className="flex items-center justify-center rounded-xl bg-[#22C55E] py-3.5 text-[15px] font-bold text-black shadow-[0_8px_30px_rgba(34,197,94,0.35)]"
              >
                Save Reminder
              </motion.div>
            </div>

            {/* success overlay */}
            <AnimatePresence>
              {screen === 'saved' && (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0a0f0b]/92 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E] shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                  >
                    <Check className="h-8 w-8 text-black" strokeWidth={3} aria-hidden />
                  </motion.div>
                  <p className="text-sm font-semibold text-white">Reminder set</p>
                  <p className="text-[10px] text-neutral-400">We&apos;ll nudge you at 9:00 AM</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-4 w-[2px] bg-[#22C55E]"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity }}
    />
  )
}

function BottomNav() {
  const items = [
    { icon: Leaf, label: 'Focus', active: false },
    { icon: Bell, label: 'Reminders', active: true },
    { icon: TreePine, label: 'Forest', active: false },
    { icon: CalendarDays, label: 'Plan', active: false },
    { icon: User, label: 'Profile', active: false },
  ]
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/[0.06] bg-[#0a0f0b]/90 px-2 py-2 backdrop-blur">
      {items.map(({ icon: Icon, label, active }) => (
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
  )
}
