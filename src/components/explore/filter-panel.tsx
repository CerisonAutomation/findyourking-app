'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter, X } from 'lucide-react'

export function FilterPanel({ onFiltersChange }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 100,
    maxDistance: 50,
    interests: [],
  })

  const handleFilterChange = (key: string, value: any) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    onFiltersChange(updated)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 lg:hidden"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>

      {(isOpen || typeof window !== 'undefined') && (
        <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Filters</h3>
            {isOpen && (
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Age Range</label>
            <div className="mt-2 flex gap-2">
              <Input
                type="number"
                min="18"
                max="100"
                value={filters.minAge}
                onChange={(e) => handleFilterChange('minAge', parseInt(e.target.value))}
                placeholder="Min"
              />
              <Input
                type="number"
                min="18"
                max="100"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', parseInt(e.target.value))}
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Distance (km)</label>
            <Input
              type="number"
              min="1"
              max="1000"
              value={filters.maxDistance}
              onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Interests</label>
            <Input
              type="text"
              placeholder="Add interests (comma separated)"
              onChange={(e) =>
                handleFilterChange('interests', e.target.value.split(',').map((i) => i.trim()))
              }
              className="mt-2"
            />
          </div>

          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}
