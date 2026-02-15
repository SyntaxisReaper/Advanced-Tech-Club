# Deployment Guide

## Supabase Configuration for Production

When deploying your application (e.g., to Vercel), you must update your Supabase Authentication settings to ensure users are redirected back to your production URL, not `localhost`.

### 1. Update Site URL
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Navigate to **Authentication** > **URL Configuration**.
4.  Set **Site URL** to your production URL (e.g., `https://your-app-name.vercel.app`).

### 2. Add Redirect URLs
You must explicitly whitelist the callback URLs for your production environment.
1.  In the same **URL Configuration** section, find **Redirect URLs**.
2.  Add the following URL:
    *   `https://your-app-name.vercel.app/auth/callback`
    *   *(Replace `your-app-name.vercel.app` with your actual Vercel domain)*
3.  Click **Save**.

### 3. Verify Environment Variables
Ensure your Vercel project has the correct environment variables set:
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting
If you are still redirected to `localhost`:
1.  Double-check that you clicked **Save** in Supabase.
2.  Ensure you are accessing the production URL (not a local preview).
3.  Clear your browser cookies/cache to remove old auth tokens.
