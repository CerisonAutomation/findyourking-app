/* Search and filtering service */

export interface SearchFilter {
  q?: string
  age_min?: number
  age_max?: number
  distance?: number
  location?: string
  interests?: string[]
  gender?: string
  page?: number
  limit?: number
}

export async function searchProfiles(filters: SearchFilter) {
  const queryParams = new URLSearchParams()

  if (filters.q) queryParams.append('q', filters.q)
  if (filters.age_min) queryParams.append('age_min', filters.age_min.toString())
  if (filters.age_max) queryParams.append('age_max', filters.age_max.toString())
  if (filters.distance) queryParams.append('distance', filters.distance.toString())
  if (filters.location) queryParams.append('location', filters.location)
  if (filters.gender) queryParams.append('gender', filters.gender)
  queryParams.append('page', (filters.page || 1).toString())
  queryParams.append('limit', Math.min(filters.limit || 20, 100).toString())

  const response = await fetch(`/api/search/profiles?${queryParams.toString()}`)
  if (!response.ok) throw new Error('Search failed')
  return response.json()
}

export async function searchEvents(filters: SearchFilter) {
  const queryParams = new URLSearchParams()

  if (filters.q) queryParams.append('q', filters.q)
  if (filters.location) queryParams.append('location', filters.location)
  if (filters.distance) queryParams.append('distance', filters.distance.toString())
  queryParams.append('page', (filters.page || 1).toString())
  queryParams.append('limit', Math.min(filters.limit || 20, 100).toString())

  const response = await fetch(`/api/search/events?${queryParams.toString()}`)
  if (!response.ok) throw new Error('Search failed')
  return response.json()
}
