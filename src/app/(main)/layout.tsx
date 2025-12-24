'use client'

import { useAuth } from '@/hooks/useAuth'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-pulse">
          <div className="h-12 w-12 rounded-full bg-slate-700"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
