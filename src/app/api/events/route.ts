import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { apiError, apiSuccess } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('start_time', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) return apiError(error.message, 500)

    return apiSuccess({
      items: data,
      total: count,
      page,
      limit,
    })
  } catch (err: any) {
    return apiError(err.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single()

    if (error) return apiError(error.message, 400)

    return apiSuccess(data, 201)
  } catch (err: any) {
    return apiError(err.message, 500)
  }
}
