'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Crown, Bell, User } from 'lucide-react'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading || !user) return null

  return (
    <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <Link href="/explore" className="flex items-center gap-2 font-bold text-gold-400 hover:text-gold-300">
          <Crown className="h-6 w-6" />
          <span className="hidden sm:inline">FindYourKing</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary-500" />
          </button>
          <Link href="/profile">
            <User className="h-5 w-5 text-slate-400 hover:text-white" />
          </Link>
        </div>
      </div>
    </header>
  )
}
