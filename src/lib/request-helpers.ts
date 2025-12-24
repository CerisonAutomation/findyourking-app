/* HTTP request and response helpers */

export interface RequestConfig extends RequestInit {
  baseUrl?: string
  headers?: Record<string, string>
  params?: Record<string, any>
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

export async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { baseUrl: customBase, headers = {}, params, ...opts } = config

  let url = `${customBase || baseUrl}${endpoint}`
  if (params) {
    const query = new URLSearchParams(params)
    url += `?${query.toString()}`
  }

  const response = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

export const http = {
  get: <T,>(url: string, config?: RequestConfig) => request<T>(url, { ...config, method: 'GET' }),
  post: <T,>(url: string, body?: any, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'POST', body: JSON.stringify(body) }),
  put: <T,>(url: string, body?: any, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T,>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'DELETE' }),
}
