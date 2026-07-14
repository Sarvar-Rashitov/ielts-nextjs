# Google OAuth Setup Guide

## Overview
This IELTS CDI platform uses **Supabase Authentication** with **Google OAuth provider**. Google login is already implemented in the code, you just need to configure it in Google Cloud Console and Supabase Dashboard.

---

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on project dropdown (top left)
3. Click **"New Project"** or select existing project
4. Name: `IELTS-CDI-Platform` (or your preferred name)
5. Click **Create**

### 1.2 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click on it and press **Enable**

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **Create**
4. Fill in the form:
   - **App name**: IELTS CDI Platform
   - **User support email**: your email
   - **Developer contact email**: your email
5. Click **Save and Continue**
6. Skip **Scopes** (click Save and Continue)
7. Add test users (your email) if in testing mode
8. Click **Save and Continue** → **Back to Dashboard**

### 1.4 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `IELTS CDI Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for local development)
   - `https://yourdomain.com` (for production)
6. **Authorized redirect URIs**:
   - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (optional, for testing)
   
   ⚠️ **IMPORTANT**: Replace `YOUR_PROJECT_ID` with your actual Supabase project ID
   
   Example: `https://uvcnkaolhovqnofzngtx.supabase.co/auth/v1/callback`

7. Click **Create**
8. **Copy and save**:
   - Client ID (looks like: `123456789-abc.apps.googleusercontent.com`)
   - Client Secret (looks like: `GOCSPX-abc123xyz`)

---

## Step 2: Supabase Configuration

### 2.1 Find Your Project ID
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** (example: `https://uvcnkaolhovqnofzngtx.supabase.co`)
5. The project ID is the subdomain: `uvcnkaolhovqnofzngtx`

### 2.2 Enable Google Provider
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle **Enable** switch ON
4. Paste the credentials from Google Cloud Console:
   - **Client ID**: `123456789-abc.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-abc123xyz`
5. Click **Save**

### 2.3 Configure Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Add **Site URL**: `http://localhost:3000` (for dev) or `https://yourdomain.com` (for prod)
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)
4. Click **Save**

---

## Step 3: Update Environment Variables

Open `.env.local` and fill in your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uvcnkaolhovqnofzngtx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Other variables...
DEEPSEEK_API_KEY=your_key_here
CLICK_MERCHANT_ID=your_merchant_id
```

**Where to find these:**
- Go to Supabase Dashboard → **Settings** → **API**
- Copy **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 4: Test Google Login

### 4.1 Start Development Server
```bash
npm run dev
```

### 4.2 Test the Flow
1. Open `http://localhost:3000`
2. Click **"Get started"** or **"Sign in"**
3. Click **"Continue with Google"** button
4. You should see Google's OAuth consent screen
5. Select your Google account
6. After authorization, you'll be redirected to `/dashboard`

### 4.3 Common Issues

**❌ Error: "redirect_uri_mismatch"**
- **Solution**: Make sure the redirect URI in Google Cloud Console **exactly matches** your Supabase callback URL:
  - Format: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
  - Check for typos, extra slashes, or wrong protocol (http vs https)

**❌ Error: "Access blocked: This app's request is invalid"**
- **Solution**: Complete the OAuth consent screen configuration in Google Cloud Console
- Add your email as a test user if the app is in testing mode

**❌ Error: "Invalid OAuth client"**
- **Solution**: Double-check that Client ID and Client Secret are correctly pasted in Supabase Dashboard

**❌ User redirects to login instead of dashboard**
- **Solution**: Check browser console for errors. Verify Supabase URL and anon key are correct in `.env.local`

---

## Step 5: Production Deployment

### 5.1 Update Google Cloud Console
1. Go to **Credentials** → Edit your OAuth 2.0 Client
2. Add production URLs:
   - **Authorized JavaScript origins**: `https://yourdomain.com`
   - **Authorized redirect URIs**: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

### 5.2 Update Supabase
1. Go to **Authentication** → **URL Configuration**
2. Change **Site URL** to `https://yourdomain.com`
3. Add redirect URL: `https://yourdomain.com/auth/callback`

### 5.3 Update Environment Variables
In your production environment (Vercel, Netlify, etc.), set:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://uvcnkaolhovqnofzngtx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Code Reference

The Google OAuth flow is already implemented in these files:

### Login Page (`app/auth/login/page.tsx`)
```typescript
const handleGoogle = async () => {
  const { hostname, protocol } = window.location
  const origin = hostname === "localhost"
    ? "http://localhost:3000"
    : `${protocol}//${hostname}`

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
      queryParams: { prompt: "select_account" },
    },
  })
}
```

### Callback Handler (`app/auth/callback/route.ts`)
```typescript
export async function GET(request: NextRequest) {
  const code = requestUrl.searchParams.get("code")
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  // Redirects to dashboard after successful authentication
}
```

---

## Database Tables (Optional)

If you want to store additional user data, create a `profiles` table in Supabase:

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  plan text default 'free',
  created_at timestamp with time zone default now()
);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## Summary Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID and Secret
- [ ] Added correct redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- [ ] Enabled Google provider in Supabase Authentication
- [ ] Pasted Client ID and Secret in Supabase
- [ ] Configured redirect URLs in Supabase
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Tested Google login on `http://localhost:3000`
- [ ] Google login works successfully ✅

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all URLs match exactly (no trailing slashes)
3. Check Supabase logs: Dashboard → Authentication → Logs
4. Ensure OAuth consent screen is configured and published
5. Contact support: support@ieltscdi.com
