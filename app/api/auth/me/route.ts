import { NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  const user = verifyToken(token)
  if (!user) return NextResponse.json({ user: null }, { status: 401 })

  return NextResponse.json({ user })
}
