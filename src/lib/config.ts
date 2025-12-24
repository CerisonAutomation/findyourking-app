/* Application configuration */

export const config = {
  // App
  app: {
    name: 'FindYourKing',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // API
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 10000,
    retries: 3,
  },

  // Database
  database: {
    maxConnections: 20,
    connectionTimeout: 5000,
  },

  // Storage
  storage: {
    url: process.env.NEXT_PUBLIC_STORAGE_URL || '',
    bucket: 'findyourking-storage',
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },

  // Payment
  payment: {
    currency: 'EUR',
    feePercent: 2.9,
    fixedFee: 0.3,
  },

  // Limits
  limits: {
    maxProfilesPerDay: 100,
    maxMessagesPerHour: 1000,
    maxEventsPerUser: 10,
    maxPhotosPerProfile: 12,
  },

  // Features
  features: {
    premiumEnabled: true,
    realTimeEnabled: true,
    analyticsEnabled: true,
    aiFeaturesEnabled: false, // Coming soon
  },
}

export function getConfig() {
  return config
}
