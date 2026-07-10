'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ForestData } from '@/lib/types/forest'
import { buildForestData } from '@/lib/types/forest'
import { createClient } from '@/lib/supabase/client'
import { fetchForestTrees } from '@/lib/dashboard/forestQueries'

export function useForestRealtime(userId: string, initial: ForestData) {
  const [data, setData] = useState(initial)
  const [live, setLive] = useState(false)
  const [newTreeId, setNewTreeId] = useState<string | null>(null)
  const knownTreeIds = useRef(new Set(initial.allTrees.map(t => t.id)))

  const refreshForest = useCallback(async () => {
    const supabase = createClient()
    const { trees, streak } = await fetchForestTrees(supabase, userId)
    setData(prev => buildForestData(prev.profile, streak, trees))

    const latest = trees[trees.length - 1]
    if (latest && !knownTreeIds.current.has(latest.id) && latest.status === 'alive') {
      knownTreeIds.current.add(latest.id)
      setNewTreeId(latest.id)
      window.setTimeout(() => setNewTreeId(null), 2400)
    }

    trees.forEach(t => knownTreeIds.current.add(t.id))
  }, [userId])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`forest-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forest_trees', filter: `user_id=eq.${userId}` },
        () => {
          refreshForest()
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_streaks', filter: `user_id=eq.${userId}` },
        () => {
          refreshForest()
        },
      )
      .subscribe(status => setLive(status === 'SUBSCRIBED'))

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, refreshForest])

  return { data, live, newTreeId, refreshForest }
}
