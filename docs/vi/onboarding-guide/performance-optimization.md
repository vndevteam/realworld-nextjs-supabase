# 💰 Phần 11. Cost & Performance Optimization

> Mục tiêu: tối ưu chi phí (compute, storage, logs) và hiệu năng (query, cache, function) của hệ thống Supabase + Next.js mà không đánh đổi tính bảo mật hay ổn định.

---

## 11.1 🎯 Mục tiêu học phần

Sau khi hoàn thành phần này, dev có thể:

- Đọc và phân tích chi phí Supabase từng phần (DB, Function, Storage, Realtime).
- Tối ưu query, index, và caching hợp lý.
- Giảm chi phí vận hành qua cron batch, cold start, và log retention.
- So sánh chi phí – effort với backend truyền thống (NestJS / Spring Boot).
- Xây dựng guideline nội bộ để dự đoán cost.

---

## 11.2 🧩 Tổng quan các yếu tố ảnh hưởng đến chi phí

| Thành phần         | Chi phí ảnh hưởng bởi                    | Cách tối ưu                       |
| ------------------ | ---------------------------------------- | --------------------------------- |
| **Database**       | row count, query, connection, index size | optimize query + index đúng cách  |
| **Storage**        | số lượng file, dung lượng, signed URL    | xóa file cũ, resize ảnh, gzip     |
| **Edge Functions** | số lần invoke, thời gian chạy            | batching + schedule hợp lý        |
| **Realtime**       | số client + subscription                 | giới hạn kênh, phân luồng         |
| **pg_cron / pgmq** | job frequency, batch size                | cron ít thường xuyên hơn          |
| **Logs**           | retention & volume                       | xóa log cũ, log structured        |
| **CDN / Frontend** | build, bandwidth, SSR load               | static caching, ISR, Edge caching |

---

## 11.3 ⚙️ Database Optimization

### 🔹 1️⃣ Tối ưu truy vấn (SQL)

**Dấu hiệu query chậm:**

- Dùng `SELECT *` hoặc `JOIN` quá nhiều bảng
- Không có index ở cột `WHERE` / `ORDER BY`
- Tải dữ liệu lớn không paginate

### ✅ Giải pháp

```sql
-- Thay SELECT * bằng cột cụ thể
select id, service_name, price from subscriptions;

-- Thêm index cho các cột lọc thường xuyên
create index idx_subscriptions_user_id on subscriptions(user_id);

-- Pagination an toàn
select * from subscriptions
where user_id = 'xxx'
order by created_at desc
limit 20 offset 0;
```

### 🔹 2️⃣ Caching query

- Dùng **Edge Function** hoặc **Server Action** để cache query tĩnh:

```ts
export const revalidate = 60; // cache 1 phút
```

- Supabase API có thể gắn Cloudflare cache (nếu chỉ đọc public data).

---

## 11.4 🧮 Index & Table Size Management

### 🔹 Kiểm tra index lớn / dư thừa

```sql
select indexrelid::regclass as index_name,
       pg_size_pretty(pg_relation_size(indexrelid)) as index_size
from pg_index join pg_class on pg_class.oid = pg_index.indrelid
order by pg_relation_size(indexrelid) desc;
```

### 🔹 Xóa index dư

```sql
drop index if exists idx_old_unused;
```

### 🔹 Dọn bảng tạm / log cũ

```sql
delete from system_logs where created_at < now() - interval '30 days';
vacuum analyze system_logs;
```

> 🧠 “vacuum analyze” giúp giảm dung lượng disk và tối ưu plan query.

---

## 11.5 ⚡ Edge Function Performance

### 🔹 1️⃣ Cold Start

- Supabase Edge Functions có latency khởi động 100–500ms lần đầu.
- Giảm bằng cách:

  - Giữ function nhỏ gọn, ít dependency.
  - Không import module nặng (Stripe SDK → dùng REST trực tiếp).
  - Dùng **Deno Deploy global cache** (Supabase tự optimize).

### 🔹 2️⃣ Batch requests

