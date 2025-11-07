# 💰 Part 11. Cost & Performance Optimization

> Goal: Optimize costs (compute, storage, logs) and performance (queries, cache, functions) of Supabase + Next.js systems without sacrificing security or stability.

---

## 11.1 🎯 Learning Objectives

After completing this section, developers can:

- Read and analyze Supabase costs by component (DB, Functions, Storage, Realtime).
- Optimize queries, indexes, and caching appropriately.
- Reduce operational costs via cron batches, cold starts, and log retention.
- Compare cost – effort with traditional backends (NestJS / Spring Boot).
- Build internal guidelines to predict costs.

---

## 11.2 🧩 Overview of Cost Factors

| Component          | Cost Affected By                            | How to Optimize                       |
| ------------------ | ------------------------------------------- | ------------------------------------- |
| **Database**       | row count, queries, connections, index size | optimize queries + indexes correctly  |
| **Storage**        | number of files, size, signed URLs          | delete old files, resize images, gzip |
| **Edge Functions** | number of invocations, runtime              | batching + reasonable scheduling      |
| **Realtime**       | number of clients + subscriptions           | limit channels, stream                |
| **pg_cron / pgmq** | job frequency, batch size                   | less frequent cron                    |
| **Logs**           | retention & volume                          | delete old logs, structured logging   |
| **CDN / Frontend** | builds, bandwidth, SSR load                 | static caching, ISR, Edge caching     |

---

## 11.3 ⚙️ Database Optimization

### 🔹 1️⃣ Query Optimization (SQL)

**Signs of slow queries:**

- Using `SELECT *` or too many `JOIN` tables
- No indexes on `WHERE` / `ORDER BY` columns
- Loading large data without pagination

### ✅ Solutions

```sql
-- Replace SELECT * with specific columns
select id, service_name, price from subscriptions;

-- Add indexes for frequently filtered columns
create index idx_subscriptions_user_id on subscriptions(user_id);

-- Safe pagination
select * from subscriptions
where user_id = 'xxx'
order by created_at desc
limit 20 offset 0;
```

### 🔹 2️⃣ Query Caching

- Use **Edge Functions** or **Server Actions** to cache static queries:

```ts
export const revalidate = 60; // cache 1 minute
```

- Supabase API can attach Cloudflare cache (if only reading public data).

---

## 11.4 🧮 Index & Table Size Management

### 🔹 Check Large / Redundant Indexes

```sql
select indexrelid::regclass as index_name,
       pg_size_pretty(pg_relation_size(indexrelid)) as index_size
from pg_index join pg_class on pg_class.oid = pg_index.indrelid
order by pg_relation_size(indexrelid) desc;
```

### 🔹 Remove Redundant Indexes

```sql
drop index if exists idx_old_unused;
```

### 🔹 Clean Up Temp Tables / Old Logs

```sql
delete from system_logs where created_at < now() - interval '30 days';
vacuum analyze system_logs;
```

> 🧠 "vacuum analyze" helps reduce disk space and optimize query plans.

---

## 11.5 ⚡ Edge Function Performance

### 🔹 1️⃣ Cold Start

- Supabase Edge Functions have startup latency of 100–500ms first time.
- Reduce by:

  - Keep functions small, few dependencies.
  - Don't import heavy modules (Stripe SDK → use REST directly).
  - Use **Deno Deploy global cache** (Supabase auto-optimizes).

### 🔹 2️⃣ Batch Requests

Instead of calling API continuously per record:

```ts
await supabase.from("payments").insert(batchData);
```

### 🔹 3️⃣ Timeouts

- Limit function time < 10s (Supabase free tier max ~20s).
- If need longer → move to **pgmq worker** or batch cron.

---

## 11.6 🧰 pg_cron & Batch Optimization

| Situation                  | Solution                                             |
| -------------------------- | ---------------------------------------------------- |
| Cron runs too frequently   | Increase interval (15 → 60 minutes)                  |
| Job processes many records | Split into batches: `limit 1000 offset n`            |
| Job fails repeatedly       | Add retry logic via pgmq                             |
| Too many cron logs         | Limit logs to 7 days                                 |
| Function runs cron         | Call via `net.http_post` instead of client-side loop |

---

## 11.7 🧱 Realtime Optimization

### ⚠️ Realtime Consumes Resources by Subscription Count

- Each client opens 1 channel ~1 WebSocket.
- Max 200 concurrent on free tier.

### ✅ Solutions

- Combine channels: `public:subscriptions` → pass filter in client.
- Unsubscribe when leaving page:

```ts
useEffect(() => {
  const channel = supabase.channel("subscriptions");
  return () => supabase.removeChannel(channel);
}, []);
```

- Only enable realtime for necessary tables.
- Batch UI updates (debounce 1–2s).

---

## 11.8 🧩 Storage Optimization

| Problem                       | Solution                                   |
| ----------------------------- | ------------------------------------------ |
| Large files consume bandwidth | Resize images, compress before upload      |
| Duplicate data                | Hash checksum to detect duplicate files    |
| Unused files                  | Create cron cleanup for old buckets        |
| Many public downloads         | Use signed URLs + CDN caching              |
| Bucket logs                   | Delete log files periodically (14–30 days) |

### SQL Cleanup Example

```sql
select cron.schedule(
  'cleanup_storage',
  '0 2 * * *',
  $$
  delete from storage.objects where created_at < now() - interval '90 days';
  $$
);
```

