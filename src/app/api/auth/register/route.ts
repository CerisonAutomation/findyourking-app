import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateEmail } from '@/lib/security-utils'
import { apiError, apiSuccess } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json()

    if (!validateEmail(email)) {
      return apiError('Invalid email', 400)
    }

    if (password.length < 8) {
      return apiError('Password must be at least 8 characters', 400)
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess({ user: data.user }, 201)
  } catch (err: any) {
    return apiError(err.message, 500)
  }
}
