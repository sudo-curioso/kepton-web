'use client'

import { motion } from 'motion/react'
import { createElement, useEffect, useRef, useState, useMemo } from 'react'

type MotionTarget = Record<string, number | string>

const buildKeyframes = (from: MotionTarget, steps: MotionTarget[]) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))])
  const keyframes: Record<string, (number | string)[]> = {}
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])]
  })
  return keyframes
}

export interface BlurTextProps {
  text?: string
  delay?: number
  /** Added to every word's stagger delay (ms) — use for multi-line headlines */
  delayOffset?: number
  className?: string
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2'
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: MotionTarget
  animationTo?: MotionTarget[]
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
  /** Play animation immediately on mount (for above-the-fold hero text) */
  startImmediately?: boolean
}

export default function BlurText({
  text = '',
  delay = 200,
  delayOffset = 0,
  className = '',
  as: Tag = 'p',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  stepDuration = 0.35,
  startImmediately = false,
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(startImmediately)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (startImmediately) return
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current!)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin, startImmediately])

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  )

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  return createElement(
    Tag,
    { ref, className: `blur-text ${className}`.trim() },
    elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

        const spanTransition: {
          duration: number
          times: number[]
          delay: number
          ease: (t: number) => number
        } = {
          duration: totalDuration,
          times,
          delay: (delayOffset + index * delay) / 1000,
          ease: easing,
        }

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={`${segment}-${index}`}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        )
      }),
  )
}
