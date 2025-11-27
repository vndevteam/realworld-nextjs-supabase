# Phần 6. Batch Job & Background Tasks

> Mục tiêu: nắm được cách chạy các tác vụ định kỳ (cron), xử lý nền (queue), và thực thi job phức tạp bằng Supabase Edge Functions hoặc SQL.

## 6.1 🎯 Mục tiêu học phần

Sau khi hoàn thành phần này, dev có thể:

- Hiểu ba cách chính để chạy job trong Supabase:

  1. **pg_cron (SQL-based scheduler)**
  2. **Edge Functions + Cron scheduler**
  3. **pgmq (Postgres message queue)**

- Triển khai batch job thật: gửi email, cleanup, report.
- Viết và debug Edge Function cho background tasks.
- Giữ job chạy an toàn, quan sát và log được.

## 6.2 🧩 Các lựa chọn batch job trong Supabase

| Loại                     | Dành cho                | Ưu điểm                  | Hạn chế                  |
| ------------------------ | ----------------------- | ------------------------ | ------------------------ |
| **pg_cron**              | Job SQL thuần trong DB  | Đơn giản, không cần code | Giới hạn logic (chỉ SQL) |
| **Edge Function + Cron** | Logic phức tạp, gọi API | Linh hoạt, dễ debug      | Cần quản lý rate & log   |
| **pgmq (queue)**         | Job async nhiều task    | Có retry, durable queue  | Cần code consumer        |

> ✅ Cách chọn:
>
> - Nếu chỉ _cleanup/update DB_ → **pg_cron**
> - Nếu _gọi API ngoài / gửi email / xử lý file_ → **Edge Function + Cron**
> - Nếu _job lớn, nhiều tác vụ song song_ → **pgmq**

## 6.3 ⚙️ 1️⃣ Batch job với `pg_cron` (SQL scheduler)

`pg_cron` là PostgreSQL extension được Supabase bật sẵn.

### Bật extension (nếu chưa có)

```sql
create extension if not exists pg_cron;
```

### Tạo job định kỳ (cleanup)

```sql
select cron.schedule(
  'cleanup_old_records',
  '0 3 * * *', -- mỗi ngày 3h sáng
  $$
  delete from subscriptions where is_active = false and renew_date < now() - interval '30 days';
  $$
);
```

### Xem danh sách job

```sql
select * from cron.job;
```

### Xem lịch sử job

```sql
select * from cron.job_run_details order by runid desc limit 10;
```

> 📝 Supabase sẽ tự chạy job này trong nền theo lịch cron.

### Dạng cron schedule

| Biểu thức      | Ý nghĩa               |
| -------------- | --------------------- |
| `* * * * *`    | Mỗi phút              |
| `0 * * * *`    | Mỗi giờ               |
| `0 3 * * *`    | Hằng ngày lúc 3h sáng |
| `*/15 * * * *` | Mỗi 15 phút           |

## 6.4 ⚡ 2️⃣ Edge Functions + Cron Scheduler

Khi job cần **logic phức tạp hơn SQL** (ví dụ: gửi email, gọi API ngoài).

### Tạo Edge Function

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
    // giả lập gửi email
  }

  return new Response("Reminders sent!", { status: 200 });
});
```

### Deploy function

```bash
supabase functions deploy send-reminder
```

### Tạo Cron gọi function

```sql
select cron.schedule(
  'send_reminder_job',
  '0 9 * * *', -- chạy mỗi sáng 9h
  $$
  select net.http_post(
    url := 'https://<project>.functions.supabase.co/send-reminder',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('service_role_key')),
    body := '{}'
  );
  $$
);
```

> 🧠 `pg_net` được Supabase dùng để gọi HTTP request trực tiếp trong DB.

### Log & Debug function

```bash
supabase functions logs --name send-reminder
```

> Bạn sẽ thấy log của từng lần gọi cron job.

## 6.5 📬 3️⃣ Queue với `pgmq`

Khi job cần retry, chia nhỏ task, hoặc xử lý theo hàng đợi.

### Bật extension

```sql
create extension if not exists pgmq;
```

### Tạo queue và push message

```sql
select pgmq.create('email_queue');

