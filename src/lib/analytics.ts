/* Analytics event tracking */

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: number
}

const events: AnalyticsEvent[] = []

export function trackEvent(event: AnalyticsEvent) {
  const trackingEvent = {
    ...event,
    timestamp: event.timestamp || Date.now(),
  }
  events.push(trackingEvent)

  // Send to analytics service
  if (typeof window !== 'undefined') {
    navigator.sendBeacon('/api/analytics', JSON.stringify(trackingEvent))
  }
}

export function trackPageView(page: string, properties?: Record<string, any>) {
  trackEvent({
    name: 'page_view',
    properties: { page, ...properties },
  })
}

export function trackUserAction(action: string, userId?: string, properties?: Record<string, any>) {
  trackEvent({
    name: `user_${action}`,
    userId,
    properties,
  })
}

export function trackError(error: Error, context?: Record<string, any>) {
  trackEvent({
    name: 'error_occurred',
    properties: {
      message: error.message,
      stack: error.stack,
      ...context,
    },
  })
}
