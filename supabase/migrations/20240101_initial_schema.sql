-- Enable PostGIS extension for geolocation
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'non-binary', 'other', 'prefer-not-to-say')),
  interested_in TEXT[] DEFAULT ARRAY['male', 'female'],
  
  -- Geolocation (PostGIS)
  location GEOGRAPHY(POINT, 4326),
  location_name TEXT,
  location_city TEXT,
  location_country TEXT,
  show_distance BOOLEAN DEFAULT true,
  max_distance_km INTEGER DEFAULT 50,
  
  -- Profile media
  avatar_url TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ,
  
  -- Preferences
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  languages TEXT[] DEFAULT ARRAY['en'],
  looking_for TEXT CHECK (looking_for IN ('friends', 'dating', 'relationship', 'networking', 'events')),
  
  -- Privacy
  show_age BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT true,
  incognito_mode BOOLEAN DEFAULT false,
  
  -- Stats
  profile_views INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_birth_date CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years')
);

-- Index for geospatial queries
CREATE INDEX profiles_location_idx ON profiles USING GIST(location);
CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_is_online_idx ON profiles(is_online);

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Event details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('social', 'sports', 'arts', 'food', 'music', 'outdoor', 'games', 'other')),
  
  -- Location
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  location_name TEXT NOT NULL,
  location_address TEXT,
  location_city TEXT,
  
  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  
  -- Capacity
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  
  -- Media
  cover_image TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Settings
  is_public BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT false,
  allow_guests BOOLEAN DEFAULT true,
  
  -- Pricing
  is_paid BOOLEAN DEFAULT false,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  
  -- Status
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  
  -- Tags
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_event_times CHECK (end_time > start_time)
);

CREATE INDEX events_location_idx ON events USING GIST(location);
CREATE INDEX events_creator_idx ON events(creator_id);
CREATE INDEX events_start_time_idx ON events(start_time);
CREATE INDEX events_category_idx ON events(category);
CREATE INDEX events_status_idx ON events(status);

-- =====================================================
-- EVENT RSVPS
-- =====================================================
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- RSVP details
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('going', 'interested', 'declined', 'pending', 'waitlist')),
  guests_count INTEGER DEFAULT 0,
  
  -- Payment
  paid BOOLEAN DEFAULT false,
  payment_id TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, user_id)
);

CREATE INDEX event_rsvps_event_idx ON event_rsvps(event_id);
CREATE INDEX event_rsvps_user_idx ON event_rsvps(user_id);
CREATE INDEX event_rsvps_status_idx ON event_rsvps(status);

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Booking details
  title TEXT NOT NULL,
  description TEXT,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('meetup', 'date', 'activity', 'consultation', 'other')),
  
  -- Location
  location GEOGRAPHY(POINT, 4326),
  location_name TEXT,
  meeting_type TEXT CHECK (meeting_type IN ('in-person', 'video-call', 'phone-call')),
  meeting_url TEXT,
  
  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) / 60) STORED,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')),
  
  -- Pricing
  is_paid BOOLEAN DEFAULT false,
  price DECIMAL(10, 2),
  payment_id TEXT,
  
  -- Notifications
  reminder_sent BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_booking_times CHECK (end_time > start_time)
);

CREATE INDEX bookings_creator_idx ON bookings(creator_id);
CREATE INDEX bookings_participant_idx ON bookings(participant_id);
CREATE INDEX bookings_start_time_idx ON bookings(start_time);
CREATE INDEX bookings_status_idx ON bookings(status);

-- =====================================================
-- CONVERSATIONS
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Participants
  participant_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Group chat support
  is_group BOOLEAN DEFAULT false,
  group_name TEXT,
  group_avatar TEXT,
  
  -- Last message
  last_message_id UUID,
  last_message_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT different_participants CHECK (participant_1_id != participant_2_id),
  UNIQUE(participant_1_id, participant_2_id)
);

CREATE INDEX conversations_participant_1_idx ON conversations(participant_1_id);
CREATE INDEX conversations_participant_2_idx ON conversations(participant_2_id);
CREATE INDEX conversations_last_message_idx ON conversations(last_message_at DESC);

-- =====================================================
-- MESSAGES
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'voice', 'location', 'event', 'booking')),
  
  -- Media
  media_url TEXT,
  media_thumbnail TEXT,
  media_duration INTEGER, -- for voice/video
  
  -- References
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX messages_conversation_idx ON messages(conversation_id, created_at DESC);
CREATE INDEX messages_sender_idx ON messages(sender_id);
CREATE INDEX messages_is_read_idx ON messages(is_read) WHERE is_read = false;

