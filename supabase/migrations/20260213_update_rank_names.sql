-- Update default rank for new profiles
ALTER TABLE profiles 
ALTER COLUMN rank SET DEFAULT 'Localhost 🏠';

-- Update existing profiles with old default to new default
UPDATE profiles 
SET rank = 'Localhost 🏠' 
WHERE rank = 'Script Kiddie';
