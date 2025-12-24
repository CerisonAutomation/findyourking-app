'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      if (error) throw error
      setProfile(data)
      setFormData(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', userData.user.id)

      if (error) throw error
      toast.success('Settings saved!')
      fetchProfile()
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-slate-400">Loading...</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="max-w-md space-y-4 rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div>
              <label className="block text-sm font-medium text-white">Display Name</label>
              <Input
                value={formData.display_name || ''}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 p-2 text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Looking For</label>
              <select
                value={formData.looking_for || ''}
                onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 p-2 text-white"
              >
                <option value="friends">Friends</option>
                <option value="dating">Dating</option>
                <option value="relationship">Relationship</option>
                <option value="networking">Networking</option>
                <option value="events">Events</option>
              </select>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <div className="max-w-md space-y-4 rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.show_age || false}
                onChange={(e) => setFormData({ ...formData, show_age: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-white">Show my age</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.show_location || false}
                onChange={(e) => setFormData({ ...formData, show_location: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-white">Show my location</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.incognito_mode || false}
                onChange={(e) => setFormData({ ...formData, incognito_mode: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-white">Incognito mode</span>
            </label>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="text-slate-400">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <p>Push notifications settings coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
