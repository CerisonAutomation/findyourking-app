/* Domain models for FindYourKing */

export interface Profile {
  id: string
  display_name: string
  bio?: string
  avatar_url?: string
  gender?: string
  interests?: string[]
  location_city?: string
  looking_for?: string
  is_verified?: boolean
  created_at: string
}

export interface Event {
  id: string
  creator_id: string
  title: string
  description: string
  category: string
  location_name: string
  start_time: string
  end_time: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}