---

## 11.9 🌐 Frontend (Next.js) Optimization

| Component              | Solution                                        |
| ---------------------- | ----------------------------------------------- |
| **SSR pages**          | Use `revalidate` or ISR for static caching      |
| **Static assets**      | Host via CDN (Vercel / Cloudflare)              |
| **Large bundles**      | Use dynamic imports, avoid importing large SDKs |
| **API calls**          | Prefetch and cache on server                    |
| **Image optimization** | `next/image` + blurDataURL                      |
| **Suspense**           | Avoid blocking render (React 18)                |

### Example

```tsx
export const revalidate = 300; // cache 5 minutes
```

---

## 11.10 💾 Log & Retention Optimization

| Log Type         | Keep How Long | Notes               |
| ---------------- | ------------- | ------------------- |
| Edge Functions   | 7 days        | auto-delete         |
| Database logs    | 14 days       | can export to S3    |
| System log table | 30 days       | cleanup cron        |
| Realtime events  | 3–7 days      | depends on traffic  |
| CI/CD logs       | 14 days       | GitHub auto-cleanup |

```sql
delete from system_logs where created_at < now() - interval '30 days';
```

> ⚠️ Don't store trace logs too long if not needed — wastes costs and slows queries.

---

## 11.11 📊 Periodic Performance Monitoring

### 🔹 Use Supabase Dashboard

- Monitor CPU, memory, I/O, query time
- Tab **Database → Performance Insights**

### 🔹 Use `pg_stat_statements`

```sql
select query, mean_exec_time, calls
from pg_stat_statements
order by mean_exec_time desc limit 5;
```

### 🔹 Combine Function Logging + Metrics Table

```sql
insert into perf_metrics (name, duration_ms, at)
values ('send_reminder_job', 125, now());
```

---

## 11.12 💰 Cost Comparison: Supabase-first vs Traditional Backend

| Criteria                | Supabase + Next.js            | Traditional Backend (NestJS, Spring Boot) |
| ----------------------- | ----------------------------- | ----------------------------------------- |
| **Infra setup**         | 0 (fully managed)             | Costly EC2, DB, networking setup          |
| **Database scaling**    | Auto-managed                  | Manual RDS tuning                         |
| **Auth / Storage**      | Built-in (Auth, Storage API)  | Self-code / separate config               |
| **Cron / Queue**        | pg_cron / pgmq built-in       | Need workers (Celery, BullMQ)             |
| **CI/CD**               | CLI + GitHub Actions          | Jenkins / custom pipeline                 |
| **Ops overhead**        | Very low                      | High, need DevOps engineer                |
| **Initial cost**        | ~$25–50/month                 | ~$70–150/month                            |
| **Cost at scale**       | Linear (increases with usage) | Exponential (compute + EBS)               |
| **Cold start latency**  | 100–500ms (Edge)              | 10–50ms (EC2/ECS)                         |
| **Maintainability**     | Very high                     | Medium                                    |
| **Total DevOps Effort** | ↓ 70–80%                      | baseline 100%                             |

---

## 11.13 🧭 Cost & Performance Optimization Checklist

| Item                                             | Status |
| ------------------------------------------------ | ------ |
| 🔹 Correct indexes, avoid redundancy             | ☐      |
| 🔹 Clean up old logs / storage periodically      | ☐      |
| 🔹 Enable SSR / Edge caching                     | ☐      |
| 🔹 Cron & jobs run reasonably (not too frequent) | ☐      |
| 🔹 Combine realtime channels                     | ☐      |
| 🔹 Resize & compress file uploads                | ☐      |
| 🔹 Don't log unnecessary text / dump data        | ☐      |
| 🔹 Monitor slow queries with pg_stat_statements  | ☐      |
| 🔹 Track Supabase cost dashboard                 | ☐      |
| 🔹 Keep weekly performance reports               | ☐      |

---

## 11.14 💡 Internal Best Practices

1. **Always measure performance with metrics instead of feeling.**
2. **Don't optimize early — only optimize when you have data.**
3. **Schedule cron & functions outside peak hours.**
4. **Prefetch and paginate instead of bulk loading.**
5. **Separate log tables into separate schema (`log.*`) for easier cleanup.**
6. **Keep indexes small, check monthly.**
7. **Use cache layer (ISR / Edge caching) for public routes.**
8. **Always have internal `cost_summary` table (monthly).**
9. **Always review Storage & Realtime costs before scaling plan.**
10. **Run light load tests before each major version.**

---

## 11.15 📚 References

- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Performance Tuning Guide](https://supabase.com/docs/guides/database/performance)
- [Postgres EXPLAIN Tutorial](https://www.postgresql.org/docs/current/using-explain.html)
- [Next.js Performance Optimization](https://nextjs.org/docs/optimizing)
- [pg_stat_statements Overview](https://supabase.com/docs/guides/database/extensions/pg-stat-statements)

---

## 11.16 🧾 Output After This Section

> After completing Part 11, new developers will be able to:
>
> - [x] Significantly reduce Supabase & Vercel costs through cleanup & caching.
> - [x] Optimize queries, indexes, and cron jobs effectively.
> - [x] Build periodic cost tracking reports.
> - [x] Understand trade-offs between speed and cost.
> - [x] Keep Supabase + Next.js system fast, cheap, and sustainable.
