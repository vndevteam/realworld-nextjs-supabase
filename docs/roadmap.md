# Roadmap

## 1. Supabase + Next.js Adoption Path

We assume you already know Next.js, Postgres, and a traditional backend stack.

### Phase 0 - Define scope & sample project (0.5 day)

- Pick **one mini-product** that will be reused throughout your study plan, for example:
  - "Mini SaaS for managing subscriptions"
  - or "Multi-tenant todo app (many companies, each with many users)"
- The example should include:
  - Auth (email/password + OAuth)
  - Multi-tenant / RLS
  - A few background jobs (reminders, cleanup, sync,...)
  - File upload (avatar, documents)
- Ground rule: every Supabase/Next.js topic points back to this example.

> Output: A README for the sample app so you can quickly revisit the full context later.

### Phase 1 - Supabase Fundamentals (1-2 days)

Goal: understand Supabase as "Postgres + Auth + Realtime + Storage + Edge Functions" instead of a black-box BaaS.

1. **Create a project & explore the console**
   - Follow the "Getting Started" and Next.js quickstart guides. ([Supabase][1])
   - Walk through the main tabs: Database, Auth, Storage, Functions, Cron/Integrations, Logs.
2. **Database & SQL**
   - Design the schema for the sample app (users, organizations, memberships, tasks/subscriptions,...).
   - Practice migrations (SQL scripts) from both the Supabase Dashboard and Supabase CLI. ([Supabase][2])
3. **Auth basics**
   - Email/password, magic link, OAuth (Google/GitHub). ([Supabase][3])
   - Concepts: **anon key** vs **service role key**, JWT, custom claims.
4. **Row-Level Security (RLS)**
   - Enable RLS and write basic policies with `auth.uid()`.
   - Policy examples:
     - users can only see data from their organization
     - organization admins can see everything within the org

> Output:
>
> - Personal notes: "Supabase Overview" (components + architecture diagram).
> - A baseline SQL migration file (later reused in CI/CD).

### Phase 2 - Supabase + Next.js Integration (1-3 days)

Goal: become fluent with **App Router + Server Components + Supabase**.

1. **Client setup & SSR**
   - Follow "Use Supabase Auth with Next.js" + "Server-side auth for Next.js":
     - `@supabase/supabase-js` + `@supabase/ssr` ([Supabase][3])
     - Separate **client-side** and **server-side** Supabase clients
     - Use middleware / server actions to inject the session
2. **End-to-end auth flow**
   - Sign up / sign in / logout
   - Protected routes: server components check session and redirect if unauthenticated
   - Fetch user profile + metadata from DB and display it
3. **CRUD + RLS flow**
   - Build task/subscription CRUD via:
     - Server Actions calling Supabase
     - or Route Handlers (`app/api/...`) as a proxy layer
   - Intentionally break RLS policies so new devs "feel" the security model
4. **Realtime & UI**
   - Use Supabase Realtime to update UI live (e.g., task board). ([Supabase][4])

> Output:
>
> - A "Supabase + Next.js Starter" repo you can extend.
> - Notes for "Coding convention: how to call Supabase from Next.js (server/client)".

### Phase 3 - Batch jobs, background work & advanced features (2-4 days)

Goal: answer classic backend questions using the Supabase toolbox.

1. **Batch jobs / Cron** - two primary options:
   - **Postgres Cron (Supabase Cron + pg_cron)**
     - Use Supabase Cron + `pg_cron` to schedule SQL/PLpgSQL jobs. ([Supabase][5])
     - Use cases: cleanup records, aggregate data, sync statuses,...
   - **Scheduled Edge Functions**
     - Supabase supports `pg_cron` + `pg_net` to invoke Edge Functions on a schedule (e.g., every 5 minutes). ([Supabase][6])
     - Use cases: call external APIs, send email, sync queues,...
   - Practice guidelines:
     - "If the job is pure DB work -> prefer Cron + SQL"
     - "If the job needs external HTTP / complex logic -> Edge Function + Cron scheduler"
2. **Queues & async processing**
   - Learn Supabase **Queues** (pgmq) for background processing. ([Supabase][7])
   - Use case: heavy jobs (bulk email, big sync) -> push to queue, worker (Edge Function / external worker) consumes.
