# 🛡️ Part 10. Security Best Practices

> Goal: Understand security layers in Supabase + Next.js systems, master "secure-by-default" principles, and avoid common mistakes when deploying projects to production.

---

## 10.1 🎯 Learning Objectives

After completing this section, developers can:

- Protect API keys, tokens, and sessions correctly.
- Configure RLS (Row Level Security) securely.
- Limit access to Edge Functions, Storage, and Webhooks.
- Protect secrets in CI/CD.
- Understand authorization model in Supabase.

---

## 10.2 🧩 Main Security Layers

```mermaid
flowchart TD
A[User] -->|JWT Token| B[Supabase Auth]
B -->|Row Policy| C[(Postgres + RLS)]
C --> D[Edge Functions]
D --> E[External APIs (Stripe, Slack...)]
F[Storage Buckets] -->|RLS| C
G[CI/CD Secrets] --> D
```

| Layer                  | Risk                 | Protection Method                   |
| ---------------------- | -------------------- | ----------------------------------- |
| **Frontend (Next.js)** | Exposed keys, tokens | Hide service key, only use anon key |
| **Auth**               | Forged tokens        | Verify JWT from Supabase            |
| **Database**           | Unauthorized queries | Enable RLS & clear policies         |
| **Storage**            | Public file leaks    | Private buckets + signed URLs       |
| **Functions**          | Unauthorized calls   | Header validation + rate limiting   |
| **CI/CD**              | Exposed secrets      | GitHub Encrypted Secrets            |
| **Webhook**            | Fake requests        | Verify signatures                   |

---

## 10.3 🔑 1️⃣ API Keys & Environment Variables

### ❌ Common Mistakes

- Commit `.env` files to repo
- Use `service_role_key` in frontend
- Call Supabase API from FE with high-privilege keys

### ✅ Correct Approach

```bash
# .env.local (frontend)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# .env.server (backend / Edge)
SUPABASE_SERVICE_ROLE_KEY=...
```

> 🔐 Rule:
>
> - FE only uses **Anon Key**
> - Backend (Edge Functions, Cron, CI/CD) uses **Service Role Key**

**Never** export `service_role_key` to browser or public APIs.

---

## 10.4 🧱 2️⃣ Row Level Security (RLS)

RLS is the most important "security barrier" in Supabase.

### ✅ RLS Checklist

| Item                                                               | Done? | Notes                                        |
| ------------------------------------------------------------------ | ----- | -------------------------------------------- |
| Enable RLS for all tables containing user data                     | ☐     | `alter table ... enable row level security;` |
| Each table has separate SELECT / INSERT / UPDATE / DELETE policies | ☐     | Don't use `for all` arbitrarily              |
| Policies check `auth.uid()` for users                              | ☐     | Don't rely on email                          |
| Separate policies for `admin` / `service role`                     | ☐     | `auth.jwt()->>'role' = 'admin'`              |
| Test policies with `Run as user` in dashboard                      | ☐     | Ensure no data leaks                         |

---

### Correct Example

```sql
create policy "Users can read own data"
on profiles
for select
using ( auth.uid() = id );

create policy "Admins can read all"
on profiles
for select
using ( auth.jwt()->>'role' = 'admin' );
```

### ❌ Wrong

```sql
create policy "Allow all users"
on profiles
for select
using ( true ); -- ❌ anyone can view
```

---

## 10.5 🔐 3️⃣ Auth & Session Security

### ✅ Token Expiration

- Supabase access tokens have default TTL of 1 hour.
- Auto-refresh via cookies → no localStorage needed.
- Always enable **Secure cookies (HTTPS only)** in dashboard.

### ✅ Correct Logout

```ts
await supabase.auth.signOut({ scope: "local" });
```

### ⚠️ Avoid Storing

- JWT tokens in localStorage/sessionStorage.
- Email/password in global state.

### ✅ Instead

Supabase SSR client (`@supabase/ssr`) automatically stores sessions via secure cookies.

---

## 10.6 🧩 4️⃣ Edge Functions Security

### ✅ Verify Caller

```ts
const authHeader = req.headers.get("authorization") ?? "";
const token = authHeader.replace("Bearer ", "");
const { data, error } = await supabase.auth.getUser(token);
if (error || !data?.user) return new Response("Unauthorized", { status: 401 });
```

### ✅ Limit Domain

```ts
const origin = req.headers.get("origin");
if (!["https://app.example.com"].includes(origin!)) {
  return new Response("Forbidden", { status: 403 });
}
```

### ✅ Rate Limiting

- Use Cloudflare or Supabase Function middleware:
  cache IP → count requests → block if exceeds threshold.

---

## 10.7 🧱 5️⃣ Storage Bucket Security

### ⚠️ Common Mistakes

- Create `public` bucket then upload user files directly.
- Don't verify `auth.uid()` before upload.

### ✅ Correct Approach

- Create private bucket: `user-files`
- Enable RLS:

```sql
create policy "User can upload own file"
on storage.objects
for insert
with check ( auth.uid()::text = (storage.foldername(name))[1] );
```

- Use **signed URLs** for downloads:

```ts
const { data } = await supabase.storage
  .from("user-files")
  .createSignedUrl("user-123/avatar.png", 3600);
```

---

## 10.8 ⚙️ 6️⃣ Webhook & Integration Security

### ✅ Verify Signature (Example: Stripe)

