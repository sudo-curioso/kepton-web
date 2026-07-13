'use client'

import { motion } from 'motion/react'

const FOREST_SRC = '/assets/images/forest/forest_small_medium_winter.png'

export default function ForestHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-8 w-full max-w-5xl sm:mt-12 md:mt-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-40 w-[min(100%,28rem)] -translate-x-1/2 rounded-full bg-[rgba(34,197,94,0.15)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[65%] h-24 w-[min(80%,20rem)] -translate-x-1/2 rounded-full bg-[rgba(34,197,94,0.08)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"
      />
      <motion.img
        src={FOREST_SRC}
        alt="Kepton forest island — grow your focus, session by session"
        className="relative z-10 mx-auto w-full max-w-[min(92vw,22rem)] select-none object-contain mix-blend-lighten sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
