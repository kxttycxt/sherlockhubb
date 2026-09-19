import { cn } from '@/lib/utils'

export function SherlockMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      role="img"
      aria-hidden="true"
    >
      <circle cx="17" cy="17" r="11" stroke="#00A8FF" strokeWidth="2.25" />
      <circle cx="17" cy="17" r="6.5" stroke="#00D9FF" strokeWidth="1" opacity="0.6" />
      <circle cx="17" cy="17" r="2.4" fill="#00D9FF" />
      <line
        x1="25.2"
        y1="25.2"
        x2="34.5"
        y2="34.5"
        stroke="#00A8FF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="17" r="11" stroke="#00A8FF" strokeWidth="2.25" opacity="0.35">
        <animate
          attributeName="r"
          values="11;13.5;11"
          dur="3.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.35;0;0.35"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

export function SherlockLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <SherlockMark className="h-6 w-6" />
      <span className="font-technical text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
        SHERLOCK<span className="text-primary">HUB</span>
      </span>
    </span>
  )
}
