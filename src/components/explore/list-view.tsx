'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ListView({ profiles, loading }: { profiles: any[]; loading: boolean }) {
  if (loading) {
    return <div className="text-slate-400">Loading...</div>
  }

  if (profiles.length === 0) {
    return <div className="text-slate-400">No profiles found</div>
  }

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <Link
          key={profile.id}
          href={`/profile/${profile.id}`}
          className="flex gap-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-colors hover:bg-slate-700/50"
        >
          {/* Avatar */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-700 text-xl font-bold">
                {profile.display_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{profile.display_name}</h3>
                {profile.location_city && (
                  <p className="flex items-center gap-1 text-sm text-slate-400">
                    <MapPin className="h-4 w-4" />
                    {profile.location_city}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {profile.bio && <p className="mt-2 text-sm text-slate-400">{profile.bio}</p>}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.slice(0, 3).map((interest: string, i: number) => (
                  <span key={i} className="rounded-full bg-gold-500/20 px-2 py-1 text-xs text-gold-400">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
