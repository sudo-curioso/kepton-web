import type { ForestTree } from '@/lib/types/dashboard'
import { TREE_HD_DIR, TREE_LEGACY_DIR } from './renderConfig'

/** Maps app tree_type to growth frame in /assets/tree/tree_XX.jpg */
export const TREE_TYPE_FRAME: Record<string, number> = {
  sprout: 6,
  baby: 12,
  half: 20,
  flowering: 28,
  large: 36,
  full: 46,
  dead: 10,
}

export const TREE_TYPE_COLORS: Record<string, string> = {
  sprout: '#86efac',
  baby: '#4ade80',
  half: '#22c55e',
  flowering: '#f472b6',
  large: '#15803d',
  full: '#10b981',
  dead: '#737373',
}

export function treeFrame(treeType: string, status: string): number {
  return status === 'dead' ? TREE_TYPE_FRAME.dead : (TREE_TYPE_FRAME[treeType] ?? 20)
}

export function treeImageSrc(treeType: string, status: string, hd = true): string {
  const frame = treeFrame(treeType, status)
  const name = `tree_${String(frame).padStart(2, '0')}`
  return hd ? `${TREE_HD_DIR}/${name}.png` : `${TREE_LEGACY_DIR}/${name}.jpg`
}

export function preloadTreeImages(trees: ForestTree[]): string[] {
  const frames = new Set<number>()
  for (const tree of trees) {
    frames.add(treeFrame(tree.tree_type, tree.status))
  }
  return Array.from(frames).map(f => `${TREE_HD_DIR}/tree_${String(f).padStart(2, '0')}.png`)
}

export type TreePlacement = {
  id: string
  left: string
  bottom: string
  scale: number
  zIndex: number
  rotation: number
  tree: ForestTree
}

/** Golden-angle spiral on an island ellipse — natural depth ordering */
export function computeTreePlacements(trees: ForestTree[]): TreePlacement[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const cx = 50
  const cy = 36

  return trees.map((tree, i) => {
    const angle = i * golden + ((tree.id.charCodeAt(0) % 10) / 10) * 0.4
    const radius = 6 + Math.sqrt(i + 1) * 5.2
    const x = cx + Math.cos(angle) * radius * 1.15
    const y = cy + Math.sin(angle) * radius * 0.48
    const depth = y
    const sizeBoost = (tree.timer_duration ?? 25) / 60

    return {
      id: tree.id,
      left: `${Math.max(6, Math.min(88, x))}%`,
      bottom: `${Math.max(10, Math.min(58, y))}%`,
      scale: 0.38 + Math.min(sizeBoost, 0.35) + (i % 3) * 0.06,
      zIndex: Math.round(depth * 10) + i,
      rotation: ((tree.id.charCodeAt(2) ?? 0) % 9) - 4,
      tree,
    }
  })
}
