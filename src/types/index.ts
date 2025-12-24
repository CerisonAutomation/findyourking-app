export interface Profile {
  id: string
  username: string
  display_name: string
  bio?: string
  date_of_birth: string
  gender: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say'
  interested_in: string[]
  avatar_url?: string
  photos: string[]
  videos: string[]
  is_verified: boolean
  is_premium: boolean
  is_online: boolean
  interests: string[]
  looking_for?: 'friends' | 'dating' | 'relationship' | 'networking' | 'events'
  location_city?: string
  location_country?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  creator_id: string
  title: string
  description: string
  category: 'social' | 'sports' | 'arts' | 'food' | 'music' | 'outdoor' | 'games' | 'other'
  location_name: string
  start_time: string
  end_time: string
  max_attendees?: number
  current_attendees: number
  cover_image?: string
  is_public: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  creator_id: string
  participant_id?: string
  title: string
  description?: string
  booking_type: 'meetup' | 'date' | 'activity' | 'consultation' | 'other'
  meeting_type?: 'in-person' | 'video-call' | 'phone-call'
  meeting_url?: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  is_paid: boolean
  price?: number
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  participant_1_id: string
  participant_2_id: string
  is_group: boolean
  group_name?: string
  last_message_id?: string
  last_message_at?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content?: string
  message_type: 'text' | 'image' | 'video' | 'voice' | 'location' | 'event' | 'booking'
  media_url?: string
  is_read: boolean
  is_edited: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface Companion {
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
  created_at: string
  updated_at: string
}
