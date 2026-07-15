'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { AUTH_SIGNUP_PATH } from '@/lib/constants'
import { getPlayStoreUrl, isPlayStoreLive } from '@/lib/playStore'

/** Official Google Play badge (646×250). Source: Google Play badge assets. */
const GOOGLE_PLAY_BADGE = '/assets/google-play-badge.png'
const BADGE_ASPECT = 646 / 250

const BADGE_HEIGHT = { sm: 48, md: 56, lg: 64 } as const

type GooglePlayDownloadButtonProps = {
  size?: keyof typeof BADGE_HEIGHT
  className?: string
  showHint?: boolean
}

function PlayStoreBadge({ size }: { size: keyof typeof BADGE_HEIGHT }) {
  const height = BADGE_HEIGHT[size]
  const width = Math.round(height * BADGE_ASPECT)

  return (
    <Image
      src={GOOGLE_PLAY_BADGE}
      alt="Get it on Google Play"
      width={width}
      height={height}
      className="block"
      style={{ width, height }}
      priority={size === 'lg'}
    />
  )
}

export default function GooglePlayDownloadButton({
  size = 'md',
  className = '',
  showHint = false,
}: GooglePlayDownloadButtonProps) {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const live = isPlayStoreLive()
  const url = getPlayStoreUrl()

  const baseClass =
    'group inline-flex flex-col items-start gap-2 rounded-md transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]'

  const badge = (
    <>
      <PlayStoreBadge size={size} />
      {!live && (
        <span className="text-[11px] font-medium text-neutral-500">Android app coming soon</span>
      )}
      {showHint && live && (
        <span className="text-xs text-neutral-500 transition-colors group-hover:text-neutral-400">
          Tap to open Google Play Store
        </span>
      )}
    </>
  )

  if (live) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${className}`}
        aria-label="Get Kepton on Google Play"
      >
        {badge}
      </a>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          setShowComingSoon(true)
          window.setTimeout(() => setShowComingSoon(false), 5000)
        }}
        className={baseClass}
        aria-label="Kepton on Google Play — coming soon"
      >
        {badge}
      </button>

      {showComingSoon && (
        <div
          role="status"
          className="absolute left-0 top-full z-20 mt-3 w-64 rounded-2xl border border-white/[0.1] bg-[#141414] p-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          <p className="text-sm font-semibold text-white">Coming soon to Google Play</p>
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
            We&apos;re putting the finishing touches on the Android app. Create an account now
            and you&apos;ll be first to download when we launch.
          </p>
          <Link
            href={AUTH_SIGNUP_PATH}
            className="mt-3 inline-flex text-xs font-semibold text-[#22C55E] hover:underline"
          >
            Sign up for early access →
          </Link>
        </div>
      )}
    </div>
  )
}
