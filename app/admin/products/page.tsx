'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'

const EMPTY_FORM = {
  name: '', description: '', price: '', image_url: '', category: 'pastry', in_stock: true,
}

const CATEGORIES = ['bread', 'pastry', 'tart', 'muffin', 'sweet', 'general']

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchProducts = () => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    setForm({ name: p.name, description: p.description, price: String(p.price), image_url: p.image_url, category: p.category, in_stock: p.in_stock })
    setError('')
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products'
      const method = editProduct ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleteId(id)
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-[#3d2314]" style={{ fontFamily: "'Playfair Display', serif" }}>Products</h1>
          <p className="text-[#3d2314]/60 text-sm mt-1">{products.length} items in catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-[#3d2314] text-[#f5e6d3] rounded-full text-sm font-semibold hover:bg-[#c8852a] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-2xl shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#f5e6d3] shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-36 bg-[#fdf8f0]">
                <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.in_stock ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#3d2314] text-sm truncate">{p.name}</h3>
                <p className="text-xs text-[#3d2314]/50 mt-0.5 capitalize">{p.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#c8852a] font-bold">₹{p.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#fdf8f0] text-[#3d2314] hover:bg-[#f5e6d3] transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleteId === p.id}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                    >
                      {deleteId === p.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#f5e6d3] flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <h2 className="text-xl font-semibold text-[#3d2314]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#3d2314]/40 hover:text-[#3d2314] text-xl">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Sourdough Loaf' },
                { label: 'Image URL', key: 'image_url', type: 'url', placeholder: 'https://images.unsplash.com/...' },
                { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '4.50' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    required
                    step={f.key === 'price' ? '0.01' : undefined}
                    min={f.key === 'price' ? '0.01' : undefined}
                    value={(form as Record<string, string | boolean>)[f.key] as string}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the product..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] focus:ring-2 focus:ring-[#c8852a]/20 outline-none text-[#3d2314] text-sm bg-[#fdf8f0] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3d2314]/60 uppercase tracking-wider mb-1.5">Availability</label>
                  <select
                    value={form.in_stock ? 'true' : 'false'}
                    onChange={e => setForm(p => ({ ...p, in_stock: e.target.value === 'true' }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#f5e6d3] focus:border-[#c8852a] outline-none text-[#3d2314] text-sm bg-[#fdf8f0]"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Image preview */}
              {form.image_url && (
                <div className="rounded-xl overflow-hidden h-32 bg-[#fdf8f0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-full border border-[#f5e6d3] text-[#3d2314] text-sm font-medium hover:bg-[#fdf8f0] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-[#3d2314] text-[#f5e6d3] text-sm font-semibold hover:bg-[#c8852a] transition-colors disabled:opacity-60">
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
