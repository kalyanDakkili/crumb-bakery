'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      router.push('/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-[#fdf8f0] via-[#faefd8] to-[#f5ddb0]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🥐</span>
            <span className="text-3xl text-[#3d2314]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
              Crumb
            </span>
          </Link>
          <p className="text-[#3d2314]/60 mt-2 text-sm">
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Join our bakery family.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#f5e6d3]">
          {/* Toggle */}
          <div className="flex rounded-full bg-[#fdf8f0] p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-[#3d2314] text-[#f5e6d3] shadow' : 'text-[#3d2314]/60 hover:text-[#3d2314]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-[#3d2314] text-[#f5e6d3] shadow' : 'text-[#3d2314]/60 hover:text-[#3d2314]'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#3d2314] text-[#f5e6d3] rounded-full font-semibold hover:bg-[#c8852a] transition-colors disabled:opacity-60 mt-2 text-sm"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#3d2314]/40 mt-6">
            New here? Switch to Register above to create an account.
          </p>
        </div>
      </div>
    </div>
  )
}