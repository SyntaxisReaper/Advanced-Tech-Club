-- Fix RLS for Gamification (Admin Check-in)

-- 1. Allow Admins to UPDATE registrations (for check-in)
CREATE POLICY "Admins can update registrations" ON registrations
    FOR UPDATE TO authenticated
    USING ( is_admin() );

-- 2. Allow Admins to UPDATE profiles (for XP/Rank)
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE TO authenticated
    USING ( is_admin() );

-- 3. Allow Admins to SELECT profiles (to see XP/Rank before update)
-- Existing policy "Public profiles are viewable by everyone" might cover SELECT, 
-- but let's be explicit if needed. The public policy uses (true) so it's fine.
-- However, we only added "Users can update their own profile". 
-- We need to ensure Admins can update ANY profile.

-- Drop existing restricted update policy if it conflicts? 
-- Postgres allows multiple policies (OR logic), so adding a new one is sufficient.
