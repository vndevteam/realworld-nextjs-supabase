# ⏰ Part 6. Batch Job & Background Tasks

> Goal: Master how to run scheduled tasks (cron), background processing (queue), and execute complex jobs using Supabase Edge Functions or SQL.

---

## 6.1 🎯 Learning Objectives

After completing this section, developers can:

- Understand three main ways to run jobs in Supabase:

  1. **pg_cron (SQL-based scheduler)**
  2. **Edge Functions + Cron scheduler**
  3. **pgmq (Postgres message queue)**

- Implement real batch jobs: send emails, cleanup, reports.
- Write and debug Edge Functions for background tasks.
- Keep jobs running safely, observable and logged.

---

## 6.2 🧩 Batch Job Options in Supabase

| Type                     | For                        | Advantages              | Limitations                |
| ------------------------ | -------------------------- | ----------------------- | -------------------------- |
| **pg_cron**              | Pure SQL jobs in DB        | Simple, no code needed  | Limited logic (SQL only)   |
| **Edge Function + Cron** | Complex logic, API calls   | Flexible, easy to debug | Need to manage rate & logs |
| **pgmq (queue)**         | Async jobs with many tasks | Retry, durable queue    | Need consumer code         |

> ✅ How to choose:
>
> - If only _cleanup/update DB_ → **pg_cron**
> - If _call external API / send email / process files_ → **Edge Function + Cron**
> - If _large jobs, many parallel tasks_ → **pgmq**

---

## 6.3 ⚙️ 1️⃣ Batch Jobs with `pg_cron` (SQL Scheduler)

`pg_cron` is a PostgreSQL extension enabled by default in Supabase.

### 🔹 Enable Extension (if not already)

```sql
create extension if not exists pg_cron;
```

### 🔹 Create Scheduled Job (cleanup)

```sql
select cron.schedule(
  'cleanup_old_records',
  '0 3 * * *', -- every day at 3 AM
  $$
  delete from subscriptions where is_active = false and renew_date < now() - interval '30 days';
  $$
);
```

### 🔹 View Job List

```sql
select * from cron.job;
```

### 🔹 View Job History

```sql
select * from cron.job_run_details order by runid desc limit 10;
```

> 📝 Supabase will automatically run this job in the background according to cron schedule.

---

### 💡 Cron Schedule Format

| Expression     | Meaning          |
| -------------- | ---------------- |
| `* * * * *`    | Every minute     |
| `0 * * * *`    | Every hour       |
| `0 3 * * *`    | Daily at 3 AM    |
| `*/15 * * * *` | Every 15 minutes |

---

## 6.4 ⚡ 2️⃣ Edge Functions + Cron Scheduler

When jobs need **logic more complex than SQL** (e.g., send email, call external API).

### 🔹 Create Edge Function

```bash
supabase functions new send-reminder
```

`/supabase/functions/send-reminder/index.ts`

```ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)
    .lte("renew_date", new Date().toISOString().slice(0, 10));

  for (const sub of data ?? []) {
    console.log(`📧 Sending reminder for ${sub.service_name}`);
    // simulate sending email
  }

  return new Response("Reminders sent!", { status: 200 });
});
```

---

### 🔹 Deploy Function

```bash
supabase functions deploy send-reminder
```

---

### 🔹 Create Cron to Call Function

```sql
select cron.schedule(
  'send_reminder_job',
  '0 9 * * *', -- run every morning at 9 AM
  $$
  select net.http_post(
    url := 'https://<project>.functions.supabase.co/send-reminder',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('service_role_key')),
    body := '{}'
  );
  $$
);
```

> 🧠 `pg_net` is used by Supabase to make HTTP requests directly in DB.

---

### 🔹 Log & Debug Function

```bash
supabase functions logs --name send-reminder
```

> You will see logs for each cron job call.

---

## 6.5 📬 3️⃣ Queue with `pgmq`

When jobs need retry, split tasks, or process in queue.

### 🔹 Enable Extension

```sql
create extension if not exists pgmq;
```

### 🔹 Create Queue and Push Message

```sql
select pgmq.create('email_queue');

select pgmq.send('email_queue', jsonb_build_object(
  'user_id', '00000000-0000-0000-0000-000000000001',
  'subject', 'Subscription Reminder'
));
```

### 🔹 Consumer Reads Queue (Edge Function)

