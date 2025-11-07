# Project Context

## Purpose

RealWorld implementation (Conduit clone) built with Next.js and Supabase. The goal is to deliver the canonical RealWorld feature set (authentication, profiles, articles, tags, favorites, comments) with clean, modern stack choices and spec-driven changes via OpenSpec.

Training-first orientation: this repo also serves as a Supabase + Next.js starter and internal training reference aligned to a phased roadmap (Fundamentals → Integration → Background Jobs → DevOps/CI/CD). All capabilities and conventions below reflect that roadmap.

## Tech Stack

### Core Technologies

- Next.js 16 (App Router)
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS v4 (via `@tailwindcss/postcss` + PostCSS)
- pnpm (workspace package manager)
- Supabase (Auth, Postgres, Storage, Realtime)

### Development Tools

- ESLint 9 with `eslint-config-next` (Core Web Vitals + TypeScript)
- Husky (Git hooks)
- Commitlint (Conventional Commits)
- VitePress (Documentation site)
- Supabase CLI (Local development and deployment)

### Optional/Advanced

- Supabase Cron (`pg_cron`) and Scheduled Edge Functions
- Supabase Queues (pgmq)

## Project Conventions

### Code Style

- TypeScript strict mode enabled; prefer explicit types on exports and public APIs
- React Server Components by default; opt in to Client Components only when required (`"use client"`)
- Utility-first styling with Tailwind CSS; co-locate small style tweaks in `globals.css` theme tokens
- Naming
  - Functions: verb/verb-phrase (`getUserProfile`, `createArticle`)
  - Components: PascalCase (`ArticleList`, `ProfileCard`)
  - Files: kebab-case for modules (`article-service.ts`), PascalCase for React components (`ArticleList.tsx`)
- Imports use path alias `@/*` as configured in `tsconfig.json`
- Linting: follow `eslint-config-next` rules; fix autofixable issues before commit

### Architecture Patterns

- Next.js App Router structure under `app/` for routing, layouts, and metadata
- Server-first data fetching; prefer server actions and RSC where possible
- Client components limited to interactive UI states (forms, toasts, modals)
- Tailwind design tokens via CSS variables in `:root` with dark mode via `prefers-color-scheme`
- Supabase as Backend-as-a-Service for auth and data; API access via server utilities and limited client usage when necessary (e.g., client auth state)
- Clear separation of Supabase clients: server-side client for SSR/server actions; client-side only when interactive auth state or realtime is required
- Route protection at server layer (RSC/middleware) using Supabase session; do not rely solely on client checks
- Row-Level Security (RLS) as the primary authorization mechanism; encode multi-tenant access control in PostgreSQL policies
- Keep features modular by domain (auth, articles, profiles) and avoid cross-domain coupling

### Testing Strategy

- Unit tests for utilities and server actions (Vitest or Jest; TBD)
- Component tests for critical UI (React Testing Library; TBD)
- E2E happy paths for RealWorld flows (Playwright; TBD)
- CI runs lint + type-check + tests on PRs to `main`
- For DB/RLS: prefer pgTAP (optional) and Supabase CLI local runs in CI

### Git Workflow

- Default branch: `main`
- Branching model: feature branches `feat/<topic>`, fix branches `fix/<topic>`
- Pull Requests required for merges; require passing CI
- Commit style: Conventional Commits (e.g., `feat: add article editor`, `fix: correct tag filter`)

## Domain Context

- RealWorld spec capabilities:
  - User auth (register, login, JWT/session), settings, and profiles
  - Articles (CRUD), comments, favorites, and tags
  - Global feed, personal feed, tag filtering, pagination

Supabase-oriented capabilities (training roadmap):

- Authentication flows via Supabase Auth; SSR session injection
- Authorization via RLS policies (per-user and multi-tenant org scoping)
- Realtime updates for selected domains
- Storage with signed URLs (avoid public raw access)
- Batch jobs via Cron/Edge Functions; Queues for heavy async
- CI/CD using Supabase CLI in GitHub Actions and Next.js deploy
- URL patterns typically follow `/`, `/login`, `/register`, `/settings`, `/editor`, `/article/[slug]`, `/profile/[username]`

Note: Exact routing and data models will be aligned with the RealWorld spec during implementation changes.

## Project Structure

```text
realworld-nextjs-supabase/
├── nextjs/                 # Next.js application
│   ├── app/                # App Router pages and layouts
│   ├── public/             # Static assets
│   └── package.json
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   ├── functions/          # Edge Functions
│   └── config.toml         # Supabase config
├── docs/                   # Documentation site
│   ├── onboarding-guide/   # Training documentation
│   └── .vitepress/         # VitePress config
├── openspec/               # OpenSpec change management
│   ├── specs/              # Project specifications
│   └── changes/            # Change proposals
└── package.json            # Root workspace config
```

## Important Constraints

- Server-first design: avoid unnecessary client-side fetching
- Supabase free-tier limits may apply (rate limits, connection caps)
- Keep implementation simple (<100 lines per change when possible) per OpenSpec best practices
- Accessibility: aim for keyboard navigation and sufficient contrast
- Performance: Core Web Vitals friendly (Next.js defaults, image optimization)
- Security: never expose service role key in frontend; keep environment hygiene across dev/stg/prod

## External Dependencies

- Supabase: Authentication, Postgres database, Storage, Realtime
- Vercel (optional): Hosting and Edge/CDN for Next.js app
- Next Fonts (Google fonts `Geist`, `Geist_Mono`)

### Supabase Configuration/Conventions

- Use `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` in frontend only
- Service role key limited to server/Edge Functions/CI
- Treat Supabase config and migrations as code managed by Supabase CLI
- Environment variables: Supabase URL and anon/public keys for client-side usage; service role keys only on server
- Next.js runtime settings in `next.config.ts` (currently defaults)

## Documentation

Comprehensive documentation is available in the `docs/` directory, covering:

- Introduction - Overview of Supabase and the stack
- Setup - Environment preparation and project creation
- Authentication - User auth flows and SSR session handling
- Authorization - Row-Level Security (RLS) policies
- Integration - Supabase + Next.js integration patterns
- Advanced - Edge Functions, Cron, Queues
- Performance - Optimization strategies
- Security - Best practices and guidelines
- CI/CD - Deployment and DevOps
- Observability - Debugging and monitoring

View documentation locally: `pnpm docs:dev` (from project root)
