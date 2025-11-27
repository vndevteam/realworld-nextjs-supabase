# Part 4. Database & Migrations

> Goal: Master schema design, write standard internal migrations, seed data, and manage DB changes across environments.

## 4.1 🎯 Learning Objectives

After completing this section, developers can:

- Design and implement PostgreSQL schema in Supabase.
- Use **Supabase CLI** to manage migrations as code.
- Create seed data and sync local DB.
- Optimize performance via indexes, enums, constraints.
- Keep schema version consistent between dev/staging/prod.

## 4.2 🧠 Foundation Knowledge

### Why Migrations?

- **Consistency**: all devs have the same schema.
- **Version control**: easy rollback when errors occur.
- **Automation**: CI/CD can apply migrations automatically.
- **Clear change history**: each DB change has commit trace.

### Basic Migration Structure

```sql
-- example migration file
-- 20251105120200_create_tasks_table.sql

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table tasks enable row level security;

comment on table tasks is 'User task list';
```

## 4.3 🧩 Create Migration with Supabase CLI

### Initialize New Migration

```bash
supabase migration new create_tasks_table
```

CLI will create file:

```bash
/supabase/migrations/
  └── 20251105120200_create_tasks_table.sql
```

Edit SQL directly in this file.

### Apply Migration Locally

```bash
supabase db reset
# or just apply
supabase db push
```

- `db reset`: delete local DB, recreate entire schema + seed.
- `db push`: apply new migrations without deleting data.

### Check Migration Status

```bash
supabase migration list
```

> Displays list of migrations that have run / pending / errors.

## 4.4 🧱 Basic Schema Design (Internal Standard)

Below is an example **base schema** used throughout the documentation ("Subscription Manager" app).

### Create `subscriptions` Table

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  service_name text not null,
  price numeric(10,2) not null,
  currency text default 'USD',
  renew_date date,
  is_active boolean default true,
  created_at timestamptz default now()
);
comment on table subscriptions is 'User subscription service information';
alter table subscriptions enable row level security;
```

### Basic Policy

```sql
create policy "Users can view own subscriptions"
on subscriptions for select
using ( auth.uid() = user_id );

create policy "Users can insert own subscriptions"
on subscriptions for insert
with check ( auth.uid() = user_id );
```

## 4.5 🧾 Index, Constraint, Enum

### Index

```sql
create index idx_subscriptions_user_id on subscriptions(user_id);
create index idx_subscriptions_renew_date on subscriptions(renew_date);
```

> Helps optimize queries when filtering by user or time.

### Enum Type

```sql
create type subscription_status as enum ('active', 'expired', 'cancelled');

alter table subscriptions add column status subscription_status default 'active';
```

### Constraint

```sql
alter table subscriptions
add constraint valid_price check (price >= 0);
```

## 4.6 🧪 Seed Local Data

### Create `/supabase/seed.sql` File

```sql
insert into subscriptions (user_id, service_name, price, renew_date)
values
  ('00000000-0000-0000-0000-000000000001', 'Netflix', 12.99, '2025-12-01'),
  ('00000000-0000-0000-0000-000000000001', 'Spotify', 9.99, '2025-12-15');
```

### Apply Seed

```bash
supabase db reset --seed
```

> CLI will run all migrations then run `seed.sql` to have test data.

## 4.7 🧩 Standard Internal Migration Workflow

```mermaid
flowchart TD
A[Dev changes schema] --> B[Run supabase migration new]
B --> C[Edit SQL migration]
C --> D[Run supabase db push to test local]
D --> E[Commit & push to GitHub]
E --> F[CI/CD apply migration on staging]
F --> G[Deploy production after review]
```

## 4.8 🧭 Naming & File Organization Conventions

| File Type | Name Format                         | Example                                   |
| --------- | ----------------------------------- | ----------------------------------------- |
| Migration | `YYYYMMDDHHmmss_action.sql`         | `20251105120200_create_users_table.sql`   |
| Policy    | `YYYYMMDDHHmmss_policy_<table>.sql` | `20251106120200_policy_subscriptions.sql` |
| Seed      | `seed.sql`                          | -                                         |

**Best Practice:** each DB change → separate migration, don't combine multiple tables in one file.

## 4.9 ⚙️ Sync Schema Between Environments

### Export Current Schema

```bash
supabase db dump --local -f schema.sql
```

### Apply Schema to Other Environment

```bash
supabase db push --db-url postgres://user:pass@host:port/dbname
```

> Ensures staging/production always have the same version.

## 4.10 🧩 Integrate Migrations into CI/CD

### GitHub Actions (Example)

`.github/workflows/db-migration.yml`

```yaml
name: Supabase Migrations

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      - name: Login Supabase
        run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
      - name: Push migrations
        run: supabase db push
```

## 4.11 🧮 Performance & Maintainability Tips

| Topic           | Best Practice                                                  |
| --------------- | -------------------------------------------------------------- |
| **Index**       | Only create indexes for columns often used in `WHERE` / `JOIN` |
| **Enum**        | Use enum instead of text when values are fixed                 |
| **Constraint**  | Use `CHECK` to prevent logically incorrect data                |
| **Timestamp**   | Always use `timestamptz` instead of `timestamp`                |
| **Naming**      | snake_case, plural table names (`users`, `tasks`)              |
| **Soft delete** | Add `deleted_at` instead of physical deletion                  |
| **Audit log**   | Create trigger to log when tracing actions needed              |

## 4.12 🧰 Tools to Check Schema

- **Supabase Studio → Table Editor / SQL Editor**
- **CLI commands:**

  - `supabase migration list` - view migration status (applied / pending / errors).
  - `supabase db push` - apply migrations and display errors if SQL is invalid.
  - `supabase db diff` - compare schema between local and remote to detect differences.

- **VSCode extension "[Supabase](https://marketplace.visualstudio.com/items?itemName=Supabase.vscode-supabase-extension)"**: view schema directly, run queries quickly.

## 4.13 🧭 Completion Checklist

- [ ] Know how to create and apply migrations using CLI.
- [ ] Create tables, indexes, enums, basic constraints.
- [ ] Write seed data for local environment.
- [ ] Know how to export & sync schema between environments.
- [ ] Understand workflow for applying migrations in CI/CD.
- [ ] Keep schema version synchronized for entire team.

## 4.14 💡 Internal Best Practices

1. **Never modify DB directly** on production - only through migrations.
2. **Migrations must have clear description**: comment at top of file with reason, issue link.
3. **Don't manually merge migration conflicts** - regenerate new file.
4. **Keep seed.sql concise**, only data for testing.
5. **Test migration locally before committing** (`supabase db reset`).
6. **Review migration along with code changes** in PR.
7. **Always create index for foreign keys**, especially when using RLS subqueries.
8. **Separate policies into separate files**, easier to track permissions and rollback.

## 4.15 📚 References

- [Supabase Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments)
- [PostgreSQL Schema Design](https://www.postgresql.org/docs/current/ddl.html)
- [Supabase Migration Guide](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase CLI Database Migrations](https://supabase.com/docs/reference/cli/supabase-migration)
- [Supabase db push & db reset Docs](https://supabase.com/docs/reference/cli/supabase-db-push)

## 4.16 🧾 Output After This Section

> After completing Part 4, new developers will be able to:
>
> - [x] Write SQL migrations and seed local DB.
> - [x] Understand schema version control workflow.
> - [x] Manage dev/staging/prod environments via CLI.
> - [x] Optimize schema with indexes, constraints, enums.
> - [x] Automate migrations via CI/CD.
