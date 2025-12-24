'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { BottomNav } from '@/components/bottom-nav'
import { GridView } from '@/components/explore/grid-view'
import { ListView } from '@/components/explore/list-view'
import { FilterPanel } from '@/components/explore/filter-panel'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Grid, List, Map } from 'lucide-react'

export default function ExplorePage() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid')

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_premium', false)
          .limit(50)

        if (error) throw error
        setProfiles(data || [])
      } catch (error) {
        console.error('Error fetching profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  return (
    <div className="flex h-screen flex-col bg-slate-900 md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-slate-700">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* View toggle */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={view === 'grid' ? 'default' : 'outline'}
                onClick={() => setView('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={view === 'list' ? 'default' : 'outline'}
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            <FilterPanel onFiltersChange={console.log} />

            {/* Results */}
            {view === 'grid' && <GridView profiles={profiles} loading={loading} />}
            {view === 'list' && <ListView profiles={profiles} loading={loading} />}
          </div>
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <div className="md:hidden border-t border-slate-700">
        <BottomNav />
      </div>
    </div>
  )
}
