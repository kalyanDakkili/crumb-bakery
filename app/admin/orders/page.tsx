'use client'

import { useEffect, useState } from 'react'
import { Order } from '@/types'

const STATUSES = ['pending', 'confirmed', 'baking', 'ready', 'delivered']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  baking: 'bg-orange-100 text-orange-800 border-orange-200',
  ready: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
}

const statusEmoji: Record<string, string> = {
  pending: '⏳', confirmed: '✅', baking: '🔥', ready: '🎁', delivered: '🚚',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId)
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl text-[#3d2314]" style={{ fontFamily: "'Playfair Display', serif" }}>Orders</h1>
        <p className="text-[#3d2314]/60 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', ...STATUSES].map(s => {
          const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                filter === s
                  ? 'bg-[#3d2314] text-[#f5e6d3]'
                  : 'bg-white text-[#3d2314] border border-[#f5e6d3] hover:border-[#c8852a]'
              }`}
            >
              {s !== 'all' && statusEmoji[s]}
              <span className="capitalize">{s}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === s ? 'bg-white/20 text-white' : 'bg-[#fdf8f0] text-[#3d2314]/60'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#3d2314]/50">
          <p className="text-4xl mb-3">📭</p>
          <p>No {filter !== 'all' ? filter : ''} orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-[#f5e6d3] shadow-sm overflow-hidden">
              {/* Header row */}
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#fdf8f0] transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#3d2314] text-sm">{order.customer_name}</span>
                    <span className="text-xs text-[#3d2314]/40 font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-[#3d2314]/50 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' · '}{Array.isArray(order.items) ? order.items.length : 0} items
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {statusEmoji[order.status]} {order.status}
                  </span>
                  <span className="font-bold text-[#c8852a] text-sm whitespace-nowrap">₹{order.total.toFixed(2)}</span>
                  <svg className={`w-4 h-4 text-[#3d2314]/40 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <div className="border-t border-[#f5e6d3] p-4 bg-[#fdf8f0] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[#3d2314]/50 uppercase tracking-wider mb-1">Contact</p>
                      <p className="text-sm text-[#3d2314]">{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#3d2314]/50 uppercase tracking-wider mb-1">Delivery Address</p>
                      <p className="text-sm text-[#3d2314]">{order.delivery_address}</p>
                    </div>
                    {order.special_instructions && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold text-[#3d2314]/50 uppercase tracking-wider mb-1">Special Instructions</p>
                        <p className="text-sm text-[#3d2314] italic">{order.special_instructions}</p>
                      </div>
                    )}
                  </div>

                  {/* Order items */}
                  <div>
                    <p className="text-xs font-semibold text-[#3d2314]/50 uppercase tracking-wider mb-2">Items</p>
                    <div className="space-y-1">
                      {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-[#3d2314]/70">{item.product_name} × {item.quantity}</span>
                          <span className="text-[#3d2314] font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status update */}
                  <div>
                    <p className="text-xs font-semibold text-[#3d2314]/50 uppercase tracking-wider mb-2">Update Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          disabled={updating === order.id || order.status === s}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                            order.status === s
                              ? 'bg-[#3d2314] text-[#f5e6d3] cursor-default'
                              : 'bg-white border border-[#f5e6d3] text-[#3d2314] hover:border-[#c8852a] hover:text-[#c8852a] disabled:opacity-50'
                          }`}
                        >
                          {statusEmoji[s]} {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
