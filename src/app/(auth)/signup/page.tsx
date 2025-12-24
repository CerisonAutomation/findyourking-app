'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            display_name: displayName,
            username: email.split('@')[0],
            date_of_birth: new Date().toISOString().split('T')[0],
            gender: 'prefer-not-to-say',
          })

        if (profileError) {
          toast.error(profileError.message)
          return
        }
      }

      toast.success('Account created! Please verify your email.')
      router.push('/login')
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-xl">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gold-400">Join FindYourKing</h1>
        <p className="text-slate-400">Your premium social network awaits</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={loading}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <Input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          minLength={8}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-400 hover:text-gold-300">
          Sign in
        </Link>
      </div>
    </div>
  )
}
