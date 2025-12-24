'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function EventFilters({ onFiltersChange }: any) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-300">Search events</label>
        <Input placeholder="Search events..." className="mt-1" />
      </div>
      <select className="rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white">
        <option>All Categories</option>
        <option>Social</option>
        <option>Sports</option>
        <option>Arts</option>
        <option>Food</option>
        <option>Music</option>
      </select>
      <Button variant="outline">Filter</Button>
    </div>
  )
}
