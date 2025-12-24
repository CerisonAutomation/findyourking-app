'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EventCard({ event }: { event: any }) {
  const startDate = new Date(event.start_time)
  const attendees = event.event_rsvps?.filter((r: any) => r.status === 'going').length || 0

  return (
    <Link
      href={`/events/${event.id}`}
      className="group overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 transition-colors hover:bg-slate-700/50"
    >
      <div className="relative h-40 w-full overflow-hidden bg-slate-700">
        {event.cover_image ? (
          <Image
            src={event.cover_image}
            alt={event.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gold-500/20 to-primary-500/20" />
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-slate-900">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-white group-hover:text-gold-400">
          {event.title}
        </h3>

        <div className="mb-3 space-y-1 text-sm text-slate-400">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {startDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {event.location_name && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location_name}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {attendees} going
          </p>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            RSVP
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}
