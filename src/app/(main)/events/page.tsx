'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { BottomNav } from '@/components/bottom-nav'
import { EventCard } from '@/components/events/event-card'
import { EventFilters } from '@/components/events/event-filters'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date().toISOString()
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_rsvps(*)
          `)
          .gte('start_time', now)
          .order('start_time', { ascending: true })
          .limit(50)

        if (error) throw error
        setEvents(data || [])
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="flex h-screen flex-col bg-slate-900 md:flex-row">
      <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-slate-700">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Events</h1>
              <Link href="/events/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </Link>
            </div>

            <EventFilters onFiltersChange={console.log} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-lg bg-slate-800 animate-pulse h-80" />
                ))
              ) : events.length === 0 ? (
                <div className="col-span-full text-center text-slate-400 py-12">
                  No events found
                </div>
              ) : (
                events.map((event) => <EventCard key={event.id} event={event} />)
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
