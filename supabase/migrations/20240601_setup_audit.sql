-- Create audit_logs table
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id), -- The user who performed the action (if applicable)
  action text not null,                   -- e.g., 'DELETE_USER', 'UPDATE_RANK'
  details jsonb,                          -- Additional data (e.g., target_user_id)
  ip_address text                         -- Optional: IP address of the requester
);

-- Enable RLS
alter table audit_logs enable row level security;

-- Policy: Admins can view audit logs
create policy "Admins can view audit logs"
  on audit_logs for select
  using (
    auth.jwt() ->> 'email' = 'syntaxisreaper@gmail.com'
  );

-- Policy: Service role can insert logs (server actions use service role mostly for admin tasks, but we need to check how we insert)
-- Actually, if we use `createAdminClient` which uses service_role key, it bypasses RLS. 
-- But detailed RLS for insert is good if we insert as authenticated user.
create policy "Authenticated users can insert logs"
  on audit_logs for insert
  with check (auth.uid() = user_id);

-- Let's just allow service role full access (default) and restricting select to admins.
