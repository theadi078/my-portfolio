# Personal Portfolio + Admin CMS

A personal professional platform: a public portfolio site plus a private admin
dashboard where every piece of content — projects, experience, internships,
education, skills, certifications, achievements, activities, what you're
currently learning, your journey timeline, your profile and your resume — is
created and edited without touching the source code.

**Stack:** Next.js 15 (App Router) · TypeScript · React 19 · Tailwind CSS ·
MongoDB Atlas (Mongoose) · Cloudinary · JWT session auth (bcrypt + jose) ·
deployable on Vercel's free tier.

---

## Table of contents

1. [What you get](#1-what-you-get)
2. [Requirements](#2-requirements)
3. [Create the MongoDB Atlas database](#3-create-the-mongodb-atlas-database)
4. [Create the Cloudinary account](#4-create-the-cloudinary-account)
5. [Configure environment variables](#5-configure-environment-variables)
6. [Run it locally](#6-run-it-locally)
7. [Create the first admin user](#7-create-the-first-admin-user)
8. [Deploy to Vercel](#8-deploy-to-vercel)
9. [Adding your first project](#9-adding-your-first-project)
10. [Updating the rest of your content](#10-updating-the-rest-of-your-content)
11. [Managing your resume](#11-managing-your-resume)
12. [Optional integrations](#12-optional-integrations)
13. [Project structure](#13-project-structure)
14. [How the content system works](#14-how-the-content-system-works)
15. [Security notes](#15-security-notes)
16. [Extending it later](#16-extending-it-later)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. What you get

### Public pages

| Route | Contents |
| --- | --- |
| `/` | Hero, selected projects, journey timeline, skills, currently learning, highlights, GitHub panel, contact CTA |
| `/about` | Photo, biography, location, current role, interests, goals, editable stats |
| `/projects` | All published projects with live search and category/technology filters |
| `/projects/[slug]` | Full case study: problem, solution, architecture, features, gallery, process, challenges, learnings, links, prev/next |
| `/experience` | Roles, internships and leadership/activities on a timeline |
| `/education` | Degrees, HSC/SSC, diplomas and courses |
| `/certifications` | Credentials with IDs, links and certificate files |
| `/achievements` | Achievements by category |
| `/contact` | Validated contact form (stored in MongoDB) + direct links |
| `/resume` | Inline PDF viewer with view/download buttons |

Plus `sitemap.xml`, `robots.txt`, dynamic Open Graph/Twitter metadata, canonical
URLs, `Person` and `CreativeWork` structured data, a dark-first theme with an
optional light mode, scroll-reveal animations that respect
`prefers-reduced-motion`, and real empty/loading/error states everywhere.

### Admin pages (`/admin/*`, private)

`login` · `dashboard` · `profile` · `projects` · `experience` · `internships` ·
`education` · `skills` · `certifications` · `achievements` · `activities` ·
`learning` · `timeline` · `messages` · `resume` · `settings`

Each content section supports create, read, update, delete, duplicate,
publish/unpublish, mark-as-featured, reorder (via a sort weight), image
uploads with progress and validation, field-level validation errors and
success/error toasts.

---

## 2. Requirements

- **Node.js 18.18 or newer** (20+ recommended) and npm
- A free **MongoDB Atlas** account
- A free **Cloudinary** account (only needed for image/file uploads)
- A **Vercel** account for deployment (optional for local use)

---

## 3. Create the MongoDB Atlas database

1. Sign up at <https://www.mongodb.com/cloud/atlas/register>.
2. **Create a cluster** → choose the **M0 Free** tier → pick the region closest
   to you (and, later, closest to your Vercel region) → Create.
3. **Database Access** → *Add New Database User* → authentication method
   *Password* → choose a username and a generated password → built-in role
   **Read and write to any database** → *Add User*. Copy the password
   somewhere safe; you cannot see it again.
4. **Network Access** → *Add IP Address*. For local development, *Add Current
   IP Address*. Vercel's build and serverless functions do not have fixed IPs,
   so for deployment add `0.0.0.0/0` (allow access from anywhere). Your
   database is still protected by the username and password.
5. **Clusters → Connect → Drivers** → copy the connection string. It looks like:

   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. Replace `<password>` with your real password and **insert a database name**
   before the `?`:

   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

   If your password contains `@ : / ? # [ ] %`, URL-encode it (`@` → `%40`).

Collections are created automatically the first time you save something — you
do not need to create them by hand.

---

## 4. Create the Cloudinary account

1. Sign up at <https://cloudinary.com/users/register_free>.
2. Open the **Dashboard**. You will see **Cloud name**, **API Key** and
   **API Secret** (click to reveal).
3. Copy all three into your environment variables (next section).

Uploads go straight from the admin API route to Cloudinary, so images and PDFs
never live in your Git repository. Files are stored under the folder named in
`CLOUDINARY_FOLDER` (default `portfolio`).

If Cloudinary is not configured, the app still runs — the upload fields simply
report that storage is not configured, and the dashboard shows a setup warning.

---

## 5. Configure environment variables

Copy the template:

```bash
cp .env.example .env.local
```

Then fill it in:

| Variable | Required | What it is |
| --- | --- | --- |
| `MONGODB_URI` | yes | The Atlas connection string from step 3 |
| `AUTH_SECRET` | yes | Long random string used to sign admin sessions |
| `CLOUDINARY_CLOUD_NAME` | for uploads | From the Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | for uploads | From the Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | for uploads | From the Cloudinary dashboard |
| `CLOUDINARY_FOLDER` | no | Folder prefix in your media library (default `portfolio`) |
| `NEXT_PUBLIC_SITE_URL` | recommended | Public base URL, used for canonical links, sitemap and OG images |
| `GITHUB_USERNAME` | no | Enables the live GitHub panel; leave empty for the placeholder state |
| `GITHUB_TOKEN` | no | A classic token with no scopes, only to raise the API rate limit |
| `RESEND_API_KEY`, `CONTACT_NOTIFY_TO`, `CONTACT_NOTIFY_FROM` | no | Emails you a copy of each contact message |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | setup only | Used once by `npm run create-admin` |

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 48
```

`.env.local` is git-ignored. Never commit real credentials, and never put a
secret in a variable prefixed with `NEXT_PUBLIC_` — those are exposed to the
browser.

---

## 6. Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The public site will show professional empty
states until you add content.

Other scripts:

```bash
npm run build     # production build
npm start         # run the production build
npm run lint      # eslint
```

---

## 7. Create the first admin user

There is no public sign-up — that is deliberate. Create your account from the
command line:

1. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (10+ characters) and `ADMIN_NAME` in
   `.env.local`.
2. Run:

   ```bash
   npm run create-admin
   ```

3. Sign in at <http://localhost:3000/admin/login>.

The script hashes the password with bcrypt before storing it; the plain
password is never written to the database. Re-running the script leaves an
existing user alone. To reset a forgotten password, change `ADMIN_PASSWORD` and
run:

```bash
npm run create-admin -- --force
```

Once you have signed in, you can clear `ADMIN_EMAIL` / `ADMIN_PASSWORD` from
`.env.local` — they are only read by that script.

### Optional demo data

```bash
npm run seed            # insert placeholder rows, all prefixed "DEMO — "
npm run seed -- --clear # delete them again
```

Demo rows are inserted **unpublished**, so they never appear on your public
site. They exist only so you can see how a filled-in dashboard looks. Delete
them from the dashboard or with `--clear` once you have real content.

---

## 8. Deploy to Vercel

1. Push the project to a GitHub repository.
2. Go to <https://vercel.com/new>, import the repository. Vercel detects
   Next.js automatically — no build settings to change.
3. Before the first deploy, open **Environment Variables** and add every
   variable from your `.env.local` (except the `ADMIN_*` ones, unless you plan
   to run the admin script from Vercel). Add them for **Production**,
   **Preview** and **Development**.
4. Set `NEXT_PUBLIC_SITE_URL` to your real URL, e.g.
   `https://yourname.vercel.app` (update it again if you attach a custom
   domain, then redeploy).
5. Make sure Atlas **Network Access** allows `0.0.0.0/0` (see step 3.4).
6. Deploy.

**Creating the admin user in production:** the simplest route is to point your
local `.env.local` at the same Atlas cluster and run `npm run create-admin`
locally — it writes to the same database your deployment reads.

**Custom domain:** Vercel → Project → Settings → Domains → add your domain and
follow the DNS instructions, then update `NEXT_PUBLIC_SITE_URL` and redeploy.

---

## 9. Adding your first project

1. Go to `/admin/login` and sign in.
2. **Projects → Add Project**.
3. Fill in the form. The slug is generated from the title (you can edit it) and
   decides the public URL: `/projects/your-slug`.
   - **Basics:** title, slug, one-line summary, category, status, date, technologies
   - **Story:** full description, problem, solution, architecture, features, development process, challenges, what you learned
   - **Media:** thumbnail and gallery images (uploaded to Cloudinary, with alt text)
   - **Links:** GitHub, live demo, video
   - **Publishing:** featured, visible on the public site, sort weight
4. **Save draft** keeps it private; **Publish** makes it live.
5. The public pages are revalidated straight away, so the project appears on
   `/` and `/projects` within a second or two — no redeploy, no code change.

Use **Duplicate** on the projects table to start a new project from an existing
one.

---

## 10. Updating the rest of your content

Everything works the same way — pick a section in the sidebar, then add, edit,
duplicate, publish or delete.

| You want to change | Where |
| --- | --- |
| Name, headline, bio, photo, location, interests, goals, stats (CGPA, projects, technologies, experience), email, social links | **Profile** |
| Jobs and roles | **Experience** |
| Internships | **Internships** |
| Degrees, HSC, SSC, courses | **Education** |
| Skills and their categories/proficiency labels | **Skills** |
| Credentials | **Certifications** |
| Awards, competitions, recognitions | **Achievements** |
| Leadership, clubs, events, volunteering | **Activities** |
| What you're studying right now | **Currently Learning** |
| The "My Journey" timeline on the homepage | **Timeline** |
| Contact form submissions | **Messages** |
| Site title, meta description, keywords, Twitter handle, footer note, contact heading | **Settings** |

Stats on the homepage/about page are free-form label + value pairs, so you can
show exactly what you want (`CGPA — 8.96`, `Projects — 12`, …) and change them
whenever you like.

Every list uses a **sort weight**: higher numbers appear first. Anything with
*Visible on the public site* switched off stays hidden.

---

## 11. Managing your resume

**Admin → Resume**:

- Upload a new PDF (max 10 MB) — stored on Cloudinary, not in the repo
- Mark one version as **active** — that is what `/resume` shows and what the
  hero's *Download Resume* button links to
- Keep older versions for reference, or delete them

If no resume is active, the public page and the download button show a clean
empty state rather than a broken link.

---

## 12. Optional integrations

**GitHub panel.** Set `GITHUB_USERNAME` (and optionally `GITHUB_TOKEN`) and the
homepage panel shows your real public repository/follower/star/language data.
Leave it empty and the panel shows an honest "not connected" placeholder —
there are no invented statistics anywhere in this codebase.

**Contact email notifications.** Messages are always stored in MongoDB and
visible under **Messages**. Add `RESEND_API_KEY`, `CONTACT_NOTIFY_TO` and
`CONTACT_NOTIFY_FROM` (a verified sender on your Resend domain) to also get an
email copy. Without them, the form still works.

---

## 13. Project structure

```
src/
  app/
    (site)/            public pages: home, about, projects, experience,
                       education, certifications, achievements, contact, resume
    admin/
      login/           sign-in page
      (panel)/         dashboard, [collection] CRUD pages, profile,
                       settings, resume — all behind the session check
    api/
      auth/            login, logout, me
      admin/           [collection] CRUD, profile, upload, resume, stats
      contact/         public contact form endpoint
    sitemap.ts, robots.ts
  components/
    ui/                buttons, badges, skeletons, empty states, section headers
    site/              hero, project cards, explorer, gallery, timeline,
                       skills grid, GitHub panel, contact form, header, footer
    admin/             shell/sidebar, data table, generic entity form, field
                       renderer, media uploader, toaster, resume manager
  lib/
    content/registry.ts   ← the single source of truth for all content types
    db.ts auth.ts api.ts cloudinary.ts data.ts admin-data.ts github.ts
    mailer.ts revalidate.ts utils.ts env.ts client-api.ts
  models/              Mongoose models for every collection
  middleware.ts        protects /admin/*
scripts/
  create-admin.ts      first admin user
  seed.ts              optional demo data
```

---

## 14. How the content system works

`src/lib/content/registry.ts` describes each content type once: its Mongoose
model, a Zod validation schema, the form fields (with grouping, help text and
input types), the table columns, the default sort order, and its empty-state
copy.

From that single definition the app derives:

- the REST endpoints at `/api/admin/[collection]`
- the admin list table at `/admin/[collection]`
- the create and edit forms
- validation on both the client and the server

**Adding a new content type is one registry entry plus one model** — no new
routes, no new forms, no duplicated CRUD code.

Public pages use incremental static regeneration (`revalidate = 300`) and every
admin write calls `revalidatePublicSite()`, so edits show up immediately while
normal visitors still get cached, fast pages.

---

## 15. Security notes

- Passwords are hashed with bcrypt (cost 12) and the hash is excluded from
  queries by default.
- Sessions are signed JWTs in an `httpOnly`, `sameSite=lax`, `secure`
  (in production) cookie, valid for 7 days.
- `src/middleware.ts` verifies the session at the edge for every `/admin/*`
  request and redirects unauthenticated visitors to the login page.
- Every admin API route independently calls `requireAdmin()` — the middleware
  is a convenience, not the only gate.
- All writes are validated with Zod before they reach the database; unknown
  fields are stripped.
- Login uses one identical error message for unknown emails and wrong
  passwords, and is rate-limited per IP.
- The contact form is validated, rate-limited and has a honeypot field.
- Uploads are checked for MIME type and size (5 MB images, 10 MB PDFs) before
  reaching Cloudinary.
- `/admin/*` sends `X-Robots-Tag: noindex`; security headers are set in
  `next.config.mjs`.
- Secrets are read server-side only, through `src/lib/env.ts`.

---

## 16. Extending it later

The architecture leaves room for the obvious next features:

- **Blog / articles** — add a model plus one registry entry and you get the
  admin CRUD for free; add a public route to render it.
- **Testimonials** — same pattern.
- **Analytics / visitor counter** — drop in Vercel Analytics, or add an API
  route that records page views.
- **Newsletter** — a new collection plus a public subscribe endpoint.
- **Multi-language** — content fields are plain documents, so a `locale` field
  and a `[locale]` route segment are the natural extension.

---

## 17. Troubleshooting

**"MONGODB_URI is not set"** — create `.env.local` from `.env.example` and
restart `npm run dev`. Environment changes are not hot-reloaded.

**Login fails with a server error** — `AUTH_SECRET` is missing or was changed
(changing it invalidates existing sessions; sign in again).

**Cannot connect to Atlas / server selection timed out** — your current IP is
not in Network Access, or the password in the URI is not URL-encoded, or the
database name is missing before the `?`.

**Uploads say storage is not configured** — one of the three Cloudinary
variables is missing. The dashboard shows which integrations are connected
under **Settings**.

**Images do not render** — remote images must come from Cloudinary; the allowed
hosts are set in `next.config.mjs` under `images.remotePatterns`.

**A published change is not visible** — hard-refresh; public pages are cached
for 5 minutes but every admin write triggers a revalidation. On Vercel, check
the function logs if it persists.

**GitHub panel shows the placeholder** — `GITHUB_USERNAME` is empty, or the
unauthenticated rate limit was hit; add `GITHUB_TOKEN`.
