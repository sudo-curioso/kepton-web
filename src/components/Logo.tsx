import type { SVGProps } from 'react'

export type LogoProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  /** Pixel size for both width and height. Defaults to 32. */
  size?: number
}

/**
 * Premium React-atom mark — inline SVG, `currentColor`-driven.
 * Pair with Tailwind text utilities (e.g. `text-black dark:text-white`).
 */
export default function Logo({
  size = 32,
  className,
  strokeWidth = 1,
  ...props
}: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-11.5 -10.23174 23 20.46348"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden={props['aria-label'] || props['aria-labelledby'] ? undefined : true}
      role={props['aria-label'] || props['aria-labelledby'] ? 'img' : undefined}
      {...props}
    >
      <circle cx="0" cy="0" r="2.05" fill="currentColor" />
      <g stroke="currentColor" strokeWidth={strokeWidth} fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  )
}
