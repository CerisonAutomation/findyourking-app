import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { apiError, apiSuccess, apiNotFound } from '@/lib/api-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, display_name, bio, avatar_url, gender, interests, location_city, looking_for, is_verified, created_at'
      )
      .eq('id', params.id)
      .single()

    if (error || !data) return apiNotFound()

    return apiSuccess(data)
  } catch (err: any) {
    return apiError(err.message, 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) return apiError(error.message, 400)

    return apiSuccess(data)
  } catch (err: any) {
    return apiError(err.message, 500)
  }
}
