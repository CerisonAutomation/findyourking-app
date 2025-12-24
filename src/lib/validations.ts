/**
 * Zod validation schemas for all data models
 * Provides runtime type safety and validation
 */

import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Profile schemas
export const profileUpdateSchema = z.object({
  display_name: z.string().min(2, 'Name too short').max(100),
  bio: z.string().max(500, 'Bio too long').optional(),
  date_of_birth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer-not-to-say']).optional(),
  interested_in: z.array(z.string()).optional(),
  interests: z.array(z.string()).max(10, 'Maximum 10 interests'),
  location_city: z.string().max(100).optional(),
  location_country: z.string().max(100).optional(),
  avatar_url: z.string().url().optional(),
  looking_for: z.enum(['friends', 'dating', 'relationship', 'networking', 'events']).optional(),
})

// Event schemas
export const createEventSchema = z.object({
  title: z.string().min(5, 'Title too short').max(200),
  description: z.string().min(10).max(2000),
  category: z.enum(['social', 'sports', 'arts', 'food', 'music', 'outdoor', 'games', 'other']),
  location_name: z.string().min(3).max(200),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  max_attendees: z.number().int().positive().optional(),
  is_public: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
})

// Booking schemas
export const createBookingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  booking_type: z.enum(['meetup', 'date', 'activity', 'consultation', 'other']),
  meeting_type: z.enum(['in-person', 'video-call', 'phone-call']).optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  participant_id: z.string().uuid().optional(),
  is_paid: z.boolean().default(false),
  price: z.number().positive().optional(),
})

// Message schemas
export const createMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  conversation_id: z.string().uuid(),
  message_type: z.enum(['text', 'image', 'video', 'voice', 'location', 'event', 'booking']).default('text'),
  media_url: z.string().url().optional(),
})

// Pagination schemas
export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
  cursor: z.string().optional(),
})

// Export types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>
export type CreateEvent = z.infer<typeof createEventSchema>
export type CreateBooking = z.infer<typeof createBookingSchema>
export type CreateMessage = z.infer<typeof createMessageSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
