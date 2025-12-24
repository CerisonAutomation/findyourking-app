'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProfilePhotos({ profile }: { profile: any }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <h3 className="mb-4 font-semibold text-white">Photos</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profile.photos?.map((photo: string, i: number) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
            <Image src={photo} alt={`Photo ${i}`} fill className="object-cover" />
          </div>
        ))}
        <Button variant="outline" className="aspect-square">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
