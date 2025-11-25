# Project Overview & PDR

::: tip Related Documentation
- [Codebase Summary](/codebase-summary) - High-level overview of repository structure and technologies
- [Codebase Structure & Code Standards](/codebase-structure-architecture-code-standards) - Development guidelines and architectural patterns
:::

## Executive Summary

This repository contains the source code for a "RealWorld" example application built with Next.js and Supabase. The primary goal is to provide a practical, real-world template for developers to learn and build upon, demonstrating a modern, full-stack, serverless architecture. It deliberately does NOT solve for large-scale enterprise features like multi-tenancy, complex user role management beyond basic RLS, or advanced analytics, focusing instead on a solid foundation for a typical SaaS application.

## Core Value Proposition

- **For Users:** A functional, performant, and reliable "Medium.com" clone that adheres to the RealWorld specification.
- **For Dev Team:** A well-documented, maintainable, and extensible monorepo that serves as a golden path for building future applications. It prioritizes developer experience, rapid iteration, and low operational overhead.

## Scope

### In-Scope

- User authentication (signup, login)
- Article management (create, read, update, delete)
- Commenting on articles
- User profiles
- Tagging and filtering articles
- Following users
- A complete documentation site explaining the architecture and onboarding process.

### Out-of-Scope

- Real-time collaboration features
- Advanced content moderation tools
- Social media integrations beyond basic profile links
- Monetization or subscription models
- In-app notifications (for now)

## Functional Overview

The project currently implements a basic Next.js application shell and a Supabase backend.

- **Next.js App (`/nextjs`):** A minimal Next.js 14 app with a basic layout and page. No RealWorld features are implemented yet.
- **Supabase Backend (`/supabase`):** Contains a `config.toml` file, but no database migrations are present. This indicates the data model is not yet defined.
- **Documentation (`/docs`):** A comprehensive, multi-language (English and Vietnamese) documentation site built with VitePress. It includes an extensive `onboarding-guide`.

## Non-Functional Requirements

- **Security:** **(Partial)** Supabase provides a solid foundation with RLS, but it's not yet implemented. Client-side secret exposure is a major risk to mitigate. See `docs/onboarding-guide/security.md`.
- **Reliability:** **(Fail)** No health checks, monitoring, or alerting is in place. The application's reliability is currently UNKNOWN.
- **Performance:** **(Fail)** No performance benchmarks exist. The Next.js app is minimal and thus fast, but data access patterns and database queries are not defined or optimized. See `docs/onboarding-guide/performance-optimization.md`.
- **Scalability:** **(Partial)** Supabase provides good vertical scalability, but the application architecture has not been designed or tested for horizontal scaling.
- **Maintainability:** **(Pass)** The monorepo structure, documentation, and use of modern tooling provide a strong foundation for maintainability.

## Architecture Summary

The architecture consists of three main components within a `pnpm` workspace monorepo:

- **Next.js Frontend (`/nextjs`):** A server-side rendered React application responsible for the user interface and user experience. It interacts with the Supabase backend for data and authentication.
- **Supabase Backend (`/supabase`):** Provides the database, authentication, and auto-generated APIs. Row-Level Security (RLS) is the intended mechanism for data authorization.
- **VitePress Documentation (`/docs`):** A static site for all project documentation, including onboarding guides, architectural decisions, and code standards.
- **OpenSpec Governance (`/openspec`):** A formal process for proposing, reviewing, and documenting significant changes to the project.

## Environment & Tooling

- **Monorepo:** Managed with `pnpm` workspaces.
- **CI/CD:** A GitHub Actions workflow exists for deploying documentation (`.github/workflows/deploy-docs.yml`), but no CI for the application itself (linting, testing, building) is configured.
- **Tooling:** Includes `eslint`, `prettier`, `husky` for pre-commit hooks, and `commitlint` for standardized commit messages.

## Current Risks & Constraints

- **Hard Constraint:** Must adhere to the RealWorld specification.
- **Tech Debt:** The `nextjs` app is a barebones template and needs significant work to implement RealWorld features.
- **Missing Infra:** No defined environments (staging, production), no CI/CD for the application, and no observability stack.
- **Data Model Gap:** The absence of Supabase migrations means the core data schema is not yet defined. This is the biggest immediate blocker.

## PDR Checklist Status

- [ ] **Problem Definition:** (Pass) The goal is to build a RealWorld app.
- [ ] **Scope & Requirements:** (Pass) Clearly defined in/out of scope.
- [ ] **Architecture:** (Partial) High-level architecture is defined, but detailed data flow and component interactions are not.
- [ ] **Data Schema:** (Fail) Not defined.
- [ ] **Security Plan:** (Partial) RLS is the plan, but not implemented. See `docs/onboarding-guide/security.md`.
- [ ] **Testing Strategy:** (Fail) Not defined.
- [ ] **Deployment Plan:** (Fail) Only docs deployment exists.
- [ ] **Observability Plan:** (Fail) Not defined.

## Immediate Next Steps

1. **Define Data Model:** Create initial Supabase migrations for users, articles, comments, and tags.
2. **Implement Authentication:** Build the sign-up and login flows in the Next.js app using Supabase Auth.
3. **Setup Application CI:** Create a GitHub Actions workflow for the `nextjs` app to run linting and build checks on every PR.
4. **Implement RLS Policies:** Define and apply initial RLS policies for the new tables.
5. **Create First API Route:** Implement the API route for creating a new article to validate the entire stack.
