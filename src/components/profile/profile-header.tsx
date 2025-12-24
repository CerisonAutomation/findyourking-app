'use client'

import Image from 'next/image'

export function ProfileHeader({ profile }: { profile: any }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-700" />
          )}
        </div>

        <div className="flex-1">
          {profile.bio && <p className="mb-4 text-slate-300">{profile.bio}</p>}
          {profile.interests && profile.interests.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-300">Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string, i: number) => (
                  <span key={i} className="rounded-full bg-gold-500/20 px-3 py-1 text-xs text-gold-400">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
