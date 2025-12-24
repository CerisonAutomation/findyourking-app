# FindYourKing - Dating & Social Platform

A modern dating and social networking application built with Next.js, Supabase, and Tailwind CSS.

## Features

- **User Discovery**: Browse and discover profiles with advanced filtering
- **Events**: Create and attend events in your area
- **Bookings**: Schedule meetings, dates, and activities
- **Messaging**: Real-time chat with other users
- **User Profiles**: Complete profile management with photos and interests
- **AI Companion**: Pet/companion feature for premium users
- **Payment Integration**: Stripe integration for premium features

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/findyourking-app.git
cd findyourking-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, signup)
│   └── (main)/            # Main app pages
├── components/            # React components
│   ├── ui/               # UI components (button, input, etc.)
│   ├── explore/          # Explore feature components
│   ├── events/           # Events feature components
│   ├── bookings/         # Bookings feature components
│   ├── chat/             # Chat feature components
│   └── profile/          # Profile feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
│   ├── supabase/        # Supabase client setup
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
```

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles
- `events` - Events created by users
- `event_rsvps` - Event attendance tracking
- `bookings` - Meeting/date bookings
- `conversations` - Chat conversations
- `messages` - Chat messages
- `companions` - AI pet/companion data

## API Routes

- `GET /api/profiles` - Get all profiles
- `GET/POST /api/events` - Get/create events
- `GET/POST /api/bookings` - Get/create bookings

## Authentication

The app supports:
- Email/password authentication
- Google OAuth

Authentication is handled by Supabase Auth.

## Deployment

The app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
