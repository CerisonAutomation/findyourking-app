'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Calendar, Users, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/explore', label: 'Discover', icon: Compass },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/bookings', label: 'Bookings', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-around bg-slate-800 px-4 py-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-col items-center gap-1 text-xs font-medium transition-colors',
            pathname.startsWith(href)
              ? 'text-gold-400'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </nav>
  )
}
