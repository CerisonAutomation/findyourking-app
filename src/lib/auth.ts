/**
 * Authentication utilities and token verification
 * Handles JWT validation and session management
 */

import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret')
const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

/**
 * Verify JWT token
 */
export async function verifyAuth(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Create JWT token
 */
export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
  return token
}

/**
 * Get auth token from cookies
 */
export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

/**
 * Set auth token in cookies
 */
export async function setAuthToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  })
}

/**
 * Clear auth token
 */
export async function clearAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Get current user from token
 */
export async function getCurrentUser() {
  const token = await getAuthToken()
  if (!token) return null
  return await verifyAuth(token)
}
