/**
 * Optimized database queries with performance patterns
 * Uses prepared queries and efficient selections
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Optimized profile queries
export const profileQueries = {
  /**
   * Get single profile with minimal fields
   */
  getById: (id: string) =>
    supabase
      .from('profiles')
      .select(`
        id,
        display_name,
        avatar_url,
        bio,
        location_city,
        is_verified,
        is_premium
      `)
      .eq('id', id)
      .single(),

  /**
   * Get profiles with pagination
   * Use keyset pagination for better performance
   */
  getMany: (limit = 50, offset = 0) =>
    supabase
      .from('profiles')
      .select(`
        id,
        display_name,
        avatar_url,
        bio,
        location_city,
        is_verified
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false }),

  /**
   * Get profiles by location
   */
  getByLocation: (city: string, limit = 50) =>
    supabase
      .from('profiles')
      .select(`
        id,
        display_name,
        avatar_url,
        bio,
        location_city,
        is_verified
      `)
      .ilike('location_city', `%${city}%`)
      .limit(limit)
      .order('created_at', { ascending: false }),

  /**
   * Search profiles by name or bio
   */
  search: (query: string, limit = 50) =>
    supabase
      .from('profiles')
      .select(`
        id,
        display_name,
        avatar_url,
        bio,
        location_city,
        is_verified
      `)
      .or(`display_name.ilike.%${query}%,bio.ilike.%${query}%`)
      .limit(limit),
}

// Optimized event queries
export const eventQueries = {
  /**
   * Get upcoming events
   */
  getUpcoming: (limit = 50) =>
    supabase
      .from('events')
      .select(`
        *,
        creator:creator_id(display_name, avatar_url),
        event_rsvps(count)
      `)
      .gt('start_time', new Date().toISOString())
      .limit(limit)
      .order('start_time', { ascending: true }),

  /**
   * Get events by category
   */
  getByCategory: (category: string, limit = 50) =>
    supabase
      .from('events')
      .select(`
        *,
        creator:creator_id(display_name, avatar_url)
      `)
      .eq('category', category)
      .gt('start_time', new Date().toISOString())
      .limit(limit)
      .order('start_time', { ascending: true }),
}

// Optimized message queries
export const messageQueries = {
  /**
   * Get conversation messages with pagination
   */
  getConversationMessages: (conversationId: string, limit = 50, offset = 0) =>
    supabase
      .from('messages')
      .select(`
        id,
        content,
        message_type,
        media_url,
        sender_id,
        is_read,
        created_at,
        sender:sender_id(display_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: true }),
}

export default supabase
