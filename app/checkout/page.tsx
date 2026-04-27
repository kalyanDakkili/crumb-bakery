'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    delivery_address: '',
    special_instructions: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-[#3d2314]/60 mb-6">Your cart is empty.</p>
        <Link href="/shop" className="px-8 py-3 bg-[#3d2314] text-[#f5e6d3] rounded-full hover:bg-[#c8852a] transition-colors">
          Browse Shop
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl text-[#3d2314] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Order Placed! 🎉
        </h1>
        <p className="text-[#3d2314]/60 mb-2">
          Thank you for your order. We'll start baking right away!
        </p>
        <p className="text-xs text-[#3d2314]/40 mb-8 font-mono">Order #{orderId.slice(0, 8).toUpperCase()}</p>
        <Link
          href="/shop"
          className="inline-block px-8 py-4 bg-[#3d2314] text-[#f5e6d3] rounded-full font-semibold hover:bg-[#c8852a] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: orderItems }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setOrderId(data.order.id)
      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl text-[#3d2314] mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {!user && (
            <div className="bg-[#faefd8] border border-[#c8852a]/30 rounded-xl p-4 text-sm">
              <span className="font-medium text-[#3d2314]">💡 Pro tip:</span>
              <span className="text-[#3d2314]/70"> <Link href="/login" className="underline hover:text-[#c8852a]">Sign in</Link> to track your orders and reorder easily.</span>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5e6d3]">
            <h2 className="font-semibold text-[#3d2314] mb-5 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.customer_email}
                  onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5e6d3]">
            <h2 className="font-semibold text-[#3d2314] mb-5 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Delivery Address
            </h2>
            <textarea
              required
              rows={3}
              value={form.delivery_address}
              onChange={e => setForm(p => ({ ...p, delivery_address: e.target.value }))}
              placeholder="Full delivery address including flat/house number, street, area, city, pincode..."
              className="w-full px-4 py-3 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0] resize-none"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5e6d3]">
            <h2 className="font-semibold text-[#3d2314] mb-5 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Special Instructions
              <span className="text-xs font-normal text-[#3d2314]/40 ml-2">Optional</span>
            </h2>
            <textarea
              rows={2}
              value={form.special_instructions}
              onChange={e => setForm(p => ({ ...p, special_instructions: e.target.value }))}
              placeholder="Allergies, special requests, preferred delivery time..."
              className="w-full px-4 py-3 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0] resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#3d2314] text-[#f5e6d3] rounded-full font-semibold hover:bg-[#c8852a] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Placing order...' : `Place Order — ₹${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5e6d3] sticky top-24">
            <h2 className="font-semibold text-[#3d2314] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </h2>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {items.map(i => (
                <div key={i.product.id} className="flex justify-between text-sm">
                  <span className="text-[#3d2314]/70 truncate pr-2">{i.product.name} ×{i.quantity}</span>
                  <span className="text-[#3d2314] font-medium whitespace-nowrap">₹{(i.product.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#f5e6d3] mt-4 pt-4">
              <div className="flex justify-between font-bold text-[#3d2314]">
                <span>Total</span>
                <span className="text-[#c8852a] text-lg">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