`/supabase/functions/email-worker/index.ts`

```ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data } = await supabase.rpc("pgmq_read", {
    qname: "email_queue",
    qty: 5,
  });
  for (const msg of data ?? []) {
    console.log("📩 Processing email:", msg.message);
    await supabase.rpc("pgmq_delete", {
      qname: "email_queue",
      msg_id: msg.msg_id,
    });
  }

  return new Response("Processed messages", { status: 200 });
});
```

### 🔹 Create Cron to Call Worker

```sql
select cron.schedule(
  'email_worker_cron',
  '*/5 * * * *',
  $$
  select net.http_post(url := 'https://<project>.functions.supabase.co/email-worker');
  $$
);
```

> Worker runs every 5 minutes, processes batch of 5 messages each time.

---

## 6.6 🧭 Suggested Real-world Use Cases

| Use Case                        | Suggested Implementation |
| ------------------------------- | ------------------------ |
| Send expiration reminder emails | Edge Function + pg_cron  |
| Delete old logs / temp data     | Pure SQL pg_cron         |
| Sync data to external API       | Edge Function + Cron     |
| Send batch notifications        | pgmq + worker            |
| Auto-flag expired status        | pg_cron                  |
| Retry on job failure            | pgmq (retry queue)       |

---

## 6.7 📊 Monitoring & Debug

### 🔹 View Job Logs

```sql
select * from cron.job_run_details order by start_time desc limit 5;
```

### 🔹 View Edge Function Logs

```bash
supabase functions logs --name send-reminder
```

### 🔹 Debug Queue

```sql
select * from pgmq.read('email_queue', 10);
```

---

## 6.8 🧰 Internal Conventions

| Component  | Rule                                                           |
| ---------- | -------------------------------------------------------------- |
| Job name   | snake_case + suffix `_job` (`cleanup_job`, `email_worker_job`) |
| Cron time  | UTC by default (document clearly)                              |
| Log        | Always `console.log()` or write to `job_log` table             |
| Idempotent | Jobs must be rerunnable without errors                         |
| Alert      | Cron fails → send logs to Slack/Email (via Edge Function)      |

---

## 6.9 🧾 Example: Cleanup Old Audit Log Job

`/supabase/migrations/20251106T_cleanup_audit.sql`

```sql
select cron.schedule(
  'cleanup_audit_log',
  '0 0 * * *',
  $$
  delete from audit_log where at < now() - interval '30 days';
  $$
);
```

---

## 6.10 🧭 Completion Checklist

- [ ] Know how to run SQL cron with `pg_cron`.
- [ ] Can create Edge Function and attach cron scheduler.
- [ ] Understand how to use `pgmq` to process queues.
- [ ] Successfully send emails / cleanup / sync jobs.
- [ ] Know how to log & debug job runs.
- [ ] Apply internal naming + logging standards.

---

## 6.11 💡 Internal Best Practices

1. **Each job → has its own log** (`job_log` table or function logs).
2. **Don't use service key in FE**, only in Edge Functions / Cron SQL.
3. **Jobs should be idempotent** – running multiple times doesn't cause errors or duplicate data.
4. **Set timezone UTC** in cron, convert to local when displaying.
5. **Don't use SELECT \* in jobs**, only get necessary columns.
6. **Use queue when jobs run long > 30s** to avoid timeout.
7. **Add tag "CRON" in log messages** to filter in Supabase Logs.
8. **Review job schedules periodically** to avoid spam or duplicate tasks.
9. **Before deploying**: run `supabase functions logs --tail` to check runtime.
10. **Limit retries** (with pgmq) to avoid infinite job loops.

---

## 6.12 📚 References

- [Supabase pg_cron Docs](https://supabase.com/docs/guides/database/extensions/pg-cron)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase pgmq (Message Queue)](https://supabase.com/docs/guides/database/extensions/pgmq)
- [Supabase net/http_post](https://supabase.com/docs/guides/database/extensions/pg-net)

---

## 6.13 🧾 Output After This Section

> After completing Part 6, new developers can:
>
> - [x] Write SQL cron jobs with pg_cron.
> - [x] Create Edge Functions for background tasks.
> - [x] Set up Cron to automatically call functions.
> - [x] Use pgmq to manage queues and retries.
> - [x] Monitor job logs, debug on errors.
> - [x] Apply internal logging & naming standards.
