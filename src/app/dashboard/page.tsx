import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import DashboardClient from '@/components/dashboard/DashboardClient'
import { fetchDashboardData } from '@/lib/dashboard/queries'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { AUTH_LOGIN_PATH } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Dashboard | Kepton',
  description: 'Your Kepton forest, tasks, and focus stats — synced live from the app.',
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect(`${AUTH_LOGIN_PATH}&error=config`)
  }

  const supabase = createClient()
  const user = await getAuthenticatedUser(supabase)

  if (!user) {
    redirect(AUTH_LOGIN_PATH)
  }

  const dashboardData = await fetchDashboardData(supabase, {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
    created_at: user.created_at,
  })

  return <DashboardClient initialData={dashboardData} />
}
