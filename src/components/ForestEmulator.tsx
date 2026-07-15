'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Bell, CalendarDays, Leaf, Moon, TreePine, User } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const MotionImage = motion.create(Image)

export interface ForestEmulatorProps {
  phase: number
  cycle: number
  onAdvance: () => void
}

type Highlight = 'trees' | 'acres' | 'streak' | null

export default function ForestEmulator({ phase, cycle, onAdvance }: ForestEmulatorProps) {
  const [loading, setLoading] = useState(true)
  const [trees, setTrees] = useState(14)
  const [acres, setAcres] = useState('0.14')
  const [highlight, setHighlight] = useState<Highlight>(null)
  const [plant, setPlant] = useState(false)

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
        // Plant a tree
        setLoading(true)
        setTrees(14)
        setAcres('0.14')
        setHighlight(null)
        setPlant(false)
        await wait(750)
        if (cancelled) return
        setLoading(false)
        await wait(650)
        if (cancelled) return
        setHighlight('trees')
        setPlant(true)
        await wait(320)
        if (cancelled) return
        setTrees(15)
        await wait(260)
        if (cancelled) return
        setPlant(false)
        await wait(1200)
        if (cancelled) return
        advanceRef.current()
      } else if (phase === 1) {
        // Grow the island
        setLoading(false)
        setTrees(15)
        setHighlight('acres')
        await wait(500)
        if (cancelled) return
        setAcres('0.15')
        await wait(1500)
        if (cancelled) return
        advanceRef.current()
      } else {
        // Keep the streak
        setLoading(false)
        setTrees(15)
        setAcres('0.15')
        setHighlight('streak')
        await wait(1900)
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
        <div className="absolute left-2 top-24 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute right-0 top-40 h-28 w-28 rounded-full bg-emerald-600/10 blur-2xl" />
        <div className="absolute bottom-40 left-8 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />
      </div>

      {/* header */}
      <div className="relative flex items-center justify-between px-4 pb-3 pt-8">
        <h2 className="text-2xl font-bold tracking-tight">Forest</h2>
        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1">
          <Moon className="h-3 w-3 text-[#22C55E]" aria-hidden />
          <span className="text-[11px] font-medium text-neutral-300">Night</span>
        </div>
      </div>

      {/* tabs */}
      <div className="relative flex gap-2 px-4">
        {['Forest', 'Stats', 'Board'].map(t => {
          const active = t === 'Forest'
          return (
            <div
              key={t}
              className={`rounded-full border px-4 py-1.5 text-[12px] font-medium ${
                active
                  ? 'border-[#22C55E]/50 bg-[#22C55E]/15 text-[#22C55E]'
                  : 'border-white/[0.08] bg-white/[0.02] text-neutral-400'
              }`}
            >
              {t}
            </div>
          )
        })}
      </div>

      {/* island stage */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* ground glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.18),transparent_70%)] blur-xl"
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-9 w-9 rounded-full border-2 border-white/10 border-t-[#22C55E] motion-safe:animate-spin" />
              <span className="text-[11px] text-neutral-500">Growing your forest…</span>
            </motion.div>
          ) : (
            <motion.div
              key="island"
              initial={{ opacity: 0, scale: 0.86, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* floating wrapper */}
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MotionImage
                  src="/assets/forest/island.jpg"
                  alt="Your forest island"
                  width={208}
                  height={208}
                  draggable={false}
                  className="h-52 w-52 select-none object-contain mix-blend-lighten"
                  animate={{ rotate: [-1.6, 1.6, -1.6], scale: [1, 1.02, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* plant-a-tree sparkle */}
              <AnimatePresence>
                {plant && (
                  <motion.div
                    key="sparkle"
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: 1, y: -26, scale: 1 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-[#22C55E] px-2.5 py-1 text-[10px] font-bold text-black shadow-[0_0_18px_rgba(34,197,94,0.7)]"
                  >
                    +1 tree
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* stats bar */}
      <div className="relative mx-3 mb-16 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
        <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
          <Stat label="Trees Planted" value={String(trees)} active={highlight === 'trees'} pop={trees} />
          <Stat label="Acres" value={acres} active={highlight === 'acres'} pop={acres} />
          <Stat label="Streak" value="0" flame active={highlight === 'streak'} pop="s" />
        </div>
      </div>

      {/* bottom nav */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/[0.06] bg-[#0a0f0b]/90 px-2 py-2 backdrop-blur">
        {[
          { icon: Leaf, label: 'Focus', active: false },
          { icon: Bell, label: 'Reminders', active: false },
          { icon: TreePine, label: 'Forest', active: true },
          { icon: CalendarDays, label: 'Plan', active: false },
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

function Stat({
  label,
  value,
  active,
  flame,
  pop,
}: {
  label: string
  value: string
  active?: boolean
  flame?: boolean
  pop: string | number
}) {
  return (
    <div className="flex flex-col items-center px-1">
      <span
        className={`text-[8px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
          active ? 'text-[#22C55E]' : 'text-neutral-500'
        }`}
      >
        {label}
      </span>
      <div className="mt-1 flex items-center gap-1">
        <motion.span
          key={String(pop)}
          initial={{ scale: 0.6, opacity: 0.4 }}
          animate={{ scale: active ? [1, 1.18, 1] : 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`text-lg font-bold ${active ? 'text-white' : 'text-neutral-200'}`}
        >
          {value}
        </motion.span>
        {flame && (
          <motion.span
            animate={active ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] } : { scale: 1 }}
            transition={{ duration: 0.6, repeat: active ? Infinity : 0 }}
            className="text-sm"
          >
            🔥
          </motion.span>
        )}
      </div>
    </div>
  )
}
