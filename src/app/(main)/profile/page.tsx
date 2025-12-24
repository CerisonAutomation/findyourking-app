'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { BottomNav } from '@/components/bottom-nav'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileStats } from '@/components/profile/profile-stats'
import { ProfilePhotos } from '@/components/profile/profile-photos'
import { CompanionSection } from '@/components/profile/companion-section'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Edit, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [companion, setCompanion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single()

        if (error) throw error
        setProfile(profileData)

        const { data: companionData } = await supabase
          .from('companions')
          .select('*')
          .eq('owner_id', userData.user.id)
          .single()

        setCompanion(companionData || null)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Profile not found</div>

  return (
    <div className="flex h-screen flex-col bg-slate-900 md:flex-row">
      <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-slate-700">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Profile</h1>
              <div className="flex gap-2">
                <Link href="/profile/edit">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <ProfileHeader profile={profile} />
            <ProfileStats profile={profile} />
            <ProfilePhotos profile={profile} />
            <CompanionSection companion={companion} />
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-slate-700">
        <BottomNav />
      </div>
    </div>
  )
}
