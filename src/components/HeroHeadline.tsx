'use client'

import { useMemo } from 'react'
import BlurText from '@/components/BlurText'

const LINES = [
  'Time is not a ladder to climb;',
  'it is a landscape to explore.',
  'Let us change the map so you can',
  'finally enjoy the journey.',
] as const

const HEADLINE_CLASS =
  'block text-center font-display text-[1.75rem] font-normal leading-[1.24] tracking-[0.015em] text-white/95 min-[400px]:text-[1.875rem] sm:text-5xl sm:leading-[1.18] sm:tracking-[0.012em] md:text-[3.25rem] md:leading-[1.16] lg:text-[3.5rem]'

export default function HeroHeadline() {
  const lineOffsets = useMemo(() => {
    let wordCount = 0
    return LINES.map(line => {
      const offset = wordCount
      wordCount += line.split(' ').length
      return offset
    })
  }, [])

  return (
    <h1
      className="mx-auto max-w-4xl text-balance"
      style={{ fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1' }}
    >
      {LINES.map((line, i) => (
        <BlurText
          key={line}
          as="span"
          text={line}
          animateBy="words"
          direction="top"
          delay={100}
          delayOffset={lineOffsets[i] * 100}
          startImmediately
          stepDuration={0.38}
          className={HEADLINE_CLASS}
        />
      ))}
    </h1>
  )
}
