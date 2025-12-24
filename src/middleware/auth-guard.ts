/* Authentication middleware and guards */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')

  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error) return null
    return data.user
  } catch (err) {
    return null
  }
}

export function requireAuth(handler: (req: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    return handler(request)
  }
}

export function requireRole(role: string, handler: (req: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // Check user role (implement based on your schema)
    // For now, assume role is in user metadata
    const userRole = (user.user_metadata?.role as string) || 'user'
    if (userRole !== role) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
    }

    return handler(request)
  }
