'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useCart } from '@/components/CartProvider'

export function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isAdmin = user?.role === 'admin'

  return (
    <nav className="sticky top-0 z-50 bg-[#fffcf7]/95 backdrop-blur-sm border-b border-[#f5e6d3] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🥐</span>
          <span
            className="text-2xl text-[#3d2314] group-hover:text-[#c8852a] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Crumb
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/shop"
            className={`text-sm font-medium transition-colors hover:text-[#c8852a] ${pathname.startsWith('/shop') ? 'text-[#c8852a]' : 'text-[#3d2314]'}`}
          >
            Shop
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-[#c8852a] ${pathname.startsWith('/admin') ? 'text-[#c8852a]' : 'text-[#3d2314]'}`}
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-[#f5e6d3] transition-colors"
            title="Cart"
          >
            <svg className="w-5 h-5 text-[#3d2314]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8l-1.35 2.7a1 1 0 00.9 1.44h12.9M7 13L5.4 5M7 13l-2 8m13-8l2 8m-9-4h.01" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c8852a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-bounce">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#f5e6d3] hover:border-[#c8852a] transition-colors text-sm"
              >
                <span className="w-6 h-6 rounded-full bg-[#c8852a] text-white text-xs flex items-center justify-center font-semibold">
                  {user.name[0].toUpperCase()}
                </span>
                <span className="hidden sm:block text-[#3d2314] font-medium max-w-20 truncate">{user.name.split(' ')[0]}</span>
                <svg className="w-3 h-3 text-[#3d2314] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#f5e6d3] py-1 z-50">
                  <div className="px-4 py-2 text-xs text-[#3d2314]/50 font-medium uppercase tracking-wider border-b border-[#f5e6d3]">
                    {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                  </div>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-[#3d2314] hover:bg-[#fdf8f0] hover:text-[#c8852a]" onClick={() => setMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-[#3d2314] text-[#f5e6d3] text-sm font-medium hover:bg-[#c8852a] transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
