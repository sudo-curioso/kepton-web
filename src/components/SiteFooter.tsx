import Link from 'next/link'
import { Mail } from 'lucide-react'
import { POLICY_LINKS } from '@/lib/policies'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/lib/constants'
import KeptonLogo from './KeptonLogo'
import GooglePlayDownloadButton from './GooglePlayDownloadButton'

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <KeptonLogo size="md" href="/" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              Focus tools built for clarity — grow your forest with every session.
            </p>
            <div className="mt-6">
              <GooglePlayDownloadButton size="md" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
              Contact &amp; Support
            </p>
            <a
              href={SUPPORT_MAILTO}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#22C55E]"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#22C55E]" aria-hidden />
              {SUPPORT_EMAIL}
            </a>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-500">
              Questions, feedback, billing help, or account support — we read every message.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5">
              {POLICY_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Kepton. All rights reserved.</p>
          <p className="max-w-full break-words leading-relaxed">
            Operated by 2 Bros, Pune, Maharashtra, India ·{' '}
            <a href={SUPPORT_MAILTO} className="text-neutral-500 transition-colors hover:text-[#22C55E]">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
