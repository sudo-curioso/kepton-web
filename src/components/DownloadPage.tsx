'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DASHBOARD_PATH, AUTH_LOGIN_PATH } from '@/lib/constants'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/client'

export default function DownloadPage() {
  const router = useRouter()

  useEffect(() => {
    async function routeUser() {
      if (!isSupabaseConfigured()) {
        router.replace(AUTH_LOGIN_PATH)
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.replace(DASHBOARD_PATH)
        return
      }

      router.replace(AUTH_LOGIN_PATH)
    }

    routeUser()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#22C55E] border-t-transparent" />
    </div>
  )
}
