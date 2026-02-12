-- Allow admins to view all registrations
-- We assume anyone in the 'admins' table OR the specific super admin email is an admin.
-- Note: 'auth.jwt()' -> 'email' is often available.
-- However, RLS using joins can be tricky.

CREATE POLICY "Admins can view all registrations" ON registrations
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins WHERE email = (select auth.jwt() ->> 'email')
        )
        OR
        (select auth.jwt() ->> 'email') = 'syntaxisreaper@gmail.com'
    );