-- =====================================================
-- AI COMPANIONS
-- =====================================================
CREATE TABLE companions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Companion details
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'dragon', 'unicorn', 'phoenix', 'custom')),
  avatar_url TEXT NOT NULL,
  
  -- Personality
  personality_traits TEXT[] DEFAULT ARRAY['friendly', 'playful'],
  mood TEXT DEFAULT 'happy' CHECK (mood IN ('happy', 'excited', 'calm', 'curious', 'sleepy')),
  
  -- Stats
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  happiness INTEGER DEFAULT 100 CHECK (happiness BETWEEN 0 AND 100),
  
  -- Customization
  accessories TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Activity
  last_interaction TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(owner_id) -- One companion per user
);

CREATE INDEX companions_owner_idx ON companions(owner_id);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'gold', 'platinum')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  
  -- Billing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX subscriptions_user_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_stripe_customer_idx ON subscriptions(stripe_customer_id);

-- =====================================================
-- USER FILTERS & PREFERENCES
-- =====================================================
CREATE TABLE user_filters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Age range
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 100,
  
  -- Distance
  max_distance_km INTEGER DEFAULT 50,
  
  -- Interests
  required_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Other filters
  only_verified BOOLEAN DEFAULT false,
  only_premium BOOLEAN DEFAULT false,
  only_online BOOLEAN DEFAULT false,
  
  -- Looking for
  looking_for TEXT[] DEFAULT ARRAY['friends', 'dating'],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX user_filters_user_idx ON user_filters(user_id);

-- =====================================================
-- BLOCKS & REPORTS
-- =====================================================
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(blocker_id, blocked_id),
  CONSTRAINT cannot_block_self CHECK (blocker_id != blocked_id)
);

CREATE INDEX blocks_blocker_idx ON blocks(blocker_id);
CREATE INDEX blocks_blocked_idx ON blocks(blocked_id);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('harassment', 'inappropriate-content', 'spam', 'fake-profile', 'other')),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT cannot_report_self CHECK (reporter_id != reported_id)
);

CREATE INDEX reports_reporter_idx ON reports(reporter_id);
CREATE INDEX reports_reported_idx ON reports(reported_id);
CREATE INDEX reports_status_idx ON reports(status);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
  location1 GEOGRAPHY,
  location2 GEOGRAPHY
) RETURNS NUMERIC AS $$
BEGIN
  RETURN ST_Distance(location1, location2) / 1000; -- Returns distance in kilometers
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get nearby profiles
CREATE OR REPLACE FUNCTION get_nearby_profiles(
  user_location GEOGRAPHY,
  max_distance_km INTEGER DEFAULT 50,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    (ST_Distance(p.location, user_location) / 1000)::NUMERIC as distance_km
  FROM profiles p
  WHERE p.location IS NOT NULL
    AND ST_DWithin(p.location, user_location, max_distance_km * 1000)
  ORDER BY p.location <-> user_location
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companions_updated_at BEFORE UPDATE ON companions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- EVENTS policies
CREATE POLICY "Public events are viewable by everyone"
  ON events FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = creator_id);

-- EVENT_RSVPS policies
CREATE POLICY "Users can view RSVPs for events they created or RSVPed to"
  ON event_rsvps FOR SELECT
  USING (
    user_id = auth.uid() OR
    event_id IN (SELECT id FROM events WHERE creator_id = auth.uid())
  );

CREATE POLICY "Users can create their own RSVPs"
  ON event_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSVPs"
  ON event_rsvps FOR UPDATE
  USING (auth.uid() = user_id);

-- BOOKINGS policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = creator_id OR auth.uid() = participant_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update bookings they're part of"
  ON bookings FOR UPDATE
  USING (auth.uid() = creator_id OR auth.uid() = participant_id);

-- CONVERSATIONS policies
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- MESSAGES policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1_id = auth.uid() OR participant_2_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1_id = auth.uid() OR participant_2_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- COMPANIONS policies
CREATE POLICY "Users can view their own companion"
  ON companions FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own companion"
  ON companions FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own companion"
  ON companions FOR UPDATE
  USING (auth.uid() = owner_id);

-- SUBSCRIPTIONS policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- USER_FILTERS policies
CREATE POLICY "Users can view their own filters"
  ON user_filters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own filters"
  ON user_filters FOR ALL
  USING (auth.uid() = user_id);

-- BLOCKS policies
CREATE POLICY "Users can view their blocks"
  ON blocks FOR SELECT
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks"
  ON blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can remove their blocks"
  ON blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- REPORTS policies
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);
