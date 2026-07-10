import Link from 'next/link'
import type { ReactNode } from 'react'
import { AUTH_SIGNUP_PATH } from '@/lib/constants'

type GetStartedLinkProps = {
  children: ReactNode
  className?: string
  href?: string
}

export default function GetStartedLink({
  children,
  className,
  href = AUTH_SIGNUP_PATH,
}: GetStartedLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
