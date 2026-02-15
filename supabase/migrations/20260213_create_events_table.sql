-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    image TEXT,
    registration_link TEXT,
    feedback_link TEXT,
    tags TEXT[],
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for everyone
CREATE POLICY "Allow public read access" ON events
    FOR SELECT USING (true);

-- Create policy to allow all access for authenticated users (admins)
-- Note: In a real app, we would use a custom claim or role.
-- For now, we assume any authenticated user with access to the admin panel (checked in app) can modify.
-- But since we are restricting admin panel access via code, we can ideally relax this or relying on app-side check.
-- However, for better security, we should ideally restrict this.
-- we will allow insert/update/delete for authenticated users for now.
CREATE POLICY "Allow authenticated full access" ON events
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed existing event
INSERT INTO events (slug, title, date, location, description, image, registration_link, feedback_link, tags, is_published)
VALUES (
    'git-github-workshop',
    'Git and Github Session',
    '2026-02-17 10:00:00+00', -- Assuming UTC or local time, adjust as needed
    'Room 419, Academic Block',
    'Join us for a hands-on workshop on Git and GitHub. Learn the basics of version control, how to create repositories, make commits, and collaborate with others.',
    '/events/git-github-workshop.jpeg',
    'https://forms.gle/tEmc6EmDzpacUG4a7',
    'https://forms.gle/ub4q12Y3yudfrzm79',
    ARRAY['Workshop', 'Git', 'GitHub', 'Version Control'],
    true
) ON CONFLICT (slug) DO NOTHING;
