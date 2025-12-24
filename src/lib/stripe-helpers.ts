/* Stripe payment helpers and utilities */

export interface StripeConfig {
  amount: number
  currency: string
  metadata?: Record<string, any>
}

export async function createPaymentIntent(config: StripeConfig) {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  return response.json()
}

export async function confirmPayment(paymentIntentId: string) {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId }),
  })
  return response.json()
}

export function formatPrice(cents: number, currency = 'EUR'): string {
  const amount = cents / 100
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function calculateFee(amount: number, feePercent = 2.9): number {
  return Math.round(amount * (feePercent / 100) + 30)
}
