import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ForestClient from '@/components/dashboard/ForestClient'
import { fetchForestPageData } from '@/lib/dashboard/forestQueries'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { AUTH_LOGIN_PATH } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'My Forest | Kepton',
  description: 'Your live Kepton forest — trees planted from every focus session in the app.',
}

export default async function ForestPage() {
  if (!isSupabaseConfigured()) {
    redirect(`${AUTH_LOGIN_PATH}&error=config`)
  }

  const supabase = createClient()
  const user = await getAuthenticatedUser(supabase)

  if (!user) {
    redirect(AUTH_LOGIN_PATH)
  }

  const forestData = await fetchForestPageData(supabase, {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
    created_at: user.created_at,
  })

  return <ForestClient initialData={forestData} />
}
