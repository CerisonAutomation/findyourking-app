'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileStats } from '@/components/profile/profile-stats'
import { ProfilePhotos } from '@/components/profile/profile-photos'
import { CompanionSection } from '@/components/profile/companion-section'
import { Button } from '@/components/ui/button'
import { LogOut, Edit } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [companion, setCompanion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchCompanion()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanion = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data } = await supabase
        .from('companions')
        .select('*')
        .eq('owner_id', userData.user.id)
        .single()

      if (data) {
        setCompanion(data)
      }
    } catch (err) {
      console.error('Error fetching companion:', err)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      toast.success('Logged out successfully')
    } catch (err) {
      toast.error('Failed to logout')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-slate-400">Loading...</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{profile?.display_name}</h1>
          <p className="text-slate-400">@{profile?.username}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/settings">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      {profile && <ProfileHeader profile={profile} />}

      {/* Stats */}
      {profile && <ProfileStats profile={profile} />}

      {/* Photos */}
      {profile && <ProfilePhotos profile={profile} />}

      {/* AI Companion */}
      <CompanionSection companion={companion} />
    </div>
  )
}
