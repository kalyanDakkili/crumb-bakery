'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

export default function CartPage() {
  const { items, total, removeItem, updateQty, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-3xl text-[#3d2314] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your cart is empty
        </h1>
        <p className="text-[#3d2314]/60 mb-8">Looks like you haven't added anything yet. Let's fix that!</p>
        <Link
          href="/shop"
          className="inline-block px-8 py-4 bg-[#3d2314] text-[#f5e6d3] rounded-full font-semibold hover:bg-[#c8852a] transition-colors"
        >
          Browse the Bakery →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl text-[#3d2314]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Cart
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div
              key={item.product.id}
              className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-[#f5e6d3] animate-[fadeIn_0.3s_ease-out]"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  width={80} height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#3d2314] text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.product.name}
                </h3>
                <p className="text-[#c8852a] font-bold text-sm mt-0.5">₹{item.product.price.toFixed(2)} each</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-[#f5e6d3] text-[#3d2314] hover:bg-[#f5e6d3] transition-colors flex items-center justify-center font-semibold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#3d2314]">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-[#f5e6d3] text-[#3d2314] hover:bg-[#f5e6d3] transition-colors flex items-center justify-center font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-[#3d2314]/30 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="font-bold text-[#3d2314]">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5e6d3] sticky top-24">
            <h2 className="text-lg font-semibold text-[#3d2314] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-[#3d2314]/70">{item.product.name} × {item.quantity}</span>
                  <span className="text-[#3d2314] font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#f5e6d3] pt-4 mb-6">
              <div className="flex justify-between font-bold text-[#3d2314] text-lg">
                <span>Total</span>
                <span className="text-[#c8852a]">₹{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#3d2314]/40 mt-1">Delivery charges calculated at checkout</p>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center py-4 bg-[#3d2314] text-[#f5e6d3] rounded-full font-semibold hover:bg-[#c8852a] transition-colors"
            >
              Proceed to Checkout →
            </Link>

            <Link href="/shop" className="block text-center text-sm text-[#3d2314]/60 hover:text-[#c8852a] mt-4 font-medium">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
