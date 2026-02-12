-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (so we can check if someone is admin easily, or restrict to auth users)
-- Actually, only admins need to read this table to manage it. 
-- But the application needs to check it. Service role key bypasses RLS.
-- But using `createClient` in `admin.ts` uses anon key potentially?
-- `createClient` from `@/lib/supabase/server` uses cookie auth, so it acts as the user.
-- So the user needs select permission to check if they are an admin? 
-- No, we can use a wrapper that bypasses RLS or just allow read for authenticated users to check their own status?
-- Simplest: Allow read for authenticated users.
CREATE POLICY "Allow read access for authenticated users" ON admins
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow write access only to admins? 
-- This creates a circular dependency if we use RLS to check admin status.
-- Only existing admins can add new admins.
-- We can seed the initial admin.

INSERT INTO admins (email) VALUES ('syntaxisreaper@gmail.com') ON CONFLICT DO NOTHING;
insert into admins (email) values ('arman@example.com') on conflict do nothing;
