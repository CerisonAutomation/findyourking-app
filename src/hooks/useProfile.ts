'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        let query = supabase.from('profiles').select('*')

        if (userId) {
          query = query.eq('id', userId)
        } else {
          const { data: userData } = await supabase.auth.getUser()
          if (!userData.user) return
          query = query.eq('id', userData.user.id)
        }

        const { data, error } = await query.single()
        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, error }
}
