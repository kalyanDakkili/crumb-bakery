'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Product } from '@/types'
import { useCart } from '@/components/CartProvider'
import { Suspense } from 'react'

const CATEGORIES = [
  { value: 'all', label: 'All Items', emoji: '✨' },
  { value: 'bread', label: 'Breads', emoji: '🍞' },
  { value: 'pastry', label: 'Pastries', emoji: '🥐' },
  { value: 'tart', label: 'Tarts', emoji: '🥧' },
  { value: 'muffin', label: 'Muffins', emoji: '🧁' },
  { value: 'sweet', label: 'Sweets', emoji: '🍰' },
]

function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart()
  const inCart = items.find(i => i.product.id === product.id)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5e6d3]">
      <div className="relative h-52 overflow-hidden bg-[#fdf8f0]">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#3d2314] px-4 py-2 rounded-full text-sm font-semibold">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-[#fdf8f0]/90 backdrop-blur-sm text-[#3d2314] text-xs px-2 py-1 rounded-full font-medium capitalize">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-[#3d2314] text-base mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          {product.name}
        </h3>
        <p className="text-[#3d2314]/60 text-sm leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#c8852a]">
            ₹{product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              added
                ? 'bg-green-500 text-white scale-95'
                : product.in_stock
                ? 'bg-[#3d2314] text-[#f5e6d3] hover:bg-[#c8852a] hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {added ? '✓ Added!' : inCart ? `In cart (${inCart.quantity})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const searchParams = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category') || 'all'
    setActiveCategory(cat)
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    const url = activeCategory === 'all' ? '/api/products' : `/api/products?category=${activeCategory}`
    fetch(url)
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl text-[#3d2314] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Our Bakery
        </h1>
        <p className="text-[#3d2314]/60">Everything is baked fresh each morning. Order by 9pm for next-day delivery.</p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-10">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === c.value
                ? 'bg-[#3d2314] text-[#f5e6d3] shadow-md'
                : 'bg-white text-[#3d2314] border border-[#f5e6d3] hover:border-[#c8852a] hover:text-[#c8852a]'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-[#f5e6d3]">
              <div className="h-52 shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-4 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded w-full" />
                <div className="h-3 shimmer rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍰</p>
          <p className="text-[#3d2314]/60">No items in this category right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12 text-center text-[#3d2314]/60">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  )
}
