'use client'

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function CompanionSection({ companion }: { companion: any }) {
  if (!companion) {
    return (
      <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-gold-500/10 to-primary-500/10 p-6 text-center">
        <Sparkles className="mx-auto mb-4 h-8 w-8 text-gold-400" />
        <h3 className="mb-2 font-semibold text-white">No Companion Yet</h3>
        <p className="mb-4 text-sm text-slate-400">Create your AI companion to unlock premium features</p>
        <Button>
          Create Companion
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{companion.name}</h3>
          <p className="text-sm text-slate-400">{companion.species}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-300">Level {companion.level}</p>
          <p className="text-xs text-slate-500">Happiness: {companion.happiness}%</p>
        </div>
      </div>
    </div>
  )
}
