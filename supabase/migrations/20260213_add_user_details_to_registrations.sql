-- Add email and full_name columns to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT;
