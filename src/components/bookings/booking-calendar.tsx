'use client'

export function BookingCalendar({ bookings }: { bookings: any[] }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <div className="text-center text-slate-400">
        <p>Calendar view coming soon...</p>
        <p className="text-sm">Interactive calendar with {bookings.length} scheduled events</p>
      </div>
    </div>
  )
}
