import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'crumb-bakery-secret-2024'

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(user: Omit<User, 'created_at'>): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): Omit<User, 'created_at'> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Omit<User, 'created_at'>
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  const cookie = request.headers.get('cookie')
  if (cookie) {
    const match = cookie.match(/auth_token=([^;]+)/)
    return match ? match[1] : null
  }
  return null
}
