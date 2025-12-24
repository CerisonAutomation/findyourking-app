/* Reusable database query patterns */

import { supabase } from './supabase'

/* Profile Queries */
export async function getProfileById(id: string) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
}

export async function getProfilesByIds(ids: string[]) {
  return supabase.from('profiles').select('*').in('id', ids)
}

export async function getProfilesByLocation(city: string, limit = 50) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('location_city', city)
    .limit(limit)
}

/* Event Queries */
export async function getEventById(id: string) {
  return supabase.from('events').select('*').eq('id', id).single()
}

export async function getUpcomingEvents(limit = 20) {
  const now = new Date().toISOString()
  return supabase
    .from('events')
    .select('*')
    .gt('start_time', now)
    .order('start_time', { ascending: true })
    .limit(limit)
}

export async function getEventsByLocation(city: string, limit = 50) {
  return supabase
    .from('events')
    .select('*')
    .ilike('location_name', `%${city}%`)
    .limit(limit)
}

/* Message Queries */
export async function getConversation(userId1: string, userId2: string) {
  return supabase
    .from('conversations')
    .select('*')
    .or(`(user1_id.eq.${userId1},user2_id.eq.${userId2}),(user1_id.eq.${userId2},user2_id.eq.${userId1})`)
    .single()
}

export async function getConversationMessages(conversationId: string, limit = 50) {
  return supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit)
}
