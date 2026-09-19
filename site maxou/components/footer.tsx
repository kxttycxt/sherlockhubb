import Link from 'next/link'
import { SherlockLogo } from '@/components/sherlock-logo'

const COLUMNS = [
  {
    title: 'PLATFORM',
    links: [
      { href: '/search', label: 'Search' },
      { href: '/credits', label: 'Credits' },
      { href: '/community', label: 'Community data' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'ACCOUNT',
    links: [
      { href: '/login', label: 'Sign in' },
      { href: '/register', label: 'Create account' },
      { href: '/profile', label: 'Profile' },
      { href: '/history', label: 'Search history' },
    ],
  },
  {
    title: 'SYSTEM',
    links: [
      { href: '/transactions', label: 'Transactions' },
      { href: '/community/publish', label: 'Publish document' },
      { href: '/admin', label: 'Admin panel' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <SherlockLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A private data search platform. Buy credits, search structured databases, and
              discover community-published research.
            </p>
            <div className="mt-4 flex items-center gap-2 font-technical text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              SYSTEM ONLINE
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-technical text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SHERLOCKHUB. Legally obtained data only. All
            searches are indexed for compliance.
          </p>
          <p className="font-technical text-xs text-muted-foreground">v0.9.4 — DEMO ENVIRONMENT</p>
        </div>
      </div>
    </footer>
  )
}
