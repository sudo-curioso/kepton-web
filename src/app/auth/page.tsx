import AuthPage from '@/components/AuthPage'

type AuthPageProps = {
  searchParams: { mode?: string }
}

export default function AuthRoutePage({ searchParams }: AuthPageProps) {
  const initialMode = searchParams.mode === 'login' ? 'login' : 'signup'
  return <AuthPage initialMode={initialMode} />
}
