'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export function MapView({ profiles, loading }: { profiles: any[]; loading: boolean }) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (loading || !containerRef.current) return

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([40, 0], 2)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Add markers for profiles
    profiles.forEach((profile) => {
      if (profile.location) {
        const coords = JSON.parse(profile.location)
        L.marker([coords.coordinates[1], coords.coordinates[0]])
          .bindPopup(`<strong>${profile.display_name}</strong>`)
          .addTo(mapRef.current!)
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            mapRef.current!.removeLayer(layer)
          }
        })
      }
    }
  }, [profiles, loading])

  return (
    <div
      ref={containerRef}
      className="h-[600px] rounded-lg border border-slate-700 bg-slate-700"
    />
  )
}
