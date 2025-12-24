'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Calendar, Users, MessageSquare, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/explore', label: 'Discover', icon: Compass },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/bookings', label: 'Bookings', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 h-screen overflow-y-auto bg-slate-800/50 p-4">
      <div className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-gold-500/20 text-gold-400'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
