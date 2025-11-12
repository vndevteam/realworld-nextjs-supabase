# Supabase + Next.js Onboarding Guide

Documentation goals:

> - Help new developers understand Supabase quickly and build an MVP in a few days.
> - Establish internal standards to scale the dev team, easily onboard new members, or compare effort with traditional backends.
> - Provide a foundation for future best practices (batch jobs, auth, RLS, CI/CD, etc.).

## 🏁 Part 0. Introduction & Overview

1. **Documentation goals**

   - Training objectives (learning outcomes)
   - Target audience (frontend, fullstack, backend devs, interns, etc.)
   - How to read the documentation: by week / by module

2. **Supabase + Next.js architecture overview**

   - Diagram: Next.js (App Router) ↔ Supabase (DB + Auth + Storage + Functions)
   - Explanation of main components:

     - Database (Postgres)
     - Auth
     - Storage
     - Edge Functions
     - Cron & Queue
     - Realtime

   - Quick comparison with traditional backend (NestJS, Express, Postgres, S3, etc.)

3. **Case study throughout (Sample App)**

   - Introduction to sample app (e.g., "Subscription Manager")
   - Features to implement: Auth, CRUD, Batch Job, Upload, Cron
   - Directory structure, learning flow by module

## 🧱 Part 1. Setup & Environment Preparation

1. **Tool installation**

   - Node.js / pnpm / npm
   - Supabase CLI (`supabase login`, `supabase start`, …)
   - VSCode plugins (SQLTools, Supabase, etc.)

2. **Project initialization**

   - `npx create-next-app`
   - `npx supabase init`
   - Configure `.env` (Supabase URL, Anon Key)
   - Test connection with Supabase SDK

