'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Heart, LayoutDashboard, LogOut, User, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/ui-store'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Profile } from '@/types'

const publicLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/products', label: 'Productos' },
]

export function Navbar() {
  const pathname = usePathname()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }

    getProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null)
      } else {
        getProfile()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setProfile(null)
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-[var(--radius)] text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="h-10 w-24 skeleton rounded-[var(--radius)]" />
            ) : profile ? (
              <>
                <Link href="/dashboard/favorites">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Heart className="h-4 w-4" />
                    <span className="hidden lg:inline">Favoritos</span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Button>
                </Link>
                {profile.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="hidden lg:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                <div className="h-6 w-px bg-border mx-1" />
                <Link href={`/profile/${profile.username}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{profile.username}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-[var(--radius)] hover:bg-secondary focus-ring"
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1 animate-in slide-in-from-top-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  'block px-3 py-2 rounded-[var(--radius)] text-sm font-medium',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border my-2 pt-2">
              {profile ? (
                <>
                  <Link href="/dashboard" onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-[var(--radius)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/favorites" onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-[var(--radius)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary">
                    Favoritos
                  </Link>
                  {profile.role === 'admin' && (
                    <Link href="/admin" onClick={closeMobileMenu}
                      className="block px-3 py-2 rounded-[var(--radius)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { handleSignOut(); closeMobileMenu() }}
                    className="w-full text-left px-3 py-2 rounded-[var(--radius)] text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Link href="/login" onClick={closeMobileMenu} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
