# Supabase Setup

Apply [`schema.sql`](./schema.sql) to the target Supabase project before using the site admin.

## What `schema.sql` creates

- `projects`
- `events`
- `dev_logs`
- `content_entries`
- `content_versions`
- `admin_allowlist`
- `opportunities`
- `opportunity_responses`
- `content-media` storage bucket
- `updated_at` trigger helpers for the content tables

## Required environment variables

```bash
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Optional environment variables

```bash
SUPABASE_JOIN_TABLE=join_submissions
SUPABASE_CONTENT_BUCKET=content-media
ADMIN_EMAIL_ALLOWLIST=you@example.com
RESEND_API_KEY=...
NOTIFICATION_FROM_EMAIL=WFHS CS Club <notifications@example.com>
JOIN_NOTIFICATION_TO_EMAILS=advisor@example.com,officer@example.com
```

## Bootstrapping content

If you want to seed Supabase from the legacy MDX content in `content/`, run:

```bash
npm run import:content
```

This upserts:

- `content/projects/*.mdx` into `projects`
- `content/events/*.mdx` into `events` or `dev_logs`

The join inbox table is not created by the import script. Create `join_submissions` separately if your Supabase project does not already have it.

Join notification emails are optional and only sent when the Resend-related env vars are configured.

## Admin bootstrap

For local or production bootstrap, add the first officer email to
`ADMIN_EMAIL_ALLOWLIST` or insert it into `admin_allowlist`.

Admin sign-in uses Supabase Auth email/password accounts plus the allowlist:

1. Create the officer in Supabase Auth with an email and password.
2. Add that same email to `ADMIN_EMAIL_ALLOWLIST` or `public.admin_allowlist`.
3. Sign in at `/admin` with that Supabase Auth email and password.

Passwords are managed by Supabase Auth, not stored in the app's `public` tables.
