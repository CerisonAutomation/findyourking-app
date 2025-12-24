/* Enumeration definitions */

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  NON_BINARY: 'non_binary',
  PREFER_NOT_SAY: 'prefer_not_say',
} as const

export const LookingFor = {
  DATING: 'dating',
  RELATIONSHIP: 'relationship',
  FRIENDSHIP: 'friendship',
  NETWORKING: 'networking',
} as const

export const EventCategory = {
  SOCIAL: 'social',
  SPORTS: 'sports',
  CULTURE: 'culture',
  FOOD: 'food',
  MUSIC: 'music',
  OUTDOOR: 'outdoor',
  TECH: 'tech',
} as const

export const BookingStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export const MatchStatus = {
  INTERESTED: 'interested',
  MATCHED: 'matched',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
} as const

export const UserRole = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
} as const