```ts
import Stripe from "stripe";
const event = stripe.webhooks.constructEvent(
  rawBody,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

### ✅ Limit IP / Domain Calling Edge Functions

```ts
const ip = req.headers.get("x-forwarded-for");
if (!["3.18.12.63", "3.130.192.231"].includes(ip!)) {
  return new Response("Forbidden", { status: 403 });
}
```

### ✅ Don't Make Edge Functions Public by Default

Add custom auth header if needed:

```ts
const secret = req.headers.get("x-internal-secret");
if (secret !== Deno.env.get("INTERNAL_SECRET"))
  return new Response("Unauthorized", { status: 401 });
```

---

## 10.9 🧰 7️⃣ CI/CD & Secrets Protection

| Risk                    | Mitigation                                              |
| ----------------------- | ------------------------------------------------------- |
| Keys exposed in CI logs | Don't echo env vars (`set -x`)                          |
| Secrets pushed to repo  | Add `.env*` to `.gitignore`                             |
| Unauthorized access     | Limit "Read/Write" permissions of GitHub Actions tokens |
| Wrong CLI ref           | Always link correct project with `supabase link`        |
| Expired tokens          | Rotate `SUPABASE_ACCESS_TOKEN` periodically             |

### ✅ GitHub Secrets

Setup:

```
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
SUPABASE_SERVICE_ROLE_KEY
VERCEL_TOKEN
```

> 🔐 All secrets only referenced in workflows, not hardcoded in YAML.

---

## 10.10 🧮 8️⃣ Database-Level Hardening

| Item                | Explanation                                                     |
| ------------------- | --------------------------------------------------------------- |
| `no PUBLIC access`  | Don't grant `public` role permissions to tables.                |
| `search_path`       | Fix schema: `set search_path = 'public'`                        |
| `SECURITY DEFINER`  | Only use when truly needed for triggers.                        |
| `pgcrypto`          | Use for hashing/encrypting sensitive data.                      |
| `limited extension` | Only enable necessary extensions (`pg_cron`, `pgmq`, `pg_net`). |
| `audit_log`         | Log all delete or update actions.                               |

---

## 10.11 🧠 9️⃣ Frontend Security (Next.js)

| Threat               | Solution                                                             |
| -------------------- | -------------------------------------------------------------------- |
| XSS                  | Escape rendered data (`dangerouslySetInnerHTML` → forbidden)         |
| CSRF                 | Use httpOnly cookies + middleware to check origin                    |
| CORS                 | Only whitelist official domains                                      |
| Clickjacking         | Add header `X-Frame-Options: DENY`                                   |
| Error Leak           | Hide server errors when returning to FE (only send generic messages) |
| Cache sensitive data | Disable caching for `/api/*` routes containing user info             |

---

## 10.12 🧭 10️⃣ Auditing & Incident Response

1. **Log all important actions** (`INSERT`, `UPDATE`, `DELETE`)
   → Store in `audit_log` table.

   ```sql
   create table audit_log (
     id bigserial primary key,
     table_name text,
     action text,
     user_id uuid,
     data jsonb,
     created_at timestamptz default now()
   );
   ```

2. **Attach audit trigger**

   ```sql
   create or replace function log_changes()
   returns trigger as $$
   begin
     insert into audit_log (table_name, action, user_id, data)
     values (TG_TABLE_NAME, TG_OP, auth.uid(), row_to_json(NEW));
     return NEW;
   end;
   $$ language plpgsql;
   ```

3. **Alert on unusual access**

   - Compare `auth.uid()` doesn't match `created_by` → send Slack alert.
   - Cron check hourly for delete / update actions.

---

## 10.13 🧭 Overall Security Checklist

| Item                                     | Status |
| ---------------------------------------- | ------ |
| 🔐 Only use anon key in FE               | ☐      |
| 🔑 Service key only in Edge/CI/CD        | ☐      |
| 🧱 RLS enabled for all tables            | ☐      |
| ⚙️ Storage buckets private + signed URLs | ☐      |
| 🧩 Edge Functions authenticate callers   | ☐      |
| 🧠 Webhooks verify signature/IP          | ☐      |
| 🧰 Secrets stored in GitHub Secrets      | ☐      |
| 🧮 DB doesn't grant PUBLIC permissions   | ☐      |
| 🚨 Have audit logs and Slack alerts      | ☐      |
| ✅ Periodically rotate keys & tokens     | ☐      |

---

## 10.14 💡 Internal Best Practices

1. **Security by Default** – all tables, buckets, functions default to _blocked access_.
2. **Never hardcode secrets** – even in tests.
3. **Each environment (dev/stg/prod)** uses separate keys.
4. **Rotate tokens every 90 days.**
5. **Only admins have service role keys.**
6. **Alert if dev sets RLS = false in PR.**
7. **Create script to check policies missing `auth.uid()`.**
8. **Protect `/api/internal/*` routes with internal tokens.**
9. **Limit bandwidth for public buckets.**
10. **Always test "unauthorized access" cases in QA.**

---

## 10.15 📚 References

- [Supabase Security Overview](https://supabase.com/docs/guides/platform/security)
- [PostgreSQL RLS Docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Security](https://supabase.com/docs/guides/auth)
- [Supabase Storage Security](https://supabase.com/docs/guides/storage)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Top 10 (2023)](https://owasp.org/www-project-top-ten/)

---

## 10.16 🧾 Output After This Section

> After completing Part 10, new developers can:
>
> - [x] Deploy Supabase + Next.js system with complete security layers.
> - [x] Design secure RLS & Policies, avoid data leaks.
> - [x] Protect keys, storage, webhooks, and CI/CD secrets.
> - [x] Create audit logs and incident alerting mechanisms.
> - [x] Master "Secure by Default" principles for entire project.