3. **Storage & file handling**
   - Upload avatars / documents.
   - Best practices: RLS + signed URLs instead of public buckets.
4. **Webhooks & event-driven workflows**
   - Use **Database Webhooks / Trigger -> Edge Functions** to react to events (record inserted/updated -> send mail, log, sync).

> Output:
>
> - Notes: "Batch job & Background processing with Supabase".
> - 1-2 concrete examples:
>   - Nightly cron cleanup
>   - Edge Function + Cron for reminder emails

### Phase 4 - DevOps, CI/CD & environments (2-3 days)

Goal: master **Supabase CLI, migrations, testing, deployment**.

1. **Supabase CLI**
   - Install, `supabase init`, `supabase start` (local), `supabase db push`,... ([Supabase][8])
   - Treat Supabase config + migrations as **config-as-code**. ([Supabase][9])
2. **CI/CD with GitHub Actions**
   - Use the **Supabase CLI Action** to run migrations/tests in pipelines. ([GitHub][10])
   - Sample pipeline:
     - Lint + test Next.js
     - Run Supabase tests (pgTAP if available)
     - Apply migrations to staging/production
     - Deploy Edge Functions (if used) ([Supabase][11])
3. **Deploying Next.js (Vercel, Cloudflare,...)**
   - Provide env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Never ship the service role key to FE; only backend/Edge Functions/CI may access it

> Output:
>
> - Doc: "CI/CD for Supabase + Next.js" with a sample GitHub Actions YAML.
> - Environment creation checklist (dev/stg/prod).

## 2. Supabase + Next.js vs Traditional Backend

Assume "traditional" = NestJS/Express + Postgres on AWS/GCP where you manage auth, storage, cron, etc.

### 2.1 Implementation effort

#### Supabase + Next.js

- Auth, user table, JWT, password reset, magic link: built-in. ([Supabase][3])
- Realtime, Storage, RLS, Cron, Queues: enabled via config/SQL with minimal code. ([Supabase][4])
- Most of your work:
  - Schema & RLS (SQL)
  - UI + limited glue code (Next.js server/client)
  - Edge Functions for special logic

#### Traditional backend (implementation)

- You must pick/integrate each subsystem:
  - Auth (JWT, OAuth providers, session management)
  - Job scheduler (BullMQ, cron, Cloud Tasks, EventBridge,...)
  - Queues (SQS, RabbitMQ, Kafka,...)
  - Storage (S3 + signed URLs)
- Higher initial effort but:
  - More flexibility for large systems, complex domains, microservices

#### Bottom line for internal docs

- **Supabase wins** for MVP speed, onboarding devs, and reducing backend boilerplate.
- **Traditional backend wins** when:
  - Domain is complex, needs long-running computation, or deep integration with internal/on-prem systems
  - You require full infra control / multi-region / vendor neutrality

### 2.2 DevOps & operations

#### Supabase

- DB, auth, storage, cron, queue, functions are **managed**; Supabase handles scale, backups, observability. ([Supabase][2])
- DevOps focuses on:
  - Migrations + versioning
  - CI/CD for Edge Functions + schema + tests
  - Monitoring logs/traces in the Supabase UI
- Minimal infra yak-shaving (no RDS/SQS/ECS configs)

#### Traditional backend (operations)

- You manage:
  - Provisioning DB (RDS/Cloud SQL), networking, security groups/VPC
  - Job runners, message queues, file storage
  - Observability stack: Prometheus/Grafana/Loki/Tempo, log shipping,...
- More effort but:
  - Full control to tune performance & cost

## 3. Best-practice documentation & problems to cover

Structure your self-study notes with sections such as:

### 3.1 Suggested table of contents

1. **Overview**
   - When to choose Supabase vs a traditional backend
   - Architecture diagram for Supabase + Next.js
2. **Project Setup & Environment**
   - Repo layout (monorepo? FE + infra?)
   - `.env` conventions, service role key handling
   - Multi-environment pattern (dev/stg/prod)
3. **Authentication**
   - Email/password, magic link, OTP, OAuth
   - Auth flows in Next.js (App Router, middleware, server components) ([Supabase][12])
   - Session management & refresh tokens
