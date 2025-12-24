/**
 * Centralized error definitions and handling
 * This ensures consistent error responses across the app
 */

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    public userMessage: string,
    public context?: Record<string, any>,
  ) {
    super(userMessage)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields: Record<string, string[]>) {
    super('VALIDATION_ERROR', 400, message, { fields })
    this.name = 'ValidationError'
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super('AUTH_ERROR', 401, message)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super('FORBIDDEN', 403, message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super(
      'RATE_LIMIT',
      429,
      'Too many requests. Please try again later.',
      { retryAfter },
    )
    this.name = 'RateLimitError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', 409, message)
    this.name = 'ConflictError'
  }
}

export class InternalError extends AppError {
  constructor(message = 'An unexpected error occurred') {
    super('INTERNAL_ERROR', 500, message)
    this.name = 'InternalError'
  }
}

// Error handler function
export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error)
    return new InternalError('An unexpected error occurred')
  }

  return new InternalError('Unknown error')
}

// Format error response for API
export function formatErrorResponse(error: AppError) {
  return {
    error: {
      code: error.code,
      message: error.userMessage,
      ...(error.context && { context: error.context }),
    },
  }
}
