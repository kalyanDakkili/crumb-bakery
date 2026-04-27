'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem, Product } from '@/types'

interface CartContextType {
  items: CartItem[]
  count: number
  total: number
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('crumb_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem('crumb_cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (product: Product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeItem(productId); return }
    setItems(prev => prev.map(i =>
      i.product.id === productId ? { ...i, quantity: qty } : i
    ))
  }

  const clearCart = () => setItems([])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
