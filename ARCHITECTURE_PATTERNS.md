# Production Architecture Patterns

## 1. Server Components (RSC) Pattern

### When to Use
- Fetching data from database/API
- Accessing secrets/environment variables
- Working with databases directly
- Server-only libraries

### Pattern

```typescript
// app/profiles/[id]/page.tsx (SERVER COMPONENT)
export default async function ProfilePage({ params }) {
  // ✅ OK: Direct database access
  const profile = await db.profiles.getById(params.id)
  
  // ✅ OK: Access secrets
  const apiKey = process.env.STRIPE_SECRET_KEY
  
  return (
    <div>
      <ProfileHeader profile={profile} />
      {/* Pass Server Component as prop */}
      <ProfileImages images={profile.photos} />
    </div>
  )
}

// Components used inside can be client components
function ProfileImages({ images }: { images: string[] }) {
  // This is fine to be a client component if needed
  return <ImageGallery images={images} />
}
```

## 2. Error Handling Pattern

### Structure

```
app/
├── error.tsx          # Page-level errors
├── [feature]/
│   ├── error.tsx      # Feature-level errors
│   ├── layout.tsx
│   └── page.tsx
└── global-error.tsx   # Root-level errors
```

### Implementation

```typescript
// app/error.tsx
'use client'

export default function Error({ error, reset }) {
  useEffect(() => {
    captureException(error, { tags: { level: 'page' } })
  }, [error])

  return (
    <div>
      <h1>Something went wrong</h1>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// app/global-error.tsx
'use client'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    captureException(error, { tags: { level: 'global' } })
  }, [error])

  return (
    <html>
      <body>
        <h1>System Error</h1>
        <button onClick={() => reset()}>Reload</button>
      </body>
    </html>
  )
}
```

## 3. API Route Pattern

### Structure with Error Handling

```typescript
// app/api/profiles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { profileQueries } from '@/lib/db'
import { paginationSchema } from '@/lib/validations'
import { handleError, formatErrorResponse } from '@/lib/errors'
import { checkRateLimit, limiters } from '@/lib/rate-limit'
import { captureException } from '@/lib/monitoring'

export async function GET(request: NextRequest) {
  try {
    // 1. Rate limiting
    const limitResult = await checkRateLimit(limiters.api, request.ip || 'unknown')
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // 2. Validation
    const params = Object.fromEntries(request.nextUrl.searchParams)
    const validated = paginationSchema.safeParse(params)
    if (!validated.success) {
      return NextResponse.json(
        formatErrorResponse(new ValidationError('Invalid params', validated.error.flatten().fieldErrors)),
        { status: 400 }
      )
    }

    // 3. Business logic
    const { limit, offset } = validated.data
    const { data, error } = await profileQueries.getMany(limit, offset)
    if (error) throw error

    // 4. Success response with caching
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120',
      },
    })
  } catch (err) {
    // 5. Error handling
    const error = handleError(err)
    captureException(error as Error, {
      endpoint: request.nextUrl.pathname,
      method: request.method,
    })
    return NextResponse.json(
      formatErrorResponse(error as any),
      { status: error.statusCode || 500 }
    )
  }
}
```

## 4. Database Query Pattern

### Optimized Queries

```typescript
// ❌ ANTI-PATTERN: Slow
const profiles = await supabase
  .from('profiles')
  .select('*')  // All 50 columns!
  .limit(50)    // No pagination
  .order('id')  // No index

// ✅ PATTERN: Fast
const profiles = await supabase
  .from('profiles')
  .select('id, display_name, avatar_url, bio, location_city')  // Only needed
  .range(offset, offset + limit - 1)  // Proper pagination
  .order('created_at', { ascending: false })  // Indexed column
  .limit(limit)
```

## 5. Real-time Pattern (Pusher)

```typescript
// Server-side: Publish event
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
})

await pusher.trigger('chat-123', 'new-message', {
  user: 'Alice',
  message: 'Hello',
  timestamp: new Date(),
})

// Client-side: Listen to event
'use client'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

export function Chat() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })

    const channel = pusher.subscribe('chat-123')
    channel.bind('new-message', (data) => {
      setMessages(prev => [...prev, data])  // Real-time update
    })

    return () => {
      channel.unbind('new-message')
      pusher.unsubscribe('chat-123')
    }
  }, [])

  return <MessageList messages={messages} />
}
```

## 6. Validation Pattern

```typescript
// Endpoint with validation
import { profileUpdateSchema } from '@/lib/validations'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate
    const validated = profileUpdateSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          fields: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // Use validated data
    const profile = await updateProfile(userId, validated.data)
    return NextResponse.json(profile)
  } catch (error) {
    // ...
  }
}
```

## 7. Middleware Authentication

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // 1. Check if protected route
  if (isProtectedRoute(request.pathname)) {
    // 2. Get token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Verify token
    const user = await verifyAuth(token)
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 4. Add to headers for downstream use
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.userId)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api).*)'],
}
```

## 8. Error Boundary in Layout

```typescript
// app/layout.tsx
import { ErrorBoundary } from '@/components/error-boundary'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

## Performance Checklist

- [ ] All data fetching on server
- [ ] Images optimized with next/image
- [ ] Fonts preloaded with next/font
- [ ] Navigation prefetched with next/link
- [ ] Database queries have indexes
- [ ] API responses cached appropriately
- [ ] Compression enabled
- [ ] Code splitting configured
- [ ] Lighthouse > 90 score
- [ ] Core Web Vitals passing
