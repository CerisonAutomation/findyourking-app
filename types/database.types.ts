export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          bio: string | null
          date_of_birth: string
          gender: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say'
          interested_in: string[]
          location: unknown | null // PostGIS Geography type
          location_name: string | null
          location_city: string | null
          location_country: string | null
          show_distance: boolean
          max_distance_km: number
          avatar_url: string | null
          photos: string[]
          videos: string[]
          is_verified: boolean
          is_premium: boolean
          is_online: boolean
          last_seen: string | null
          interests: string[]
          languages: string[]
          looking_for: 'friends' | 'dating' | 'relationship' | 'networking' | 'events' | null
          show_age: boolean
          show_location: boolean
          incognito_mode: boolean
          profile_views: number
          event_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          bio?: string | null
          date_of_birth: string
          gender: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say'
          interested_in?: string[]
          location?: unknown | null
          location_name?: string | null
          location_city?: string | null
          location_country?: string | null
          show_distance?: boolean
          max_distance_km?: number
          avatar_url?: string | null
          photos?: string[]
          videos?: string[]
          is_verified?: boolean
          is_premium?: boolean
          is_online?: boolean
          last_seen?: string | null
          interests?: string[]
          languages?: string[]
          looking_for?: 'friends' | 'dating' | 'relationship' | 'networking' | 'events' | null
          show_age?: boolean
          show_location?: boolean
          incognito_mode?: boolean
          profile_views?: number
          event_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          bio?: string | null
          date_of_birth?: string
          gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say'
          interested_in?: string[]
          location?: unknown | null
          location_name?: string | null
          location_city?: string | null
          location_country?: string | null
          show_distance?: boolean
          max_distance_km?: number
          avatar_url?: string | null
          photos?: string[]
          videos?: string[]
          is_verified?: boolean
          is_premium?: boolean
          is_online?: boolean
          last_seen?: string | null
          interests?: string[]
          languages?: string[]
          looking_for?: 'friends' | 'dating' | 'relationship' | 'networking' | 'events' | null
          show_age?: boolean
          show_location?: boolean
          incognito_mode?: boolean
          profile_views?: number
          event_count?: number
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string
          category: 'social' | 'sports' | 'arts' | 'food' | 'music' | 'outdoor' | 'games' | 'other'
          location: unknown // PostGIS Geography
          location_name: string
          location_address: string | null
          location_city: string | null
          start_time: string
          end_time: string
          timezone: string
          max_attendees: number | null
          current_attendees: number
          cover_image: string | null
          photos: string[]
          is_public: boolean
          requires_approval: boolean
          allow_guests: boolean
          is_paid: boolean
          price: number | null
          currency: string
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description: string
          category: 'social' | 'sports' | 'arts' | 'food' | 'music' | 'outdoor' | 'games' | 'other'
          location: unknown
          location_name: string
          location_address?: string | null
          location_city?: string | null
          start_time: string
          end_time: string
          timezone?: string
          max_attendees?: number | null
          current_attendees?: number
          cover_image?: string | null
          photos?: string[]
          is_public?: boolean
          requires_approval?: boolean
          allow_guests?: boolean
          is_paid?: boolean
          price?: number | null
          currency?: string
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string
          category?: 'social' | 'sports' | 'arts' | 'food' | 'music' | 'outdoor' | 'games' | 'other'
          location?: unknown
          location_name?: string
          location_address?: string | null
          location_city?: string | null
          start_time?: string
          end_time?: string
          timezone?: string
          max_attendees?: number | null
          current_attendees?: number
          cover_image?: string | null
          photos?: string[]
          is_public?: boolean
          requires_approval?: boolean
          allow_guests?: boolean
          is_paid?: boolean
          price?: number | null
          currency?: string
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tags?: string[]
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          creator_id: string
          participant_id: string | null
          title: string
          description: string | null
          booking_type: 'meetup' | 'date' | 'activity' | 'consultation' | 'other'
          location: unknown | null
          location_name: string | null
          meeting_type: 'in-person' | 'video-call' | 'phone-call' | null
          meeting_url: string | null
          start_time: string
          end_time: string
          duration_minutes: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
          is_paid: boolean
          price: number | null
          payment_id: string | null
          reminder_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          participant_id?: string | null
          title: string
          description?: string | null
          booking_type: 'meetup' | 'date' | 'activity' | 'consultation' | 'other'
          location?: unknown | null
          location_name?: string | null
          meeting_type?: 'in-person' | 'video-call' | 'phone-call' | null
          meeting_url?: string | null
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
          is_paid?: boolean
          price?: number | null
          payment_id?: string | null
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          participant_id?: string | null
          title?: string
          description?: string | null
          booking_type?: 'meetup' | 'date' | 'activity' | 'consultation' | 'other'
          location?: unknown | null
          location_name?: string | null
          meeting_type?: 'in-person' | 'video-call' | 'phone-call' | null
          meeting_url?: string | null
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
          is_paid?: boolean
          price?: number | null
          payment_id?: string | null
          reminder_sent?: boolean
          updated_at?: string
        }
      }
      companions: {
        Row: {
          id: string
          owner_id: string
          name: string
          species: 'dog' | 'cat' | 'dragon' | 'unicorn' | 'phoenix' | 'custom'
          avatar_url: string
          personality_traits: string[]
          mood: 'happy' | 'excited' | 'calm' | 'curious' | 'sleepy'
          level: number
          experience: number
          happiness: number
          accessories: string[]
          last_interaction: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          species: 'dog' | 'cat' | 'dragon' | 'unicorn' | 'phoenix' | 'custom'
          avatar_url: string
          personality_traits?: string[]
          mood?: 'happy' | 'excited' | 'calm' | 'curious' | 'sleepy'
          level?: number
          experience?: number
          happiness?: number
          accessories?: string[]
          last_interaction?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          species?: 'dog' | 'cat' | 'dragon' | 'unicorn' | 'phoenix' | 'custom'
          avatar_url?: string
          personality_traits?: string[]
          mood?: 'happy' | 'excited' | 'calm' | 'curious' | 'sleepy'
          level?: number
          experience?: number
          happiness?: number
          accessories?: string[]
          last_interaction?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: {
          location1: unknown
          location2: unknown
        }
        Returns: number
      }
      get_nearby_profiles: {
        Args: {
          user_location: unknown
          max_distance_km?: number
          limit_count?: number
        }
        Returns: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          distance_km: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
