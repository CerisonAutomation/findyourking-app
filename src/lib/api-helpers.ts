/* API response helpers */
import { NextResponse } from 'next/server'

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data, status: 'success' }, { status })
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ error, status: 'error' }, { status })
}

export function apiCreated<T>(data: T) {
  return apiSuccess(data, 201)
}

export function apiNotFound() {
  return apiError('Not found', 404)
}
