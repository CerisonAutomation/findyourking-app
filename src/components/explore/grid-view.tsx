'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'

export function GridView({ profiles, loading }: { profiles: any[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-lg bg-slate-700" />
        ))}
      </div>
    )
  }

  if (profiles.length === 0) {
    return <div className="text-center text-slate-400">No profiles found</div>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {profiles.map((profile) => (
        <Link
          key={profile.id}
          href={`/profile/${profile.id}`}
          className="group relative overflow-hidden rounded-lg">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-700">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700 text-4xl font-bold text-slate-400">
                {profile.display_name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-slate-900 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex justify-end gap-2">
                {profile.is_verified && (
                  <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-slate-900">✓ Verified</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white">{profile.display_name}</h3>
                {profile.location_city && (
                  <p className="flex items-center gap-1 text-sm text-slate-300">
                    <MapPin className="h-3 w-3" />
                    {profile.location_city}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card info below */}
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-white">{profile.display_name}</h3>
              <button className="rounded-full bg-slate-700 p-2 text-slate-300 hover:bg-gold-500 hover:text-slate-900">
                <Heart className="h-4 w-4" />
              </button>
            </div>
            {profile.bio && <p className="text-xs text-slate-400 line-clamp-2">{profile.bio}</p>}
          </div>
        </Link>
      ))}
    </div>
  )
}
