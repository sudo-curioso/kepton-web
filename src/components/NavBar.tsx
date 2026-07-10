'use client'

import type { ReactNode } from 'react'
import GetStartedLink from '@/components/GetStartedLink'
import KeptonLogo from '@/components/KeptonLogo'

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group relative whitespace-nowrap px-1 text-[11px] font-medium tracking-wide text-neutral-400 transition-colors duration-300 hover:text-white sm:text-xs md:text-sm"
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
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How does it work', shortLabel: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#blogs', label: 'Blogs' },
  { href: '/#faqs', label: 'FAQs' },
] as const

export default function NavBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6 sm:px-6">
      <nav
        aria-label="Main navigation"
        className="pointer-events-auto relative w-full max-w-7xl overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.25),0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-[24px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(24px)_saturate(180%)]"
      >
        {/* Glass depth — frosted base tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.03] to-white/[0.01]"
        />

        {/* Specular top-edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Inner rim — glass edge catch-light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.08]"
        />

        {/* Subtle bottom inner shadow for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
        />

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
          <KeptonLogo size="md" href="/" className="min-w-0 justify-self-start" />

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
            <GetStartedLink className="rounded-lg border border-white/[0.12] bg-white/[0.92] px-3.5 py-1.5 text-xs font-semibold text-[#0a0a0a] shadow-[0_2px_12px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white sm:px-4 sm:py-2 sm:text-sm">
              Sign up
            </GetStartedLink>
          </div>
        </div>
      </nav>
    </header>
  )
}
