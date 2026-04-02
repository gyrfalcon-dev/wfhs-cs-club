# WFHS Computer Science Club Website

Official site for the Wake Forest High School Computer Science Club.

The site is built with Next.js (App Router) and uses MDX content files for projects and events, so most updates can be made without changing React components.

## What This Site Includes

### Core Pages

- Home page with hero, stats, featured projects, and upcoming events
- About page with leadership and advisor section
- Projects index with card previews, collection/group support, and nested project routing
- Project detail pages at dynamic routes
- Events and dev-log timeline page
- Join page with form submission API route
- Sponsored page with placeholder sponsor sections

### Content System

- File-based content under content/projects and content/events
- Frontmatter parsing with gray-matter
- Support for:
  - standalone projects
  - collection/group projects with children
  - featured projects
  - event/devlog splitting

### Hidden Editor (CMS)

- Hidden admin editor available at /admin
- Decap CMS config in public/admin/config.yml
- GitHub-backed content editing
- Media upload path configured to public/uploads

## Tech Stack

- Next.js 16.2.2
- React 19.2.4
- TypeScript
- Tailwind CSS v4 (plus custom global CSS)
- gray-matter for frontmatter parsing

## Project Structure

```text
app/
	api/join/route.ts         # Join form API endpoint
	compilers/page.tsx        # About page
	join/page.tsx             # Join form page
	projects/page.tsx         # Projects index page
	projects/[slug]/page.tsx  # Project detail page
	sponsored/page.tsx        # Sponsor placeholder page
	terminal/page.tsx         # Events + dev logs page
	globals.css               # Global styles and theme
	layout.tsx                # Nav, footer, metadata
	page.tsx                  # Home page

content/
	projects/*.mdx            # Project entries
	events/*.mdx              # Event + devlog entries

lib/
	content.ts                # Content loading, parsing, and selectors

public/
	admin/                    # Decap CMS shell + config
	uploads/                  # CMS uploaded assets
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

- Main site: http://localhost:3000
- Hidden editor: http://localhost:3000/admin

## Available Scripts

- npm run dev: start local dev server
- npm run build: patch telemetry behavior, then build production bundle
- npm run start: run production server from built output
- npm run lint: run ESLint

## Content Authoring Guide

### Add a Project

Create a file in content/projects with .mdx extension and frontmatter like:

```md
---
title: "Example Project"
summary: "One-line project summary"
status: "active"
projectType: "project"
stack:
	- TypeScript
	- Next.js
cover: "/uploads/example-cover.png"
featured: false
---

Longer project description goes here.
```

### Create a Project Collection

Use projectType: group and add children slugs:

```md
---
title: "Scratch Collection"
summary: "Collection of beginner Scratch games"
status: "active"
projectType: "group"
children:
	- scratch-maze-escape
	- scratch-puzzle-lab
---
```

### Add an Event or Dev Log

Create a file in content/events:

```md
---
title: "Spring Hack Night"
date: "2026-05-14"
description: "Build night with demos and feedback"
kind: "event"
location: "WFHS Lab C204"
---

Optional longer details here.
```

Set kind: devlog to show it in the dev-log section.

## Navigation and Routing Notes

- Top nav links are defined in app/layout.tsx
- Sponsored tab points to /sponsored
- Hidden admin link is intentionally not shown in the top nav
- /admin is handled by rewrites in next.config.ts and serves public/admin/index.html

## Deployment Notes

- The repo currently tracks master as the primary working branch
- Local branch workflows are used for feature development
- If using the CMS in production, ensure GitHub authentication is configured for your hosting environment

## Maintenance Tips

- Keep project slugs stable because collection children reference them
- Prefer short, clear summaries so cards stay readable
- Use uploaded local images (/uploads/...) instead of temporary external URLs when possible
- Validate new content frontmatter keys against lib/content.ts types

## Contributing Workflow

1. Create a branch from master
2. Make changes
3. Run lint/build checks as needed
4. Commit with descriptive message
5. Merge back into master

## Repository

GitHub: https://github.com/gyrfalcon-dev/wfhs-cs-club
