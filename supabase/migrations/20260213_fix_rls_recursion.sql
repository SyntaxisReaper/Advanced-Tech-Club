-- Fix RLS Infinite Recursion using Security Definer Function

-- 1. Create a secure function to check admin status
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres),
-- bypassing RLS on the 'admins' table, thus preventing invalid recursion.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() ->> 'email') = 'syntaxisreaper@gmail.com'
    OR
    EXISTS (
      SELECT 1 FROM admins WHERE email = (auth.jwt() ->> 'email')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Policies to use the function

-- Admins Table Policies
DROP POLICY IF EXISTS "Admins can view admins" ON admins;
DROP POLICY IF EXISTS "Admins can insert admins" ON admins;
DROP POLICY IF EXISTS "Admins can delete admins" ON admins;

CREATE POLICY "Admins can view admins" ON admins
    FOR SELECT TO authenticated
    USING ( is_admin() );

CREATE POLICY "Admins can insert admins" ON admins
    FOR INSERT TO authenticated
    WITH CHECK ( is_admin() );

CREATE POLICY "Admins can delete admins" ON admins
    FOR DELETE TO authenticated
    USING ( is_admin() );

-- Registrations Table Policies
DROP POLICY IF EXISTS "Admins can view all registrations" ON registrations;

CREATE POLICY "Admins can view all registrations" ON registrations
    FOR SELECT TO authenticated
    USING (
        is_admin()
        OR
        auth.uid() = user_id -- Users can always view their own
    );
