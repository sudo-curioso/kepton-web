'use client'

import Image from 'next/image'
import { motion } from 'motion/react'

const SIZE = 240
const STROKE = 12
const INNER_GAP = 26
const INNER_STROKE = 3
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = (SIZE - STROKE) / 2 - 4
const INNER_R = OUTER_R - INNER_GAP
const OUTER_C = 2 * Math.PI * OUTER_R
const INNER_C = 2 * Math.PI * INNER_R

/** ~32% elapsed — matches visual in app timer screenshot */
const PROGRESS = 0.32
const DISPLAY_TIME = '00:38'

const TREE_SRC = '/assets/images/trees/tree_pine.png'

function progressDotPosition(radius: number, progress: number) {
  const angle = -Math.PI / 2 + progress * Math.PI * 2
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  }
}

export default function FocusTimerMockup() {
  const outerDash = OUTER_C * PROGRESS
  const innerDash = INNER_C * PROGRESS
  const dot = progressDotPosition(INNER_R, PROGRESS)

  return (
    <div className="relative mx-auto flex w-full max-w-[min(100%,280px)] flex-col items-center py-2 sm:max-w-[280px]">
      {/* Ambient bokeh — floats on parent glass card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-2 h-28 w-28 rounded-full bg-[#22C55E]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 bottom-12 h-24 w-24 rounded-full bg-[#4ADE80]/08 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22C55E]/06 blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="absolute inset-0"
            aria-hidden
          >
            <defs>
              <linearGradient id="focusTimerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="55%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>
              <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer track */}
            <circle
              cx={CX}
              cy={CY}
              r={OUTER_R}
              fill="none"
              stroke="#1E293B"
              strokeWidth={STROKE}
              opacity={0.45}
            />

            {/* Inner track */}
            <circle
              cx={CX}
              cy={CY}
              r={INNER_R}
              fill="none"
              stroke="#1E293B"
              strokeWidth={INNER_STROKE}
              opacity={0.35}
            />

            <g transform={`rotate(-90 ${CX} ${CY})`}>
              {/* Outer progress arc */}
              <circle
                cx={CX}
                cy={CY}
                r={OUTER_R}
                fill="none"
                stroke="url(#focusTimerGrad)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${outerDash} ${OUTER_C}`}
              />

              {/* Inner progress arc */}
              <circle
                cx={CX}
                cy={CY}
                r={INNER_R}
                fill="none"
                stroke="url(#focusTimerGrad)"
                strokeWidth={INNER_STROKE}
                strokeLinecap="round"
                opacity={0.85}
                strokeDasharray={`${innerDash} ${INNER_C}`}
              />
            </g>

            {/* Progress dot on inner ring */}
            <circle
              cx={dot.x}
              cy={dot.y}
              r={5}
              fill="#4ADE80"
              filter="url(#dotGlow)"
            />
            <circle cx={dot.x} cy={dot.y} r={2.2} fill="#F0FDF4" />
          </svg>

          {/* Pine tree island — single asset, centered in ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative flex items-center justify-center"
              style={{ width: OUTER_R * 1.22, height: OUTER_R * 1.22 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src={TREE_SRC}
                alt="Kepton focus timer with a growing pine tree"
                width={Math.round(OUTER_R * 1.22)}
                height={Math.round(OUTER_R * 1.22)}
                draggable={false}
                className="relative z-10 h-full w-full select-none object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>
        </div>

        <p className="mt-1 font-mono text-[2rem] font-bold tracking-tight text-[#E2E8F0] tabular-nums">
          {DISPLAY_TIME}
        </p>
      </div>
    </div>
  )
}
