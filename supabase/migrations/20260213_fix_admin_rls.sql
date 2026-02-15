-- Fix RLS for admins and registrations tables

-- 1. Policies for 'admins' table

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON admins;
DROP POLICY IF EXISTS "Admins can view admins" ON admins;
DROP POLICY IF EXISTS "Admins can insert admins" ON admins;
DROP POLICY IF EXISTS "Admins can delete admins" ON admins;

-- Policy: Admins can view all admins
CREATE POLICY "Admins can view admins" ON admins
    FOR SELECT TO authenticated
    USING (
        (select auth.jwt() ->> 'email') = 'syntaxisreaper@gmail.com'
        OR
        EXISTS (
            SELECT 1 FROM admins WHERE email = (select auth.jwt() ->> 'email')
        )
    );

-- Policy: Admins can insert new admins
CREATE POLICY "Admins can insert admins" ON admins
    FOR INSERT TO authenticated
    WITH CHECK (
        (select auth.jwt() ->> 'email') = 'syntaxisreaper@gmail.com'
        OR
        EXISTS (
            SELECT 1 FROM admins WHERE email = (select auth.jwt() ->> 'email')
        )
    );

-- Policy: Admins can delete admins
-- Note: Prevent deleting the last admin or super admin via application logic, but RLS should allow delete.
CREATE POLICY "Admins can delete admins" ON admins
    FOR DELETE TO authenticated
    USING (
        (select auth.jwt() ->> 'email') = 'syntaxisreaper@gmail.com'
        OR
        EXISTS (
            SELECT 1 FROM admins WHERE email = (select auth.jwt() ->> 'email')
        )
    );

-- 2. Policies for 'registrations' table

-- Drop potentially conflicting policies
DROP POLICY IF EXISTS "Admins can view all registrations" ON registrations;

-- Policy: Admins can view all registrations
CREATE POLICY "Admins can view all registrations" ON registrations
    FOR SELECT TO authenticated
    USING 
        (select auth.jwt() ->> 'email') = 'syntaxisreaper@gmail.com'
        OR
        EXISTS (
            SELECT 1 FROM admins WHERE email = (select auth.jwt() ->> 'email')
        )
        OR
        auth.uid() = user_id -- Users can always view their own registrations
    );
