'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridView } from '@/components/explore/grid-view'
import { MapView } from '@/components/explore/map-view'
import { ListView } from '@/components/explore/list-view'
import { FilterPanel } from '@/components/explore/filter-panel'
import { Grid2X2, Map, List } from 'lucide-react'

export default function ExplorePage() {
  const [profiles, setProfiles] = useState([])
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 100,
    maxDistance: 50,
    interests: [],
  })

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(50)

      if (error) throw error
      setProfiles(data || [])
      setFilteredProfiles(data || [])
    } catch (err) {
      console.error('Error fetching profiles:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
    // Filter logic here
    const filtered = profiles.filter((profile: any) => {
      const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
      return age >= newFilters.minAge && age <= newFilters.maxAge
    })
    setFilteredProfiles(filtered)
  }

  return (
    <div className="flex gap-4 p-4 md:p-6">
      {/* Filters - Desktop */}
      <div className="hidden w-64 lg:block">
        <FilterPanel onFiltersChange={applyFilters} />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Discover</h1>
          <p className="text-slate-400">Find your people nearby</p>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid2X2 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <GridView profiles={filteredProfiles} loading={loading} />
          </TabsContent>

          <TabsContent value="map">
            <MapView profiles={filteredProfiles} loading={loading} />
          </TabsContent>

          <TabsContent value="list">
            <ListView profiles={filteredProfiles} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
