# FindYourKing - Premium Location-Based Social Platform

🔥 **Full-Stack Dating & Social Networking Platform** with AI Companions, Event Booking, Advanced Geolocation

## 🌟 Features

### Core Features
- **📍 Advanced Geolocation**: Grid-based proximity search with real-time distance calculations
- **🗺️ Interactive Maps**: Leaflet integration for visual location browsing
- **🔍 Smart Filters**: Multi-dimensional filtering (age, distance, interests, availability, verified status)
- **📅 Event System**: Create, browse, RSVP to local events with calendar integration
- **📖 Booking System**: Schedule meetups, dates, and activities with time slot management
- **🤖 AI Companions**: Interactive AI pets with personality and chat capabilities
- **💬 Real-time Chat**: Socket.io powered instant messaging with typing indicators
- **📸 Rich Profiles**: Multi-photo galleries, videos, voice notes, badges
- **⭐ Premium Tiers**: Subscription-based features with Stripe integration
- **🔒 Privacy & Safety**: Verification system, block/report, photo moderation

### Grid & Discovery
- **Grid View**: Pinterest-style masonry grid with infinite scroll
- **List View**: Detailed card-based list with quick actions
- **Map View**: Interactive map showing nearby users/events
- **Story View**: Instagram-style stories for temporary content

### Events & Booking
- **Event Creation**: Full event management with photos, location, capacity
- **RSVP System**: Track attendees, waitlists, confirmations
- **Calendar Integration**: Export to Google Calendar, iCal
- **Time Slots**: Book specific time windows for activities
- **Group Events**: Multi-user event coordination
- **Event Chat**: Dedicated chat rooms for event participants

### Advanced Features
- **Smart Matching Algorithm**: ML-based compatibility scoring
- **Video Profiles**: Short video introductions
- **Voice Messages**: Audio message support
- **Live Status**: Online/offline indicators, last seen
- **Read Receipts**: Message delivery and read status
- **Push Notifications**: Real-time alerts via FCM
- **Multi-language**: i18n support for global reach
- **Dark Mode**: Full theme customization

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **React Hook Form + Zod** - Form validation
- **Leaflet** - Interactive maps
- **Radix UI** - Accessible components

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database with PostGIS extension
  - Authentication (Google OAuth, Magic Links, Phone)
  - Real-time subscriptions
  - Storage for images/videos
  - Edge Functions for serverless logic
- **Socket.io** - Real-time messaging
- **Stripe** - Payment processing
- **OpenAI API** - AI companion features

### DevOps
- **Vercel** - Deployment and hosting
- **GitHub Actions** - CI/CD
- **Docker** - Containerization (optional)

## 📁 Project Structure

```
findyourking-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (main)/            # Main app routes
│   │   │   ├── explore/       # Grid/Map/List views
│   │   │   ├── events/        # Event browsing & management
│   │   │   ├── bookings/      # Booking system
│   │   │   ├── messages/      # Chat interface
│   │   │   ├── profile/       # User profiles
│   │   │   └── settings/      # User settings
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── profile/           # Profile-related components
│   │   ├── events/            # Event components
│   │   ├── maps/              # Map components
│   │   ├── filters/           # Filter components
│   │   └── chat/              # Chat components
│   ├── lib/
│   │   ├── supabase/          # Supabase client & utilities
│   │   ├── stripe/            # Stripe integration
│   │   ├── socket/            # Socket.io client
│   │   └── openai/            # AI companion logic
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript types
├── supabase/
│   ├── migrations/            # Database migrations
│   ├── functions/             # Edge Functions
│   └── seed.sql               # Seed data
├── types/
│   └── supabase.ts           # Generated types
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Stripe account (for payments)
- Google Maps API key
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/CerisonAutomation/findyourking-app.git
cd findyourking-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. **Set up Supabase**
- Create a new Supabase project
- Run migrations: `supabase db push`
- Enable PostGIS extension for geolocation
- Set up authentication providers
- Configure storage buckets

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🗄️ Database Schema

See `supabase/migrations/` for complete schema. Key tables:

- `profiles` - User profiles with geolocation (PostGIS point)
- `events` - Events with location and RSVP tracking
- `bookings` - Time slot bookings and reservations
- `messages` - Chat messages with real-time sync
- `companions` - AI pet companions
- `subscriptions` - Premium membership tiers
- `filters` - User search preferences
- `blocks` - User blocking/reporting

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first, works on all devices
- **Infinite Scroll**: Seamless content loading
- **Optimistic Updates**: Instant UI feedback
- **Skeleton Loading**: Smooth loading states
- **Error Boundaries**: Graceful error handling
- **Accessibility**: WCAG 2.1 AA compliant

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- JWT token-based authentication
- Rate limiting on API routes
- Image moderation with AI
- HTTPS everywhere
- CSRF protection
- Content Security Policy

## 📱 Mobile App (Future)

- React Native version planned
- Share 80% codebase with web
- Native geolocation and push notifications

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with inspiration from:
- Grindr/Scruff (location-based discovery)
- Bumble (user-first design)
- Eventbrite (event management)
- Calendly (booking system)
- OpenAI (AI companions)

---

**Made with 💛 by the FindYourKing Team**