4. **Authorization (RLS & roles)**
   - Map roles (admin/user/mod) into JWT claims
   - Multi-tenant pattern:
     - `organization_id` attached to users + data
     - RLS policy "user only sees their own org"
   - Rules:
     - "Always use RLS; don't rely solely on Next.js code"
5. **Database Design & Migrations**
   - Naming conventions for schema, tables, indexes, enums
   - Authors migrations (SQL) and apply them via CLI/CI
   - Seed data for dev/test
6. **Batch Jobs / Scheduled Tasks**
   - When to use:
     - **Supabase Cron + SQL** (`pg_cron`)
     - **Cron -> Edge Function**
     - **Queues (pgmq)** for long/heavy jobs ([Supabase][5])
   - Reference examples:
     - Daily cleanup of soft-deleted records
     - Send reminder email 3 days before expiry
     - Sync data to another system
7. **API & Integration**
   - When to call Supabase directly from the client
   - When a proxy layer (Next.js Route Handlers / external backend) is needed
   - Webhooks / event-driven patterns (trigger -> Edge Function)
8. **Storage & File Handling**
   - Bucket-per-domain convention (avatars, documents, logs,...)
   - Use signed URLs, never expose raw public files unless necessary
   - Map DB records to file paths
9. **CI/CD & Testing**
   - Standard pipeline for Supabase + Next.js repo:
     - Lint & unit tests
     - Supabase migration/tests (pgTAP) ([Supabase][13])
     - Deploy Edge Functions / apply DB migrations
     - Deploy FE (Vercel/Cloudflare)
   - Testing strategy:
     - Unit tests (Next.js + Edge Functions)
     - Integration tests with local Supabase (CLI)
10. **Observability & Debugging**
    - Use Supabase logs (DB, Edge Functions, Cron). ([Supabase][5])
    - Request tracing pattern: propagate `request_id`
11. **Security & Compliance**
    - Protect the service role key
    - Mandatory RLS policies
    - Rate limiting / abuse protection (Edge Functions / middleware)
12. **Performance & Cost**
    - Indexing & query optimization (still Postgres)
    - Reduce round-trips (prefer RPC/Edge Functions for heavy logic)
    - Guidance on splitting projects/environments to optimize cost

### 3.2 Traditional problems worth implementing both ways

Recommended scenarios to build twice (Supabase + Next.js vs traditional backend) to compare effort:

1. **User onboarding & multi-tenancy**
2. **Billing-like flow** (subscription, expiration, reminders)
3. **Batch jobs for reminders, cleanup, reporting**
4. **File upload & access control**
5. **Third-party webhooks** (Stripe, GitHub,...)
6. **Internal admin panel** (RBAC + audit log)

For each scenario, keep a small comparison table:

- Column 1: what you would implement in a traditional backend (NestJS + RDS + S3 + cron)
- Column 2: what you configure/build with Supabase (which features, which config, roughly how much code)
  => After several examples, you'll have an **"Effort Comparison"** that highlights the trade-offs for your own reference.

[1]: https://supabase.com/docs/guides/getting-started "Getting Started | Supabase Docs"
[2]: https://supabase.com/docs "Supabase Docs"
[3]: https://supabase.com/docs/guides/auth/quickstarts/nextjs "Use Supabase Auth with Next.js"
[4]: https://supabase.com/docs/guides/realtime/getting_started "Getting Started with Realtime | Supabase Docs"
[5]: https://supabase.com/docs/guides/cron "Cron | Supabase Docs"
[6]: https://supabase.com/docs/guides/functions/schedule-functions "Scheduling Edge Functions | Supabase Docs"
[7]: https://supabase.com/docs/guides/queues/quickstart "Quickstart | Supabase Docs"
[8]: https://supabase.com/docs/reference/cli/introduction "CLI Reference | Supabase Docs"
[9]: https://supabase.com/blog/cli-v2-config-as-code "Supabase CLI v2: Config as Code"
[10]: https://github.com/marketplace/actions/supabase-cli-action "Supabase CLI Action - GitHub Marketplace"
[11]: https://supabase.com/docs/guides/functions/examples/github-actions "GitHub Actions | Supabase Docs"
[12]: https://supabase.com/docs/guides/auth/server-side/nextjs "Setting up Server-Side Auth for Next.js"
[13]: https://supabase.com/docs/guides/deployment/ci/testing "Automated testing using GitHub Actions | Supabase Docs"
