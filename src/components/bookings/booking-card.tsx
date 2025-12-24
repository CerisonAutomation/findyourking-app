'use client'

import { Calendar, Clock, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BookingCard({ booking }: { booking: any }) {
  const startDate = new Date(booking.start_time)
  const endDate = new Date(booking.end_time)

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{booking.title}</h3>
          <p className="text-sm text-slate-400">{booking.booking_type}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
          booking.status === 'confirmed'
            ? 'bg-green-500/20 text-green-400'
            : booking.status === 'pending'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-400">
        <p className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {startDate.toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
          {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        {booking.location_name && (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {booking.location_name}
          </p>
        )}
        {booking.participant && (
          <p className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {booking.participant.display_name}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {booking.status === 'pending' && <Button className="flex-1">Confirm</Button>}
        <Button variant="outline" className="flex-1">
          {booking.meeting_url ? 'Join Call' : 'Message'}
        </Button>
      </div>
    </div>
  )
}
