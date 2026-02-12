-- Create Events table (optional, if we want to store additional metadata or sync with MDX)
-- For this phase, we are using MDX for content, but we need an ID mapping for registrations.
-- We'll assume the 'slug' is the unique identifier for now.

-- Create Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_slug TEXT NOT NULL,
  UNIQUE(user_id, event_slug)
);

-- Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own registrations" ON registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" ON registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Optional: Policy for admins to view all (needs admin role implementation later)
