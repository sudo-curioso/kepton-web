import Link from 'next/link'

const MARK_PX = {
  sm: 32,
  md: 36,
  lg: 40,
  xl: 44,
} as const

type MarkSize = keyof typeof MARK_PX

type KeptonLogoProps = {
  size?: MarkSize
  showWordmark?: boolean
  wordmarkClassName?: string
  href?: string | null
  className?: string
}

/** Crisp vector mark — white atom on dark tile, scales without blur */
export function KeptonMark({
  size = 'md',
  className = '',
}: {
  size?: MarkSize
  className?: string
}) {
  const px = MARK_PX[size]

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] bg-[#141414] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_2px_8px_rgba(0,0,0,0.45)] ${className}`}
      style={{ width: px, height: px }}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        width={px}
        height={px}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <rect width="32" height="32" rx="7" fill="#141414" />
        <circle cx="16" cy="16" r="2.25" fill="#FFFFFF" />
        <ellipse
          cx="16"
          cy="16"
          rx="11"
          ry="4.25"
          stroke="#FFFFFF"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="11"
          ry="4.25"
          stroke="#FFFFFF"
          strokeWidth="1.85"
          strokeLinecap="round"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="11"
          ry="4.25"
          stroke="#FFFFFF"
          strokeWidth="1.85"
          strokeLinecap="round"
          transform="rotate(120 16 16)"
        />
      </svg>
    </span>
  )
}

export default function KeptonLogo({
  size = 'md',
  showWordmark = true,
  wordmarkClassName = 'text-sm font-semibold tracking-tight text-white',
  href = '/',
  className = '',
}: KeptonLogoProps) {
  const content = (
    <>
      <KeptonMark size={size} />
      {showWordmark && <span className={wordmarkClassName}>Kepton</span>}
    </>
  )

  const classes = `inline-flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-90 ${className}`

  if (href) {
    return (
      <Link href={href} className={classes} aria-label="Kepton home">
        {content}
      </Link>
    )
  }

  return <span className={classes}>{content}</span>
}
