/* Notification management system */

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: { label: string; onClick: () => void }
}

const notifications = new Map<string, Notification>()
const listeners = new Set<(notifs: Notification[]) => void>()

export function addNotification(
  notification: Omit<Notification, 'id'>
): string {
  const id = Math.random().toString(36).substr(2, 9)
  const notif = { ...notification, id }
  notifications.set(id, notif)

  if (notification.duration) {
    setTimeout(() => removeNotification(id), notification.duration)
  }

  notifyListeners()
  return id
}

export function removeNotification(id: string) {
  notifications.delete(id)
  notifyListeners()
}

export function getNotifications(): Notification[] {
  return Array.from(notifications.values())
}

export function subscribe(listener: (notifs: Notification[]) => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notifyListeners() {
  const notifs = getNotifications()
  listeners.forEach((listener) => listener(notifs))
}

// Convenience functions
export const notify = {
  success: (title: string, message?: string) =>
    addNotification({ type: 'success', title, message, duration: 3000 }),
  error: (title: string, message?: string) =>
    addNotification({ type: 'error', title, message, duration: 5000 }),
  warning: (title: string, message?: string) =>
    addNotification({ type: 'warning', title, message, duration: 4000 }),
  info: (title: string, message?: string) =>
    addNotification({ type: 'info', title, message, duration: 3000 }),
}
