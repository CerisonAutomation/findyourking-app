'use client'

import { Component, ReactNode } from 'react'
import { captureException } from '@/lib/monitoring'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to Sentry
    captureException(error, {
      component: errorInfo.componentStack,
      errorBoundary: true,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
            <div className="max-w-md w-full text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
              <p className="text-slate-400 mb-6">We apologize for the inconvenience. Our team has been notified.</p>
              <button
                onClick={() => window.location.href = '/explore'}
                className="bg-gold-500 text-slate-900 px-6 py-2 rounded-lg font-medium hover:bg-gold-600 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
