'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f0]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c8852a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#3d2314]/60 text-sm">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') return null

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '🧁' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
  ]

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      {/* Admin sidebar (desktop) */}
      <div className="flex">
        <aside className="hidden md:flex w-56 flex-col bg-[#3d2314] min-h-screen fixed left-0 top-16 pt-8 pb-6">
          <div className="px-6 mb-8">
            <p className="text-[#f5e6d3]/40 text-xs font-semibold uppercase tracking-widest">Admin</p>
            <p className="text-[#f5e6d3] font-semibold mt-1 text-sm truncate">{user.name}</p>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'bg-[#c8852a] text-white'
                    : 'text-[#f5e6d3]/70 hover:bg-white/10 hover:text-[#f5e6d3]'
                }`}
              >
                <span>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="px-3 mt-auto">
            <Link
              href="/shop"
              className="flex items-center gap-2 px-3 py-2 text-[#f5e6d3]/50 hover:text-[#f5e6d3] text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Shop
            </Link>
          </div>
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#3d2314] border-t border-white/10 flex">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
                pathname === l.href ? 'text-[#e6a83c]' : 'text-[#f5e6d3]/60'
              }`}
            >
              <span className="text-lg">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-56 pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