select pgmq.send('email_queue', jsonb_build_object(
  'user_id', '00000000-0000-0000-0000-000000000001',
  'subject', 'Subscription Reminder'
));
```

### Consumer đọc queue (Edge Function)

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

### Tạo cron gọi worker

```sql
select cron.schedule(
  'email_worker_cron',
  '*/5 * * * *',
  $$
  select net.http_post(url := 'https://<project>.functions.supabase.co/email-worker');
  $$
);
```

> Worker chạy mỗi 5 phút, xử lý batch 5 message mỗi lần.

## 6.6 🧭 Use-case thực tế gợi ý

| Use-case                         | Gợi ý triển khai        |
| -------------------------------- | ----------------------- |
| Gửi email nhắc hạn               | Edge Function + pg_cron |
| Xóa log cũ / data tạm            | pg_cron thuần SQL       |
| Sync dữ liệu sang external API   | Edge Function + Cron    |
| Gửi hàng loạt thông báo (batch)  | pgmq + worker           |
| Tự động hạ cờ trạng thái expired | pg_cron                 |
| Retry khi job lỗi                | pgmq (retry queue)      |

## 6.7 📊 Monitoring & Debug

### Xem log job

```sql
select * from cron.job_run_details order by start_time desc limit 5;
```

### Xem log Edge Function

```bash
supabase functions logs --name send-reminder
```

### Debug queue

```sql
select * from pgmq.read('email_queue', 10);
```

## 6.8 🧰 Quy ước nội bộ

| Thành phần     | Quy tắc                                                        |
| -------------- | -------------------------------------------------------------- |
| Tên job        | snake_case + suffix `_job` (`cleanup_job`, `email_worker_job`) |
| Thời gian cron | UTC mặc định (ghi rõ trong doc)                                |
| Log            | Luôn `console.log()` hoặc ghi vào bảng `job_log`               |
| Idempotent     | Job phải có thể chạy lại mà không lỗi                          |
| Alert          | Cron fail → gửi log đến Slack/Email (qua Edge Function)        |

## 6.9 🧾 Ví dụ: Job cleanup audit log cũ

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

## 6.10 🧭 Checklist hoàn thành

- [ ] Biết chạy cron SQL bằng `pg_cron`.
- [ ] Tạo được Edge Function và gắn cron scheduler.
- [ ] Hiểu cách dùng `pgmq` để xử lý queue.
- [ ] Gửi email / cleanup / sync job thành công.
- [ ] Biết cách log & debug job run.
- [ ] Áp dụng naming + logging chuẩn nội bộ.

## 6.11 💡 Best Practices nội bộ

1. **Mỗi job → có log riêng** (bảng `job_log` hoặc log function).
2. **Không dùng service key trong FE**, chỉ trong Edge Function / Cron SQL.
3. **Job nên idempotent** - chạy nhiều lần không gây lỗi hoặc trùng dữ liệu.
4. **Đặt timezone UTC** trong cron, convert sang local khi hiển thị.
5. **Không dùng SELECT \* trong job**, chỉ lấy cột cần thiết.
6. **Dùng queue khi job chạy lâu > 30s** để tránh timeout.
7. **Gắn tag "CRON" trong log message** để lọc trong Supabase Logs.
8. **Review job schedule định kỳ** để tránh spam hoặc duplicate task.
9. **Trước khi deploy**: chạy `supabase functions logs --tail` để kiểm tra runtime.
10. **Giới hạn retry** (với pgmq) để tránh job lặp vô hạn.

## 6.12 📚 Tài liệu tham khảo

- [Supabase pg_cron Docs](https://supabase.com/docs/guides/database/extensions/pg-cron)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase pgmq (Message Queue)](https://supabase.com/docs/guides/database/extensions/pgmq)
- [Supabase net/http_post](https://supabase.com/docs/guides/database/extensions/pg-net)

## 6.13 🧾 Output sau phần này

> Sau khi hoàn tất phần 6, dev mới có thể:
>
> - [x] Viết cron job SQL với pg_cron.
> - [x] Tạo Edge Function xử lý background tasks.
> - [x] Thiết lập Cron gọi function tự động.
> - [x] Dùng pgmq để quản lý hàng đợi và retry.
> - [x] Theo dõi log job, debug khi lỗi.
> - [x] Áp dụng quy tắc logging & naming chuẩn nội bộ.
