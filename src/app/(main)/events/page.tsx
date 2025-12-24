'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/events/event-card'
import { EventFilters } from '@/components/events/event-filters'
import { Plus, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'upcoming' | 'attending'>('upcoming')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(*),
          event_rsvps(status, user_id)
        `)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(50)

      if (error) throw error
      setEvents(data || [])
      setFilteredEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
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
            Events
          </h1>
          <p className="text-slate-400">Discover and join local events</p>
        </div>
        <Link href="/events/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setView('upcoming')}
          className={`px-4 py-2 font-medium transition-colors ${
            view === 'upcoming'
              ? 'border-b-2 border-gold-400 text-gold-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setView('attending')}
          className={`px-4 py-2 font-medium transition-colors ${
            view === 'attending'
              ? 'border-b-2 border-gold-400 text-gold-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Attending
        </button>
      </div>

      <EventFilters onFiltersChange={setFilteredEvents} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center text-slate-400">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full text-center text-slate-400">No events found</div>
        ) : (
          filteredEvents.map((event: any) => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  )
}
