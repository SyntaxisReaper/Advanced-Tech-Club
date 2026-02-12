# Database Migration Instructions

To make the Admin Dashboard working, you need to update your Supabase database.

## Steps
1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Go to the **SQL Editor** (icon on the left sidebar).
4.  Copy and paste the content of the following files one by one and click **Run**.

### 1. Create Events Table
File: `supabase/migrations/20260213_create_events_table.sql`
> Creates the table to store dynamic events and seeds the "Git and Github Session".

### 2. Add Content Column
File: `supabase/migrations/20260213_add_content_column.sql`
> Adds support for full Markdown content in events.

### 3. Update Registrations Table
File: `supabase/migrations/20260213_add_user_details_to_registrations.sql`
> Adds email and name fields to registrations so you can see who registered.

### 4. Create Admins Table
File: `supabase/migrations/20260213_create_admins_table.sql`
> Creates a table to manage admin access. Defaults `syntaxisreaper@gmail.com` as admin.

## Verification
After running these scripts:
1.  Go to your deployed site (or localhost).
2.  Log in with `syntaxisreaper@gmail.com`.
3.  Go to **Profile**.
4.  You should see an **"Admin Dashboard"** button next to the title.
5.  Click it to manage events and view registrations!
