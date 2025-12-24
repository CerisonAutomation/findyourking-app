'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { BottomNav } from '@/components/bottom-nav'
import { BookingCard } from '@/components/bookings/booking-card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            participant:profiles(display_name, avatar_url)
          `)
          .or(`creator_id.eq.${userData.user.id},participant_id.eq.${userData.user.id}`)
          .order('start_time', { ascending: true })

        if (error) throw error
        setBookings(data || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

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
              <h1 className="text-3xl font-bold text-white">Bookings</h1>
              <Link href="/bookings/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Booking
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-lg bg-slate-800 animate-pulse h-24" />
                ))
              ) : bookings.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  No bookings yet
                </div>
              ) : (
                bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-slate-700">
        <BottomNav />
      </div>
    </div>
  )
}