3. **Run Supabase locally**

   - `supabase start`, access [http://localhost:54323](http://localhost:54323)
   - Create user, test Auth
   - Simulate complete local dev environment

4. **Recommended directory structure**

   - `/app` – Next.js App Router
   - `/lib` – Supabase client, hooks
   - `/supabase` – migrations, policies, seeds
   - `/scripts` – batch jobs, automation

## 🔐 Part 2. Authentication

1. **Supabase Auth architecture**

   - Explanation of JWT mechanism, `auth.uid()`
   - Anon key vs Service role key
   - Sign in/out flow

2. **Implement Auth with Next.js**

   - `@supabase/supabase-js` & `@supabase/ssr`
   - Create Supabase client for:

     - Client-side (browser)
     - Server-side (SSR)

   - Middleware to protect routes (`middleware.ts`)

3. **Login types**

   - Email/password
   - Magic link
   - OAuth (Google, GitHub)
   - OTP (SMS/Email OTP if needed)

4. **Session management**

   - Store session in cookie (server component)
   - Refresh token
   - Logout / Revalidate session

5. **Customize Auth**

   - Custom user metadata
   - Hooks `auth.users` → `profile` table sync
   - Best practice: sync user profile using trigger or Edge Function

## 🔑 Part 3. Authorization (RLS & Policy)

1. **Introduction to RLS (Row-Level Security)**

   - What RLS is and why Supabase is "secure by default"
   - Configure RLS on table

2. **Write basic policies**

   - SELECT / INSERT / UPDATE / DELETE
   - Using `auth.uid()`
   - Example: "User can only view their own tasks"

3. **Organize Roles & Permissions**

   - Map roles to JWT claims
   - Multi-tenant design: `organization_id`
   - Admin / Owner / Member policies

4. **Best Practices**

   - "Always RLS On"
   - Test policies before coding (SQL playground)
   - Convention for writing policy.sql / migration.sql files

## 💾 Part 4. Database & Migrations

1. **Schema design**

   - Example tables: `users`, `organizations`, `memberships`, `tasks`
   - Using enums, indexes, constraints
   - Naming conventions

2. **Migrations with Supabase CLI**

   - `supabase db push`
   - `supabase migration new add_tasks_table`
   - Manage migration files, version control

3. **Seeding & sample data**

   - `supabase db seed`
   - Scripts to create data for dev/test environments

4. **Query & Performance**

   - RPC functions
   - Caching (Next.js revalidate tag)
   - Use `explain analyze` to check queries

## 🌐 Part 5. Supabase + Next.js Integration

1. **Next.js App Router with Supabase**

   - How to call Supabase from server components
   - Use Server Actions for CRUD
   - Protect routes (redirect if not logged in)

2. **Realtime Subscription**

   - Realtime setup (`supabase.channel`)
   - Update UI when DB changes
   - Example: Realtime task board

3. **Storage (Upload & Access Control)**

   - Create bucket, configure policies
   - Upload files, get signed URLs
   - Security: users can only view their own files

4. **Edge Functions**

   - When to use them
   - Write Edge Functions (`supabase functions new send-email`)
   - Test and deploy Edge Functions
   - Call Edge Functions from Next.js (client/server)

## ⏰ Part 6. Batch Job & Background Tasks

1. **Batch jobs with pg_cron**

   - Install `pg_cron` extension
   - Create scheduled jobs (cleanup, sync, aggregate)
   - Best practices for cron in DB

2. **Edge Function + Cron Scheduler**

   - Create Edge Function and register Cron job
   - Use case: send email reminders

3. **Queues (pgmq)**

   - Install pgmq extension
   - Push / Consume jobs
   - Pattern: async processing in Supabase

4. **Compare Cron vs Queue**

   - Cron → scheduled
   - Queue → event-driven

5. **Monitor jobs**

   - Logs in Supabase dashboard
   - Retry / failure tracking

## 🧩 Part 7. API & Integration Patterns

1. **Direct Query vs API Proxy**

   - When FE calls Supabase directly
   - When to use an intermediate API layer (Route Handler / Function)

2. **Webhooks**

   - Create DB trigger → call Edge Function
   - Example: when user registers → send welcome email

3. **Third-party integrations**

   - Stripe / GitHub / Slack webhooks
   - Best practice: store audit logs

## ⚙️ Part 8. CI/CD & DevOps

1. **Supabase CLI in pipeline**

   - Login with token
   - Run migrations, tests, deploy functions
   - Example GitHub Actions YAML

2. **Environment management**

   - Dev / Staging / Prod setup
   - Env key & secrets conventions
   - Sync schema between environments

3. **Deploy Next.js**

   - Vercel / Cloudflare / Render
   - Connect to Supabase project
   - Zero-downtime deployment

4. **Testing**

   - Unit test Next.js logic
   - Integration test with Supabase local
   - Mock Supabase in Jest

## 🔍 Part 9. Observability & Debugging

1. **Logs**

   - Database logs
   - Edge Function logs
   - Cron / Queue logs

2. **Request tracing**

   - Attach `request_id` throughout
   - Error tracking

3. **Monitoring**

   - Alert email / Slack when jobs fail
   - Basic metrics (API latency, job duration, etc.)

## 🔒 Part 10. Security Best Practices

1. **API keys & secrets**

   - Manage Anon key / Service role key
   - Never expose service key to client

2. **RLS mandatory**

   - RLS checklist when creating new tables
   - How to quickly test policies

3. **Rate limiting & abuse**

   - Use Edge Function middleware
   - Logging and spam detection

## 💰 Part 11. Cost & Performance Optimization

1. **Cost optimization**

   - Configure appropriate Supabase plan
   - Use Storage & Realtime efficiently

2. **Performance optimization**

   - Index / query tuning
   - Cache layer in Next.js
   - When to move logic to Edge Functions

3. **Benchmark**

   - Compare CRUD performance: Supabase vs traditional API backend

## 📊 Part 12. Comparison with Traditional Tech Stack

| Category            | Supabase + Next.js      | Traditional Backend   |
| ------------------- | ----------------------- | --------------------- |
| Auth                | Built-in                | Must code + DB        |
| Storage             | Built-in                | Self-configure S3     |
| Cron / Batch        | pg_cron / Edge Function | Bull / Cloud Tasks    |
| Queue               | pgmq                    | Redis / SQS           |
| Realtime            | Built-in                | WebSocket / Socket.IO |
| DevOps              | CLI + Dashboard         | Self-setup infra      |
| Initial cost        | Very low                | Medium – high         |
| Large-scale scaling | Vendor limits           | Full control          |

## 🧠 Part 13. Appendix (Advanced)

1. **Multi-project / Monorepo**

   - Integrate multiple Supabase projects
   - Separate environments

2. **Custom Postgres extensions**

   - Use `pgvector`, `postgis`, `citext`, `pg_partman`

3. **Analytics & AI integration**

   - Use Supabase Vector
   - Query embedding / RAG pattern

4. **Troubleshooting**

   - Common errors (RLS deny, token expired, etc.)
   - Debug checklist

## 📎 Part 14. References

- Supabase Docs (database, auth, cron, queue, cli, function)
- Next.js App Router Docs
- Example repo (Supabase + Next.js Starter)
- Internal:

  - `supabase_onboarding.md`
  - `supabase_best_practices.sql`
  - `github-actions-supabase.yml`
