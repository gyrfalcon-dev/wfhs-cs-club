# WFHS Computer Science Club Website

Official site for the Wake Forest High School Computer Science Club.

The site is built with Next.js App Router and now uses Supabase for:

- public content storage for `projects`, `events`, and `dev_logs`
- admin authentication and allowlisted sign-in
- join form submissions
- image uploads for admin-authored content
- optional join-form email notifications through Resend

Markdown is still the authoring format, but the live content source is Supabase rather than repo-tracked MDX.

## What the App Includes

- Home page with featured projects and upcoming events
- Project index and project detail pages, including collection/group support
- Events and dev-log timeline pages
- Join form with server-side Supabase submission handling
- Supabase-backed admin at `/admin` for projects, events, dev logs, uploads, and join inbox

## Tech Stack

- Next.js 16.2.2
- React 19.2.4
- TypeScript
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- `react-markdown` for public article rendering

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JOIN_TABLE=join_submissions
SUPABASE_CONTENT_BUCKET=content-media
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
ADMIN_EMAILS=you@example.com
RESEND_API_KEY=...
NOTIFICATION_FROM_EMAIL=WFHS CS Club <notifications@example.com>
JOIN_NOTIFICATION_TO_EMAILS=advisor@example.com,officer@example.com
```

You can also copy the defaults from [`.env.example`](./.env.example).

3. Apply the schema in [`supabase/schema.sql`](./supabase/schema.sql) to your Supabase project.

This creates:

- `projects`
- `events`
- `dev_logs`
- the public `content-media` storage bucket

`join_submissions` is still expected to exist as the join inbox table. It is the only table name currently configurable through env.

4. Optional: import the legacy repo content into Supabase:

```bash
npm run import:content
```

5. Start the app:

```bash
npm run dev
```

6. Open:

- Main site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Available Scripts

- `npm run dev` starts the local dev server
- `npm run build` patches telemetry behavior and builds the production bundle
- `npm run start` runs the production server
- `npm run lint` runs ESLint
- `npm run import:content` imports `content/projects` and `content/events` into Supabase

## Content Model

### Projects

Stored in the `projects` table with support for:

- standalone projects
- collection/group projects
- featured projects
- parent-child relationships via `parent_project_id`

### Events

Stored in the `events` table with:

- title
- description
- event date/time
- location
- markdown body
- optional cover image

### Dev Logs

Stored in the `dev_logs` table with:

- title
- description
- publish date/time
- markdown body
- optional cover image

## Admin Notes

- The active admin is implemented in `app/admin`, not Decap CMS.
- Public pages render stored markdown through React components using `react-markdown`.
- Image uploads go to the Supabase storage bucket defined by `SUPABASE_CONTENT_BUCKET`.
- Admin access requires both a valid Supabase user account and an email listed in `ADMIN_EMAILS`.
- Join-form emails are optional and only sent when `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`, and `JOIN_NOTIFICATION_TO_EMAILS` are set.

## Legacy Content Bootstrap

The `content/` directory is still useful as seed data. Run `npm run import:content` to upsert those MDX files into Supabase when bootstrapping a new environment.

After import, ongoing edits should happen through the live admin UI unless you intentionally want to reseed from files.

## Troubleshooting

- If admin pages fail with a missing relation/table error, apply `supabase/schema.sql` to the target Supabase project.
- If sign-in fails before auth initializes, verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- If uploads fail, verify the `content-media` bucket exists or set `SUPABASE_CONTENT_BUCKET` to the bucket you created.
- If join submissions fail, verify the `SUPABASE_JOIN_TABLE` table exists and the service role key is valid.
- If join emails are not arriving, verify the Resend API key, sender domain/address, and recipient list.

## Repository

GitHub: https://github.com/gyrfalcon-dev/wfhs-cs-club
