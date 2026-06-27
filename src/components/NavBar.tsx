'use client'

import type { ReactNode } from 'react'

function ReactBitsLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
    </svg>
  )
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group relative whitespace-nowrap px-1 text-[11px] font-medium tracking-wide text-zinc-400 transition-colors duration-300 hover:text-white sm:text-xs md:text-sm"
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-300 group-hover:w-full"
      />
    </a>
  )
}

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How does it work', shortLabel: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#blogs', label: 'Blogs' },
  { href: '#faqs', label: 'FAQs' },
] as const

export default function NavBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5 sm:pt-6">
      <nav
        aria-label="Main navigation"
        className="pointer-events-auto relative w-full max-w-7xl overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.04] shadow-[0_8px_40px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.14),inset_0_-1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-2xl backdrop-saturate-150"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.09] via-white/[0.02] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.06]"
        />

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
          <a
            href="/"
            className="flex min-w-0 items-center gap-2.5 justify-self-start text-white transition-opacity duration-300 hover:opacity-90"
          >
            <ReactBitsLogo />
            <span className="text-sm font-semibold tracking-tight">Kepton</span>
          </a>

          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {NAV_LINKS.map(link => (
              <NavLink key={link.href} href={link.href}>
                {'shortLabel' in link && link.shortLabel ? (
                  <>
                    <span className="hidden md:inline">{link.label}</span>
                    <span className="md:hidden">{link.shortLabel}</span>
                  </>
                ) : (
                  link.label
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex justify-end justify-self-end">
            <button
              type="button"
              className="rounded-lg border border-white/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-black shadow-[0_2px_12px_rgba(255,255,255,0.15)] transition-all duration-300 hover:border-white/40 hover:bg-zinc-100 sm:px-4 sm:py-2 sm:text-sm"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
