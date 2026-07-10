'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ForestTree } from '@/lib/types/dashboard'
import {
  FOREST_CANVAS_MAX_HEIGHT,
  FOREST_CANVAS_MAX_WIDTH,
  FOREST_ISLAND_FALLBACK_SRC,
  FOREST_ISLAND_SRC,
} from '@/lib/forest/renderConfig'
import { computeTreePlacements, preloadTreeImages, treeImageSrc } from '@/lib/forest/treeAssets'

type ForestSceneCanvasProps = {
  trees: ForestTree[]
  newTreeId?: string | null
  onHoverChange?: (treeId: string | null) => void
}

type LoadedImage = HTMLImageElement

function loadImage(src: string): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

function resolveCanvasSize(width: number, height: number, dpr: number) {
  const scale = Math.min(dpr, FOREST_CANVAS_MAX_WIDTH / Math.max(width, 1))
  const pixelW = Math.min(Math.round(width * scale), FOREST_CANVAS_MAX_WIDTH)
  const pixelH = Math.min(Math.round(height * scale), FOREST_CANVAS_MAX_HEIGHT)
  return { pixelW, pixelH, scale }
}

export default function ForestSceneCanvas({ trees, newTreeId, onHoverChange }: ForestSceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const islandRef = useRef<LoadedImage | null>(null)
  const treeCacheRef = useRef<Map<string, LoadedImage>>(new Map())
  const animRef = useRef<number>(0)
  const newTreeStartRef = useRef<number | null>(null)
  const hoveredRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)

  const placements = useMemo(() => computeTreePlacements(trees), [trees])

  useEffect(() => {
    if (newTreeId) newTreeStartRef.current = performance.now()
  }, [newTreeId])

  useEffect(() => {
    let cancelled = false

    async function loadAssets() {
      const cache = treeCacheRef.current
      const urls = [FOREST_ISLAND_SRC, FOREST_ISLAND_FALLBACK_SRC, ...preloadTreeImages(trees)]

      for (const tree of trees) {
        urls.push(treeImageSrc(tree.tree_type, tree.status))
      }

      const unique = Array.from(new Set(urls))

      try {
        const island = await loadImage(FOREST_ISLAND_SRC)
        if (!cancelled) islandRef.current = island
      } catch {
        const fallback = await loadImage(FOREST_ISLAND_FALLBACK_SRC)
        if (!cancelled) islandRef.current = fallback
      }

      await Promise.all(
        unique
          .filter(u => u.includes('/tree/'))
          .map(async src => {
            if (cache.has(src)) return
            try {
              const img = await loadImage(src)
              if (!cancelled) cache.set(src, img)
            } catch {
              /* skip broken frame */
            }
          }),
      )

      if (!cancelled) setReady(true)
    }

    setReady(false)
    loadAssets()
    return () => {
      cancelled = true
    }
  }, [trees])

  const draw = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const island = islandRef.current
    if (!container || !canvas || !island) return

    const rect = container.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const { pixelW, pixelH } = resolveCanvasSize(rect.width, rect.height, dpr)

    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW
      canvas.height = pixelH
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, pixelW, pixelH)

    const glow = ctx.createRadialGradient(pixelW * 0.5, pixelH * 0.2, 0, pixelW * 0.5, pixelH * 0.2, pixelW * 0.55)
    glow.addColorStop(0, 'rgba(34,197,94,0.18)')
    glow.addColorStop(1, 'rgba(34,197,94,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, pixelW, pixelH)

    const islandAspect = island.width / island.height
    const viewAspect = pixelW / pixelH
    let drawW: number
    let drawH: number
    let drawX: number
    let drawY: number

    if (islandAspect > viewAspect) {
      drawH = pixelH * 1.08
      drawW = drawH * islandAspect
      drawX = (pixelW - drawW) / 2
      drawY = pixelH * 0.02
    } else {
      drawW = pixelW * 1.02
      drawH = drawW / islandAspect
      drawX = (pixelW - drawW) / 2
      drawY = pixelH - drawH + pixelH * 0.06
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(island, drawX, drawY, drawW, drawH)

    const vignette = ctx.createRadialGradient(
      pixelW * 0.5,
      pixelH * 0.45,
      pixelW * 0.15,
      pixelW * 0.5,
      pixelH * 0.45,
      pixelW * 0.72,
    )
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,0.38)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, pixelW, pixelH)

    const bottomGrad = ctx.createLinearGradient(0, pixelH * 0.55, 0, pixelH)
    bottomGrad.addColorStop(0, 'rgba(10,10,10,0)')
    bottomGrad.addColorStop(1, 'rgba(10,10,10,0.82)')
    ctx.fillStyle = bottomGrad
    ctx.fillRect(0, 0, pixelW, pixelH)

    const sorted = [...placements].sort((a, b) => a.zIndex - b.zIndex)
    const now = performance.now()
    const newStart = newTreeStartRef.current

    for (const placement of sorted) {
      const src = treeImageSrc(placement.tree.tree_type, placement.tree.status)
      const img = treeCacheRef.current.get(src)
      if (!img) continue

      const leftPct = parseFloat(placement.left)
      const bottomPct = parseFloat(placement.bottom)
      const cx = (leftPct / 100) * pixelW
      const cy = pixelH - (bottomPct / 100) * pixelH

      let scale = placement.scale
      const isNew = placement.id === newTreeId && newStart
      if (isNew) {
        const t = Math.min(1, (now - newStart) / 700)
        const spring = 1 - Math.pow(1 - t, 3)
        scale *= 0.15 + spring * 0.85
      }
      if (placement.id === hoveredRef.current) scale *= 1.12

      const treeW = pixelW * 0.11 * scale
      const treeH = (img.height / img.width) * treeW

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((placement.rotation * Math.PI) / 180)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, -treeW / 2, -treeH, treeW, treeH)

      if (placement.id === hoveredRef.current) {
        ctx.fillStyle = 'rgba(34,197,94,0.35)'
        ctx.beginPath()
        ctx.ellipse(0, -4, treeW * 0.35, treeW * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }
  }, [placements, newTreeId])

  useEffect(() => {
    if (!ready) return

    const tick = () => {
      draw()
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [ready, draw])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ro = new ResizeObserver(() => draw())
    ro.observe(container)
    return () => ro.disconnect()
  }, [draw])

  const hitTest = useCallback(
    (clientX: number, clientY: number): string | null => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return null

      const rect = canvas.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * canvas.width
      const y = ((clientY - rect.top) / rect.height) * canvas.height

      const sorted = [...placements].sort((a, b) => b.zIndex - a.zIndex)
      for (const p of sorted) {
        const leftPct = parseFloat(p.left)
        const bottomPct = parseFloat(p.bottom)
        const cx = (leftPct / 100) * canvas.width
        const cy = canvas.height - (bottomPct / 100) * canvas.height
        const treeW = canvas.width * 0.11 * p.scale
        const treeH = treeW * 1.2

        if (x >= cx - treeW / 2 && x <= cx + treeW / 2 && y >= cy - treeH && y <= cy + treeH * 0.15) {
          return p.id
        }
      }
      return null
    },
    [placements],
  )

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      const id = hitTest(clientX, clientY)
      if (id !== hoveredRef.current) {
        hoveredRef.current = id
        onHoverChange?.(id)
      }
    },
    [hitTest, onHoverChange],
  )

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onMouseMove={e => handlePointer(e.clientX, e.clientY)}
      onMouseLeave={() => {
        hoveredRef.current = null
        onHoverChange?.(null)
      }}
      onTouchStart={e => {
        const t = e.touches[0]
        if (t) handlePointer(t.clientX, t.clientY)
      }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ imageRendering: 'pixelated' }}
        aria-hidden
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#07100c]">
          <div className="h-8 w-8 animate-pulse rounded-full border-2 border-[#22C55E]/30 border-t-[#22C55E]" />
        </div>
      )}
    </div>
  )
}
