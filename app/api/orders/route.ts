import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request)
    const user = token ? verifyToken(token) : null
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServerSupabaseClient()
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

    if (user.role !== 'admin') {
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ orders: data })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request)
    const user = token ? verifyToken(token) : null

    const body = await request.json()
    const { items, customer_name, customer_email, delivery_address, special_instructions } = body

    if (!items?.length || !customer_name || !customer_email || !delivery_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity, 0)

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        items,
        total,
        customer_name,
        customer_email,
        delivery_address,
        special_instructions: special_instructions || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ order: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
