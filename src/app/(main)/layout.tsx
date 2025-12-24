import { BottomNav } from '@/components/bottom-nav'
import { Sidebar } from '@/components/sidebar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar - Desktop */}
      <div className="hidden border-r border-slate-700 md:block md:w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </div>

      {/* Bottom navigation - Mobile */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-700 md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
