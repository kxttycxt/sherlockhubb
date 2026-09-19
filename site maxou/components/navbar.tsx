'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Search, Zap } from 'lucide-react'
import { SherlockLogo } from '@/components/sherlock-logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/search', label: 'SEARCH' },
  { href: '/community', label: 'COMMUNITY' },
  { href: '/credits', label: 'CREDITS' },
]

export function Navbar() {
  const { currentUser, signOut, ready } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <SherlockLogo />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-technical text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>

          {ready && currentUser ? (
            <>
              <Link
                href="/credits"
                className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-technical text-xs text-foreground transition-colors hover:border-primary/50"
              >
                <Zap className="h-3.5 w-3.5 text-primary" />
                {currentUser.creditBalance.toLocaleString()}
                <span className="text-muted-foreground">CR</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="sm" className="border-border">
                      {currentUser.name.split(' ')[0]}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem render={<Link href="/dashboard">Dashboard</Link>} />
                  <DropdownMenuItem render={<Link href="/profile">Profile</Link>} />
                  <DropdownMenuItem render={<Link href="/history">Search history</Link>} />
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem render={<Link href="/admin">Admin panel</Link>} />
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/login">Sign In</Link>}
              />
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/credits">BUY CREDITS</Link>}
                className="border-glow bg-primary text-primary-foreground hover:bg-primary/90"
              />
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-72 border-border bg-background">
            <SheetHeader>
              <SheetTitle>
                <SherlockLogo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 font-technical text-sm uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-3 border-t border-border" />
              {ready && currentUser ? (
                <>
                  <Link
                    href="/credits"
                    onClick={() => setOpen(false)}
                    className={cn(
                      'mb-2 flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 font-technical text-xs text-foreground',
                    )}
                  >
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    {currentUser.creditBalance.toLocaleString()} CREDITS
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
                  >
                    Profile
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
                    >
                      Admin panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setOpen(false)
                    }}
                    className="rounded-md px-3 py-2.5 text-left text-sm text-destructive hover:bg-secondary"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/login">Sign In</Link>}
                    onClick={() => setOpen(false)}
                  />
                  <Button
                    nativeButton={false}
                    render={<Link href="/credits">BUY CREDITS</Link>}
                    onClick={() => setOpen(false)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  />
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
