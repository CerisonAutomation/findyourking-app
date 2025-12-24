'use client'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-700 rounded-lg ${
        className || 'h-8 w-full'
      }`}
    />
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-32 rounded-lg" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
