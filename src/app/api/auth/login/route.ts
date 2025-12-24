import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateEmail, hashPassword } from '@/lib/security-utils'
import { apiError, apiSuccess } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!validateEmail(email)) {
      return apiError('Invalid email', 400)
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return apiError(error.message, 401)
    }

    return apiSuccess({ user: data.user, session: data.session })
  } catch (err: any) {
    return apiError(err.message, 500)
  }
}