Thay vì gọi API liên tục từng record:

```ts
await supabase.from("payments").insert(batchData);
```

### 🔹 3️⃣ Timeouts

- Giới hạn thời gian function < 10s (Supabase free tier max ~20s).
- Nếu cần chạy dài → đưa vào **pgmq worker** hoặc batch cron.

---

## 11.6 🧰 pg_cron & Batch Optimization

| Tình huống                 | Giải pháp                                         |
| -------------------------- | ------------------------------------------------- |
| Cron chạy quá thường xuyên | Tăng interval (15 → 60 phút)                      |
| Job xử lý nhiều record     | Chia nhỏ batch: `limit 1000 offset n`             |
| Job thất bại lặp lại       | Gắn retry logic qua pgmq                          |
| Log cron quá nhiều         | Giới hạn log giữ 7 ngày                           |
| Function chạy cron         | Gọi bằng `net.http_post` thay vì loop client-side |

---

## 11.7 🧱 Realtime Optimization

### ⚠️ Realtime tốn tài nguyên theo số subscription

- Mỗi client mở 1 channel ~1 WebSocket.
- Tối đa 200 concurrent trên free tier.

### ✅ Giải pháp

- Gộp channel: `public:subscriptions` → truyền filter trong client.
- Hủy subscribe khi rời trang:

```ts
useEffect(() => {
  const channel = supabase.channel("subscriptions");
  return () => supabase.removeChannel(channel);
}, []);
```

- Chỉ bật realtime với bảng cần thiết.
- Batch UI update (debounce 1–2s).

---

## 11.8 🧩 Storage Optimization

| Vấn đề                 | Giải pháp                          |
| ---------------------- | ---------------------------------- |
| File lớn tốn bandwidth | Resize ảnh, nén trước upload       |
| Dữ liệu trùng lặp      | Hash checksum để detect trùng file |
| File không dùng        | Tạo cron cleanup bucket cũ         |
| Download public nhiều  | Dùng signed URL + CDN caching      |
| Bucket logs            | Xóa file log định kỳ (14–30 ngày)  |

### SQL Cleanup ví dụ

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

| Thành phần             | Giải pháp                                 |
| ---------------------- | ----------------------------------------- |
| **SSR pages**          | Dùng `revalidate` hoặc ISR để cache tĩnh  |
| **Static assets**      | Host qua CDN (Vercel / Cloudflare)        |
| **Large bundle**       | Dùng dynamic import, tránh import SDK lớn |
| **API calls**          | Prefetch và cache trên server             |
| **Image optimization** | `next/image` + blurDataURL                |
| **Suspense**           | Tránh blocking render (React 18)          |

### Ví dụ

```tsx
export const revalidate = 300; // cache 5 phút
```

---

## 11.10 💾 Log & Retention Optimization

| Loại log         | Giữ bao lâu | Ghi chú           |
| ---------------- | ----------- | ----------------- |
| Edge Function    | 7 ngày      | xóa tự động       |
| Database logs    | 14 ngày     | có thể export S3  |
| System log table | 30 ngày     | cleanup cron      |
| Realtime event   | 3–7 ngày    | tùy traffic       |
| CI/CD logs       | 14 ngày     | GitHub tự cleanup |

```sql
delete from system_logs where created_at < now() - interval '30 days';
```

> ⚠️ Không nên lưu trace log quá lâu nếu không cần — tốn chi phí và giảm tốc độ query.

---

## 11.11 📊 Giám sát hiệu năng định kỳ

### 🔹 Dùng dashboard Supabase

- Theo dõi CPU, memory, I/O, query time
- Tab **Database → Performance Insights**

### 🔹 Dùng `pg_stat_statements`

```sql
select query, mean_exec_time, calls
from pg_stat_statements
order by mean_exec_time desc limit 5;
```

### 🔹 Kết hợp logging function + metrics table

```sql
insert into perf_metrics (name, duration_ms, at)
values ('send_reminder_job', 125, now());
```

---

