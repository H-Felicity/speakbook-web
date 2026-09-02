import type { ReactNode } from "react"

type IconProps = {
  name: string
  className?: string
}

export default function Icon({ name, className = "" }: IconProps) {
  const paths: Record<string, ReactNode> = {
    back: <path d="M19 12H5m6-6-6 6 6 6" />,
    play: <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" />,
    volume: (
      <>
        <path d="M5 10v4h3l4 4V6L8 10H5Z" />
        <path d="M16 9.5a4 4 0 0 1 0 5m2.7-7.4a7 7 0 0 1 0 9.8" />
      </>
    ),
    expand: (
      <>
        <path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5" />
      </>
    ),
    loop: (
      <>
        <path d="M17 2.8 20.2 6 17 9.2" />
        <path d="M20 6h-9a5 5 0 0 0-4.8 6.4M7 21.2 3.8 18 7 14.8" />
        <path d="M4 18h9a5 5 0 0 0 4.8-6.4" />
      </>
    ),
    bookmark: <path d="M6 3h12v18l-6-3.5L6 21V3Z" />,
    sliders: (
      <>
        <path d="M4 6h16M4 18h16" />
        <path d="M9 3v6m6 6v6" />
      </>
    ),
    more: (
      <path
        d="M5 12h.01M12 12h.01M19 12h.01"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
