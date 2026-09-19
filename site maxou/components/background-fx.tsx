import { cn } from '@/lib/utils'

/**
 * Subtle animated grid + drifting particles + a faint scan line, used behind
 * hero and terminal-style sections. Pure CSS — no canvas — and respects
 * prefers-reduced-motion via the .scanline utility and static particle
 * positions falling back gracefully.
 */
export function BackgroundFx({ className }: { className?: string }) {
  const particles = [
    { top: '18%', left: '12%', size: 3, delay: '0s' },
    { top: '32%', left: '78%', size: 2, delay: '1.2s' },
    { top: '58%', left: '22%', size: 2.5, delay: '2.1s' },
    { top: '72%', left: '65%', size: 3, delay: '0.6s' },
    { top: '12%', left: '52%', size: 2, delay: '1.8s' },
    { top: '85%', left: '40%', size: 2, delay: '2.6s' },
    { top: '45%', left: '90%', size: 2.5, delay: '0.9s' },
    { top: '65%', left: '8%', size: 2, delay: '1.5s' },
  ]

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden scanline',
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,black,transparent)]" />
      <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent motion-safe:animate-[drift_9s_ease-in-out_infinite,pulse-glow_4s_ease-in-out_infinite]"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            boxShadow: '0 0 8px 2px rgba(0, 217, 255, 0.6)',
          }}
        />
      ))}
    </div>
  )
}
