'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import GetStartedLink from '@/components/GetStartedLink'
import KeptonLogo from '@/components/KeptonLogo'

function NavLink({
  href,
  children,
  onClick,
  className = '',
}: {
  href: string
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative whitespace-nowrap text-[11px] font-medium tracking-wide text-neutral-400 transition-colors duration-300 hover:text-white sm:text-xs md:text-sm ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-1/2 hidden h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-300 group-hover:w-full lg:block"
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

function NavChrome({ children }: { children: ReactNode }) {
  return (
    <nav
      aria-label="Main navigation"
      className="pointer-events-auto relative w-full max-w-7xl overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.25),0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-[24px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(24px)_saturate(180%)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.03] to-white/[0.01]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
      />
      {children}
    </nav>
  )
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
      <NavChrome>
        {/* Desktop — unchanged layout at lg+ */}
        <div className="relative hidden grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3 lg:grid">
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

        {/* Mobile / tablet — logo + CTA + menu */}
        <div className="relative flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 lg:hidden">
          <KeptonLogo
            size="md"
            href="/"
            wordmarkClassName="hidden min-[400px]:inline text-sm font-semibold tracking-tight text-white"
            className="min-w-0"
          />

          <div className="flex items-center gap-2">
            <GetStartedLink className="inline-flex min-h-11 items-center rounded-lg border border-white/[0.12] bg-white/[0.92] px-3.5 py-2 text-xs font-semibold text-[#0a0a0a] shadow-[0_2px_12px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white sm:px-4 sm:text-sm">
              Sign up
            </GetStartedLink>
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.06] text-white transition-colors hover:bg-white/[0.10]"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
      </NavChrome>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <motion.div
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto fixed inset-x-4 top-[calc(max(1.25rem,env(safe-area-inset-top))+4.25rem)] z-50 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:hidden"
            >
              <nav className="flex flex-col p-2">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-neutral-200 transition-colors hover:bg-white/[0.06] hover:text-white active:bg-white/[0.08]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
