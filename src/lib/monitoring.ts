/**
 * Monitoring and error tracking setup
 * Integrates Sentry for production error tracking
 */

import * as Sentry from '@sentry/nextjs'

const isDevelopment = process.env.NODE_ENV === 'development'

// Initialize Sentry
if (!isDevelopment && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 50,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    beforeSend(event, hint) {
      // Don't send certain errors
      if (event.exception) {
        const error = hint.originalException
        if (error instanceof Error) {
          // Skip known safe errors
          if (error.message.includes('Network request failed')) {
            return null
          }
        }
      }
      return event
    },
  })
}

interface ErrorContext {
  userId?: string
  requestId?: string
  endpoint?: string
  method?: string
  statusCode?: number
  duration?: number
  [key: string]: any
}

// Capture exception with context
export function captureException(error: Error, context?: ErrorContext) {
  if (isDevelopment) {
    console.error('Error:', error, context)
    return
  }

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, { value })
      })
    }
    Sentry.captureException(error)
  })
}

// Capture message with level
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: ErrorContext,
) {
  if (isDevelopment) {
    console.log(`[${level.toUpperCase()}] ${message}`, context)
    return
  }

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, { value })
      })
    }
    Sentry.captureMessage(message, level)
  })
}

// Set user context
export function setUserContext(userId?: string, email?: string, username?: string) {
  Sentry.setUser(
    userId ? { id: userId, email, username } : null,
  )
}

// Add breadcrumb
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  data?: any,
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  })
}
