# RealWorld Next.js Supabase

> A full-stack implementation of the [RealWorld](https://github.com/gothinkster/realworld) spec (Conduit clone) built with Next.js and Supabase. This project serves as both a production-ready application and a comprehensive training reference for the Supabase + Next.js stack.

## 📋 Table of Contents

- [📋 Table of Contents](#-table-of-contents)
- [🎯 Overview](#-overview)
- [✨ Features](#-features)
  - [Core RealWorld Features](#core-realworld-features)
  - [Supabase-Oriented Capabilities](#supabase-oriented-capabilities)
- [🛠️ Tech Stack](#️-tech-stack)
  - [Core Technologies](#core-technologies)
  - [Development Tools](#development-tools)
  - [Optional/Advanced](#optionaladvanced)
- [📦 Prerequisites](#-prerequisites)
  - [Recommended VSCode Extensions](#recommended-vscode-extensions)
- [🚀 Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Set Up Supabase](#3-set-up-supabase)
    - [Option A: Local Development (Recommended)](#option-a-local-development-recommended)
    - [Option B: Cloud Project](#option-b-cloud-project)
  - [4. Run the Development Server](#4-run-the-development-server)
  - [5. Run Documentation Locally](#5-run-documentation-locally)
- [📁 Project Structure](#-project-structure)
- [💻 Development](#-development)
  - [Available Scripts](#available-scripts)
    - [Root Level](#root-level)
    - [Next.js App](#nextjs-app)
  - [Code Style](#code-style)
  - [Architecture Patterns](#architecture-patterns)
  - [Git Workflow](#git-workflow)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
  - [Development Checklist](#development-checklist)
- [📄 License](#-license)
- [👥 Team](#-team)
  - [Built with ❤️ using Next.js and Supabase](#built-with-️-using-nextjs-and-supabase)

## 🎯 Overview

This project implements the RealWorld application specification, providing a complete social blogging platform with user authentication, article management, comments, favorites, and tags. Built with modern web technologies, it demonstrates best practices for full-stack development using Next.js App Router and Supabase.

**Key Goals:**

- Deliver the canonical RealWorld feature set (authentication, profiles, articles, tags, favorites, comments)
- Serve as a Supabase + Next.js starter template and training reference
- Demonstrate server-first architecture with React Server Components
- Showcase Row-Level Security (RLS) for authorization
- Provide comprehensive documentation for onboarding new developers

## ✨ Features

### Core RealWorld Features

- ✅ User authentication (register, login, JWT/session)
- ✅ User profiles and settings
- ✅ Articles (CRUD operations)
- ✅ Comments on articles
- ✅ Favorites/bookmarks
- ✅ Tags and tag filtering
- ✅ Global and personal feeds
- ✅ Pagination

### Supabase-Oriented Capabilities

- 🔐 Authentication flows via Supabase Auth with SSR session injection
- 🛡️ Authorization via Row-Level Security (RLS) policies
- 🔄 Realtime updates for selected domains
- 📦 Storage with signed URLs
- ⏰ Batch jobs via Cron and Edge Functions
- 📬 Queue support (pgmq) for async processing
- 🚀 CI/CD with Supabase CLI and GitHub Actions

## 🛠️ Tech Stack

### Core Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript (strict mode)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service (Auth, Postgres, Storage, Realtime)
- **pnpm** - Fast, disk space efficient package manager

### Development Tools

- **ESLint 9** - Code linting with `eslint-config-next`
- **Husky** - Git hooks
- **Commitlint** - Conventional commits
- **VitePress** - Documentation site
- **Supabase CLI** - Local development and deployment

### Optional/Advanced

- Supabase Cron (`pg_cron`) and Scheduled Edge Functions
- Supabase Queues (pgmq)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm
- **Supabase CLI** - [Installation Guide](https://supabase.com/docs/guides/cli)
- **Docker Desktop** or Podman (for local Supabase)
- **Git**

### Recommended VSCode Extensions

- Supabase (by Supabase)
- SQLTools
- ESLint
- Prettier

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vndevteam/realworld-nextjs-supabase.git
cd realworld-nextjs-supabase
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

#### Option A: Local Development (Recommended)

```bash
# Start Supabase locally
cd supabase
supabase start

# Copy environment variables
cp .env.example .env.local
```

#### Option B: Cloud Project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Copy your project URL and anon key
3. Create `.env.local` in the `nextjs` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Development Server

```bash
# From project root
cd nextjs
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Documentation Locally

```bash
# From project root
pnpm docs:dev
```

Open [http://localhost:5173](http://localhost:5173) to view the documentation.

## 📁 Project Structure

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

## 💻 Development

### Available Scripts

#### Root Level

```bash
pnpm docs:dev      # Start documentation dev server
pnpm docs:build    # Build documentation
pnpm docs:preview  # Preview built documentation
```

#### Next.js App

```bash
cd nextjs
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Code Style

- **TypeScript**: Strict mode enabled, explicit types on exports
- **React**: Server Components by default, Client Components only when needed
- **Styling**: Tailwind CSS utility-first, co-locate theme tokens in `globals.css`
- **Naming**:
  - Functions: `verb/verb-phrase` (e.g., `getUserProfile`, `createArticle`)
  - Components: `PascalCase` (e.g., `ArticleList`, `ProfileCard`)
  - Files: `kebab-case` for modules, `PascalCase` for React components
- **Imports**: Use path alias `@/*` as configured in `tsconfig.json`

### Architecture Patterns

- **Server-First**: Prefer Server Components and Server Actions
- **RLS as Primary Authorization**: Encode access control in PostgreSQL policies
- **Clear Client Separation**: Server-side Supabase client for SSR, client-side only for interactive auth/realtime
- **Route Protection**: At server layer (RSC/middleware) using Supabase session
- **Modular by Domain**: Keep features separated (auth, articles, profiles)

### Git Workflow

- **Branching**: Feature branches `feat/<topic>`, fix branches `fix/<topic>`
- **Commits**: Conventional Commits (e.g., `feat: add article editor`, `fix: correct tag filter`)
- **Pull Requests**: Required for merges, must pass CI checks

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory, covering:

- **Introduction** - Overview of Supabase and the stack
- **Setup** - Environment preparation and project creation
- **Authentication** - User auth flows and SSR session handling
- **Authorization** - Row-Level Security (RLS) policies
- **Integration** - Supabase + Next.js integration patterns
- **Advanced** - Edge Functions, Cron, Queues
- **Performance** - Optimization strategies
- **Security** - Best practices and guidelines
- **CI/CD** - Deployment and DevOps
- **Observability** - Debugging and monitoring

View the documentation locally:

```bash
pnpm docs:dev
```

Or access the online version (when deployed).

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **OpenSpec Workflow**: For planning or proposals, check `openspec/AGENTS.md`
2. **Conventional Commits**: Use the commit message format
3. **Code Quality**: Ensure linting passes and types are correct
4. **Documentation**: Update docs when adding features
5. **Pull Requests**: Provide clear descriptions and ensure CI passes

### Development Checklist

- [ ] Code follows project conventions
- [ ] TypeScript types are explicit and correct
- [ ] ESLint passes without errors
- [ ] Server-first patterns are followed
- [ ] RLS policies are tested
- [ ] Documentation is updated (if needed)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**VNDevTeam** - Internal training and development team

---

### Built with ❤️ using Next.js and Supabase
