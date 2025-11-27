# Part 1. Setup & Environment Preparation

> Goal: Set up a standard internal dev environment, run Supabase locally, Next.js frontend, and connect the two.

## 1.1 ⚙️ Learning Objectives

After completing this section, developers will be able to:

- Install Supabase CLI, Node.js, VSCode, and necessary plugins.
- Create a new Supabase project + Next.js project and connect successfully.
- Run Supabase locally with database, auth, storage.
- Understand the standard internal project directory structure.

## 1.2 🧩 Tools to Prepare

### Required Software

| Tool                        | Purpose                               | Installation                                                            |
| --------------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| **Node.js ≥ 20**            | Run Next.js and CLI                   | [nodejs.org](https://nodejs.org)                                        |
| **pnpm** _(recommended)_    | Package manager faster than npm       | `npm i -g pnpm`                                                         |
| **Supabase CLI**            | Manage projects, run local DB, deploy | [Supabase CLI Docs](https://supabase.com/docs/guides/cli)               |
| **Docker Desktop / Podman** | Supabase local runs via containers    | [docker.com](https://www.docker.com/) / [podman.io](https://podman.io/) |
| **VSCode**                  | Main IDE                              | [code.visualstudio.com](https://code.visualstudio.com/)                 |

### Recommended VSCode Extensions

| Extension                  | Purpose                              |
| -------------------------- | ------------------------------------ |
| **Supabase (by Supabase)** | Connect and manage database directly |
| **SQLTools**               | Write and run SQL queries            |
| **ESLint + Prettier**      | Format and lint code                 |

### Accounts Needed

- 1 [Supabase](https://supabase.com/dashboard) account
- 1 GitHub account (for linking Supabase project and CI/CD)
- 1 [Vercel](https://vercel.com) or Cloudflare Pages account (for deployment later)

## 1.3 🧱 Create Your First Supabase Project

### Step 1. Login to Supabase Dashboard

- Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Select **New Project**
- Name: `supabase-training`
- Choose nearest region (e.g., Singapore)
- Note the Postgres DB password → for local CLI use.

### Step 2. Create Local Project

```bash
mkdir supabase-next-demo
cd supabase-next-demo
npx supabase init
```

This will create the directory:

```bash
/supabase
  ├── config.toml         # local configuration
  ├── migrations/         # SQL migration files
  └── seed.sql            # initial seed data
```

### Step 3. Run Supabase Locally

```bash
supabase start
```

> CLI will automatically run Postgres, API, Auth, Storage in Docker.
> Default access:
>
> - API URL: `http://localhost:54321`
> - DB: `localhost:54322`
> - Studio (local dashboard): `http://localhost:54323`
> - Database credentials: `postgres` / `postgres` _(default Supabase local containers)_

### Step 4. Login to CLI

```bash
supabase login
```

Paste the **Access Token** (get from Supabase Dashboard → Account → Access Token).

## 1.4 ⚡ Create Next.js Project

### Step 1. Create New Next.js Project

```bash
pnpm create next-app@latest web --typescript --app
cd web
```

> Recommended configuration:
>
> - ✅ TypeScript
> - ✅ ESLint
> - ✅ App Router
> - ✅ TailwindCSS (optional but recommended for UI demo)

### Step 2. Install Supabase SDK

```bash
pnpm add @supabase/supabase-js
```

### Step 3. Create `.env.local` File

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

> 🔎 Get `anon_key` at **Supabase → Settings → API → Project API keys**.

### Step 4. Create Client Helper

`/lib/supabaseClient.ts`

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

> 💡 `createClient` is a helper function to create a Supabase client. It is used to connect to the Supabase database in client-side. You can also use `createBrowserClient` or `createServerClient` from `@supabase/ssr` to create a client (recommended for Next.js App Router).

### Step 5. Test Connection

`app/page.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("profiles").select("*");
      setProfiles(data || []);
    };
    fetchData();
  }, []);

  return (
    <main>
      <h1>Hello Supabase</h1>
      <pre>{JSON.stringify(profiles, null, 2)}</pre>
    </main>
  );
}
```

> 👉 If you see `relation "profiles" does not exist`, that's expected before Part 2 - we'll create the `profiles` table in Authentication (section 2.5) and revisit DB in Part 4.

## 1.5 🗂️ Standard Internal Directory Structure

```bash
/supabase
  ├── migrations/           # All DB changes go here
  ├── seed.sql              # Sample data
  ├── functions/            # Edge Functions
  ├── policies/             # RLS & policy SQL
/web
  ├── app/                  # Next.js App Router
  ├── lib/                  # Client helpers (supabaseClient, auth helper)
  ├── components/           # UI components
  ├── types/                # TypeScript types
  └── public/               # Assets
/scripts
  ├── local-reset.sh        # Script to reset local DB
  ├── cron/                 # Scheduled batch jobs
  └── dev-seed.ts           # Quick dev data creation
```

### Best Practice

- Every DB change must go through migrations, no manual operations.
- Migration names should follow format:

  ```bash
  20251105120000_create_users_table.sql
  20251105120500_add_rls_policy_users.sql
  ```

- Folder `/scripts` should have:

  - `init-local.sh` → initial local setup
  - `reset-db.sh` → delete Supabase container + start clean

## 1.6 🧰 Basic Git & GitHub Actions Setup

1. **Initialize Git repo**

   ```bash
   git init
   git add .
   git commit -m "init supabase + nextjs project"
   ```

2. **Create Remote Repo**

   - GitHub → New Repository → `supabase-next-demo`
   - Push:

     ```bash
     git remote add origin git@github.com:<yourname>/supabase-next-demo.git
     git push -u origin main
     ```

3. **Setup Workflow (temporary)**
   File `.github/workflows/check.yml`:

   ```yaml
   name: Check Project Setup

   on:
     push:
       branches: [main]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v5
         - name: Setup Node
           uses: actions/setup-node@v6
           with:
             node-version: 20
         - uses: pnpm/action-setup@v4
           with:
             version: 10.18.1
         - run: pnpm install
           working-directory: web
         - run: pnpm build
           working-directory: web
   ```

   > Ensures project always builds after each commit.

## 1.7 🧭 Environment Check & Verification

✅ After setup, ensure:

- [ ] Can run `supabase start` and access local Studio.
- [ ] Can create Next.js project and display "Hello Supabase".
- [ ] `.env.local` has correct Supabase URL and Anon Key.
- [ ] GitHub Actions build succeeds.
- [ ] Docker has no port conflicts (5432-54323).

## 1.8 💡 Internal Best Practices

1. **Don't use Production Dashboard to create tables** - always use SQL migrations.
2. **Always commit `.sql` migration files along with code changes.**
3. **Don't share Service Role Key** with FE or public dev environments.
4. **Use separate Supabase projects for each environment** (dev / staging / prod).
5. **When running local Supabase:**

   - Check Docker container `supabase_db` is running.
   - Clean local data regularly (`supabase stop && supabase start`).

6. **Each dev creates their own branch** during training (`feat/yourname-auth`, `feat/yourname-crud`).

## 1.9 📚 References

- [Supabase CLI Quickstart](https://supabase.com/docs/guides/cli/getting-started)
- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase SDK Reference](https://supabase.com/docs/reference/javascript/start)
- [Supabase Next Demo](https://github.com/lamngockhuong/supabase-next-demo)

## 1.10 🧾 Output After This Section

> After completing Part 1, new developers should be able to:
>
> - [x] Create local Supabase project + connect via CLI
> - [x] Create Next.js app and connect to Supabase successfully
> - [x] Understand standard internal project structure
> - [x] Build & run basic pipeline (GitHub Actions)
> - [x] Have environment ready to continue with Part 2 (Auth)
