-- Gamification Schema: Profiles and Ticketing

-- 1. Create Profiles Table (XP & Rank)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    xp INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'Script Kiddie',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on sign up (optional but good practice)
-- OR we can handle this in the application level (middleware or post-signup).
-- For now, we'll rely on app-level creation or manual insert if needed, 
-- but a trigger is robust. Let's add a basic one.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, xp, rank)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 0, 'Script Kiddie');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Update Registrations Table (Ticketing)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS ticket_secret UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- Ensure ticket_secret is unique per registration
ALTER TABLE registrations ADD CONSTRAINT unique_ticket_secret UNIQUE (ticket_secret);
