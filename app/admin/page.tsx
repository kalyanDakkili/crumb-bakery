'use client'

import { useEffect, useState } from 'react'
import { Order, Product } from '@/types'

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalProducts: number
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([ordersData, productsData]) => {
      setOrders(ordersData.orders || [])
      setProducts(productsData.products || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const stats: Stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalProducts: products.length,
  }

  const recentOrders = orders.slice(0, 5)

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    baking: 'bg-orange-100 text-orange-800',
    ready: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  }

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl text-[#3d2314]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dashboard
        </h1>
        <p className="text-[#3d2314]/60 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening at Crumb today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-blue-50 border-blue-100' },
          { label: 'Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: 'bg-green-50 border-green-100' },
          { label: 'Pending', value: stats.pendingOrders, icon: '⏳', color: 'bg-yellow-50 border-yellow-100' },
          { label: 'Products', value: stats.totalProducts, icon: '🧁', color: 'bg-orange-50 border-orange-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-[#3d2314]">{s.value}</div>
            <div className="text-xs text-[#3d2314]/60 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#f5e6d3] overflow-hidden">
        <div className="p-6 border-b border-[#f5e6d3] flex items-center justify-between">
          <h2 className="font-semibold text-[#3d2314]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Recent Orders
          </h2>
          <a href="/admin/orders" className="text-xs text-[#c8852a] hover:underline font-medium">
            View all →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-[#3d2314]/50 text-sm">No orders yet.</div>
        ) : (
          <div className="divide-y divide-[#f5e6d3]">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-[#fdf8f0] transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#3d2314]">{order.customer_name}</p>
                  <p className="text-xs text-[#3d2314]/50">
                    #{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-[#c8852a] text-sm">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
