'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { BookingCard } from '@/components/bookings/booking-card'
import { BookingCalendar } from '@/components/bookings/booking-calendar'
import { Plus, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          creator:creator_id(display_name, avatar_url),
          participant:participant_id(display_name, avatar_url)
        `)
        .or(`creator_id.eq.${userData.user.id},participant_id.eq.${userData.user.id}`)
        .order('start_time', { ascending: true })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
            <Calendar className="h-8 w-8" />
            My Bookings
          </h1>
          <p className="text-slate-400">Manage your scheduled meetups</p>
        </div>
        <Link href="/bookings/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 font-medium transition-colors ${
            view === 'list'
              ? 'border-b-2 border-gold-400 text-gold-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`px-4 py-2 font-medium transition-colors ${
            view === 'calendar'
              ? 'border-b-2 border-gold-400 text-gold-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Calendar
        </button>
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-400">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-slate-400">No bookings yet</div>
          ) : (
            bookings.map((booking: any) => <BookingCard key={booking.id} booking={booking} />)
          )}
        </div>
      ) : (
        <BookingCalendar bookings={bookings} />
      )}
    </div>
  )
}