## 11.12 💰 So sánh chi phí Supabase-first vs Backend truyền thống

| Tiêu chí               | Supabase + Next.js         | Backend truyền thống (NestJS, Spring Boot) |
| ---------------------- | -------------------------- | ------------------------------------------ |
| **Infra setup**        | 0 (fully managed)          | Tốn setup EC2, DB, networking              |
| **Database scaling**   | Auto-managed               | Manual RDS tuning                          |
| **Auth / Storage**     | Có sẵn (Auth, Storage API) | Tự code / cấu hình riêng                   |
| **Cron / Queue**       | pg_cron / pgmq built-in    | Cần worker (Celery, BullMQ)                |
| **CI/CD**              | CLI + GitHub Actions       | Jenkins / custom pipeline                  |
| **Ops overhead**       | Rất thấp                   | Cao, cần DevOps engineer                   |
| **Chi phí khởi điểm**  | ~25–50 USD/tháng           | ~70–150 USD/tháng                          |
| **Chi phí theo scale** | Linear (tăng theo usage)   | Exponential (compute + EBS)                |
| **Cold start latency** | 100–500ms (Edge)           | 10–50ms (EC2/ECS)                          |
| **Maintainability**    | Rất cao                    | Trung bình                                 |
| **Tổng Effort DevOps** | ↓ 70–80%                   | baseline 100%                              |

---

## 11.13 🧭 Checklist tối ưu chi phí & hiệu năng

| Mục                                           | Trạng thái |
| --------------------------------------------- | ---------- |
| 🔹 Index đúng cột, tránh dư thừa              | ☐          |
| 🔹 Dọn bảng log / storage cũ định kỳ          | ☐          |
| 🔹 Bật cache SSR / Edge                       | ☐          |
| 🔹 Cron & job chạy hợp lý (không quá dày)     | ☐          |
| 🔹 Gộp realtime channel                       | ☐          |
| 🔹 Resize & nén file upload                   | ☐          |
| 🔹 Không log text thừa / dump data            | ☐          |
| 🔹 Monitor query slow bằng pg_stat_statements | ☐          |
| 🔹 Theo dõi cost dashboard Supabase           | ☐          |
| 🔹 Giữ performance report hàng tuần           | ☐          |

---

## 11.14 💡 Best Practices nội bộ

1. **Luôn đo performance bằng metrics thay vì cảm giác.**
2. **Không optimize sớm — chỉ optimize khi có dữ liệu.**
3. **Đặt cron & function chạy ngoài giờ cao điểm.**
4. **Prefetch và paginate thay vì tải bulk.**
5. **Tách bảng log ra schema riêng (`log.*`) để dễ cleanup.**
6. **Giữ index nhỏ, kiểm tra monthly.**
7. **Dùng cache layer (ISR / Edge caching) cho route công khai.**
8. **Luôn có bảng cost_summary nội bộ (theo tháng).**
9. **Luôn review chi phí Storage & Realtime trước khi scale plan.**
10. **Chạy load test nhẹ trước mỗi version lớn.**

---

## 11.15 📚 Tài liệu tham khảo

- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Performance Tuning Guide](https://supabase.com/docs/guides/database/performance)
- [Postgres EXPLAIN Tutorial](https://www.postgresql.org/docs/current/using-explain.html)
- [Next.js Performance Optimization](https://nextjs.org/docs/optimizing)
- [pg_stat_statements Overview](https://supabase.com/docs/guides/database/extensions/pg-stat-statements)

---

## 11.16 🧾 Output sau phần này

> Sau khi hoàn tất phần 11, dev mới sẽ có thể:
>
> - [x] Giảm chi phí Supabase & Vercel đáng kể nhờ cleanup & caching.
> - [x] Tối ưu query, index, và cron job hiệu quả.
> - [x] Xây dựng report theo dõi cost định kỳ.
> - [x] Hiểu sự đánh đổi giữa tốc độ và chi phí.
> - [x] Giữ hệ thống Supabase + Next.js nhanh, rẻ và bền vững.
