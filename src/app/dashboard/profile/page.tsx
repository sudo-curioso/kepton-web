import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProfileClient from '@/components/dashboard/ProfileClient'
import { fetchProfilePageData } from '@/lib/dashboard/queries'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { AUTH_LOGIN_PATH } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Profile | Kepton',
  description: 'Manage your Kepton account and data preferences.',
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    redirect(`${AUTH_LOGIN_PATH}&error=config`)
  }

  const supabase = createClient()
  const user = await getAuthenticatedUser(supabase)

  if (!user) {
    redirect(AUTH_LOGIN_PATH)
  }

  const profile = await fetchProfilePageData(supabase, {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
    created_at: user.created_at,
  })

  return <ProfileClient profile={profile} />
}
