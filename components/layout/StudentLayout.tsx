'use client'
import { useState, useEffect } from 'react'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { logout } from '@/app/actions/auth'
import { Menu, X, LogOut, User, Briefcase, FolderOpen, Award, Settings } from 'lucide-react'

interface StudentLayoutProps {
  children: ReactNode
  user: {
    name: string
    email: string
    major: string
    avatar?: string
  }
}

const navItems = [
  { href: '/student/jobs', label: 'Lowongan PKL', icon: Briefcase },
  { href: '/student/applications', label: 'Lamaran', icon: FolderOpen },
  { href: '/student/portfolio', label: 'Portfolio', icon: Award },
  { href: '/student/profile', label: 'Profil Saya', icon: Settings },
]

export function StudentLayout({ children, user }: StudentLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'YM'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-lg transform transition-transform duration-200 ease-out lg:hidden flex flex-col',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link
            href="/student"
            className="flex items-center gap-2.5 font-semibold text-lg text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="w-8 h-8 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              YM
            </span>
            <span>YukMagang</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-border bg-base-50/50">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-brand-200 bg-brand-50 text-brand-700 font-bold" fallback={initials} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
              <p className="text-caption text-brand-700 font-medium truncate">{user.major}</p>
              <p className="text-caption text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Navigasi utama">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className={cn('w-4 h-4', isActive ? 'text-brand-600' : 'text-muted-foreground')} aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Sign Out */}
        <div className="p-4 border-t border-border mt-auto">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive-light/40 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xs border-b border-border">
        <div className="container-dashboard px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Buka menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand */}
            <Link href="/student" className="flex items-center gap-2.5 font-semibold text-lg text-foreground">
              <span className="w-8 h-8 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                YM
              </span>
              <span className="font-semibold tracking-tight">YukMagang</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigasi utama desktop">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-base-100'
                  )}
                >
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-brand-600' : 'text-muted-foreground')} aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-md hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="Menu pengguna"
            >
              <Avatar
                className="w-8 h-8 border border-brand-200 bg-brand-50 text-brand-700 font-semibold text-xs"
                fallback={initials}
              />
              <span className="hidden md:block text-sm font-medium text-foreground">{user.name}</span>
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-md py-1.5 z-50">
                  <div className="px-3.5 py-2.5 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-caption text-brand-700 font-medium truncate">{user.major}</p>
                    <p className="text-caption text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/student/profile"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Profil Saya
                  </Link>
                  <div className="pt-1 mt-1 border-t border-border">
                    <form action={logout}>
                      <button
                        type="submit"
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-destructive hover:bg-destructive-light/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container-dashboard py-8 px-4 sm:px-6 md:py-10 flex-1">
        {children}
      </main>
    </div>
  )
}