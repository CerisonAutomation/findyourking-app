'use client'

export function ProfileStats({ profile }: { profile: any }) {
  const stats = [
    { label: 'Profile Views', value: profile.profile_views || 0 },
    { label: 'Events', value: profile.event_count || 0 },
    { label: 'Connections', value: 0 }, // TODO: Calculate from conversations
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
          <p className="text-2xl font-bold text-gold-400">{stat.value}</p>
          <p className="text-sm text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
