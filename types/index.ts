export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  in_stock: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

export interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin'
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'baking' | 'ready' | 'delivered'
  items: OrderItem[]
  total: number
  customer_name: string
  customer_email: string
  delivery_address: string
  special_instructions?: string
  created_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export interface AuthSession {
  user: User
  token: string
}
