/* Date and time utilities */

import { format, formatDistance, parseISO, isBefore, isAfter, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string | Date, fmt = 'PPP'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: es })
}

export function formatTime(date: string | Date, fmt = 'HH:mm'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatDateTime(date: string | Date, fmt = 'PPP HH:mm'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: es })
}

export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(d, new Date(), { locale: es, addSuffix: true })
}

export function getDaysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? parseISO(date) : date
  return differenceInDays(d, new Date())
}

export function isEventUpcoming(startDate: string | Date): boolean {
  const d = typeof startDate === 'string' ? parseISO(startDate) : startDate
  return isAfter(d, new Date())
}

export function isEventPast(endDate: string | Date): boolean {
  const d = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return isBefore(d, new Date())
}
