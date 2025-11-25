# Codebase Summary

::: tip Related Documentation
- [Project Overview & PDR](/project-overview-pdr) - Project goals, scope, and requirements
- [Codebase Structure & Code Standards](/codebase-structure-architecture-code-standards) - Development guidelines and architectural patterns
:::

## Repository Layout

| Directory   | Responsibility                                                  |
| ----------- | --------------------------------------------------------------- |
| `/nextjs`   | The Next.js 14 front-end application.                           |
| `/supabase` | Supabase project configuration and database migrations.         |
| `/docs`     | VitePress documentation site.                                   |
| `/openspec` | Formal process for project specifications and change proposals. |
| `/.github`  | CI/CD workflows and issue/PR templates.                         |
| `/.husky`   | Git hooks for pre-commit checks.                                |

## Technology Stack

- **Framework:** Next.js 16.0.1
- **Backend:** Supabase (CLI version `^2.54.11`)
- **UI:** React 19.2.0
- **Styling:** Tailwind CSS 4.0
- **Language:** TypeScript 5
- **Package Manager:** pnpm 10.18.1
- **Documentation:** VitePress 2.0.0-alpha.12
- **Linting:** ESLint 9
- **CI:** GitHub Actions

## Build & Tooling Pipeline

- **Build:** The root `package.json` contains scripts for the docs site. The `nextjs` app has its own `build` script. There is no top-level build script.
- **Missing:** No unified build command for the entire monorepo. No automated testing pipeline is configured.

## Runtime Architecture

The request flow is standard for a Next.js and Supabase architecture:

1. **Browser:** User interacts with the Next.js application.
2. **Next.js Server:** Renders pages on the server or client-side. API routes in Next.js handle business logic.
3. **Supabase:** The Next.js application uses the Supabase client library to interact with Supabase services.
   - **Auth:** Authentication is handled by Supabase Auth.
   - **Data:** Data is accessed via the auto-generated PostgREST API, with authorization enforced by PostgreSQL Row-Level Security (RLS).

## Data Model Overview

**GAP:** There are currently no database migrations in the `/supabase/migrations` directory. The data model is **UNKNOWN** and needs to be defined.

## Cross-Cutting Concerns

- **AuthN/AuthZ:** Handled by Supabase. See `docs/onboarding-guide/authentication.md` and `docs/onboarding-guide/authorization-rls.md`.
- **Logging:** **UNKNOWN.** No logging framework or strategy is currently implemented.
- **Error Handling:** **UNKNOWN.** No defined error handling or reporting mechanism.
- **Configuration:** Primarily through `.env` files (not checked into git).
- **Secrets Management:** Handled via Supabase project settings and environment variables. **Risk:** High potential for client-side secret leaks if not handled carefully.

## Testing Status

**GAP:** There are no tests in the repository.

- **Recommendation:**
  - **Unit Tests:** Use Vitest or Jest for utility functions and pure logic.
  - **Integration Tests:** Test API routes and their interaction with Supabase.
  - **E2E Tests:** Use Playwright or Cypress for critical user flows.

## Performance Considerations

- **Current Baseline:** The Next.js app is a minimal skeleton, so performance is excellent but not representative.
- **Risk Areas:**
  - Inefficient database queries.
  - Lack of pagination on large datasets.
  - Large bundle sizes as the application grows.
  - See `docs/onboarding-guide/performance-optimization.md`.

## Security Posture

- **Current Controls:**
  - Supabase provides a secure foundation.
  - `commitlint` and `husky` provide some code quality gates.
- **Gaps:**
  - RLS policies are not implemented.
  - No dependency scanning (e.g., `snyk`, `dependabot`).
  - No static analysis security testing (SAST).
  - See `docs/onboarding-guide/security.md`.

## Observability & Monitoring

**GAP:** There is no observability or monitoring solution in place.

- **Minimal Plan:**
  - Integrate a logging service (e.g., Logflare, which integrates well with Vercel and Supabase).
  - Set up basic health checks.
  - See `docs/onboarding-guide/observability-debugging.md`.

## Internationalization/Localization

- The presence of `/docs/vi` indicates that the documentation is multi-language.
- The Next.js application itself has no i18n capabilities implemented. This is a **GAP**.

## Known TODO / FIXME Hotspots

A search for `TODO` or `FIXME` in the codebase yields no results. This is expected given the project's early stage.

## Risk Register

| Risk                    | Impact | Likelihood | Mitigation                                                                    |
| ----------------------- | ------ | ---------- | ----------------------------------------------------------------------------- |
| Undefined Data Model    | High   | High       | Define and implement Supabase migrations immediately.                         |
| No Application CI/CD    | High   | High       | Implement GitHub Actions for linting, testing, and deployment.                |
| Missing RLS Policies    | High   | High       | Implement RLS for all tables as they are created.                             |
| Client-side Secret Leak | High   | Medium     | Strict adherence to environment variable naming conventions (`NEXT_PUBLIC_`). |
| No Testing Strategy     | Medium | High       | Introduce a testing framework and write tests for new features.               |

## Maintenance Guidelines

- All new features must be accompanied by documentation updates.
- Significant changes must go through the OpenSpec proposal process.
- Dependencies should be kept up-to-date.
- Follow the coding standards outlined in `docs/codebase-structure-architecture-code-standards.md`.
