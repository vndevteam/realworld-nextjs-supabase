# Roadmap

## 1. Lộ trình tiếp cận Supabase + Next.js (tối ưu cho “hiểu nhanh, dạy lại được”)

Mặc định là bạn đã rành Next.js + Postgres + backend truyền thống.

### Phase 0 – Định hình scope & sample project (0.5 ngày)

- Chọn **1 mini-product làm ví dụ xuyên suốt** cho tài liệu/training, ví dụ:

  - “Mini SaaS quản lý subscription”
  - hoặc “Todo app multi-tenant (nhiều công ty, mỗi công ty nhiều user)”

- Yêu cầu nên có:

  - Auth (email/password + OAuth)
  - Multi-tenant / RLS
  - Một vài background job (gửi email nhắc hạn, cleanup, sync,…)
  - Upload file (avatar, document)

- Quy ước luôn: mọi kiến thức Supabase/Next.js đều quy chiếu lại ví dụ này.

> Output: 1 README cho “sample app” – sau này dev mới chỉ cần đọc + run là học.

### Phase 1 – Supabase Fundamentals (1–2 ngày)

Mục tiêu: hiểu Supabase như “Postgres + Auth + Realtime + Storage + Edge Functions”, không xem nó như “black-box BaaS”.

Nội dung:

1. **Tạo project & hiểu console**

   - Tạo project theo quickstart “Getting Started” và Next.js quickstart. ([Supabase][1])
   - Đi qua các tab chính: Database, Auth, Storage, Functions, Cron/Integrations, Logs.

2. **Database & SQL**

   - Tạo schema cho sample app (users, organizations, memberships, tasks/subscriptions…).
   - Làm quen migration (SQL scripts) từ Supabase Dashboard và Supabase CLI. ([Supabase][2])

3. **Auth cơ bản**

   - Email/password, magic link, OAuth (Google/GitHub). ([Supabase][3])
   - Khái niệm **anon key** vs **service role key**, JWT, custom claims.

4. **Row-Level Security (RLS)**

   - Bật RLS, viết policy cơ bản theo `auth.uid()`
   - Ví dụ policies cho:

     - user chỉ xem được data của tổ chức mình
     - admin tổ chức xem tất cả trong org

> Output:
>
> - 1 tài liệu nội bộ: “Supabase Overview cho dev mới” (giới thiệu thành phần + hình kiến trúc).
> - 1 file SQL migration chuẩn (để sau dùng trong CI/CD).

### Phase 2 – Supabase + Next.js Integration (1–3 ngày)

Mục tiêu: thành thạo **App Router + server components + Supabase**.

1. **Thiết lập client & SSR**

   - Theo guide “Use Supabase Auth with Next.js” + “Server-side auth for Next.js”:

     - `@supabase/supabase-js` + `@supabase/ssr` ([Supabase][3])
     - Tách **client-side client** và **server-side client**
     - Dùng middleware / server actions để inject session.

2. **Luồng auth end-to-end**

   - Đăng ký / đăng nhập / logout.
   - Protect route: server components kiểm tra session, redirect nếu chưa login.
   - Lấy profile user + metadata từ DB và hiển thị.

3. **CRUD + RLS flow**

   - Implement CRUD tasks/subscriptions sử dụng:

     - Server Actions (Next.js) gọi Supabase
     - hoặc Route Handlers (`app/api/...`) làm proxy.

   - Thử sai policy RLS để dev mới “cảm” được cơ chế bảo mật.

4. **Realtime & UI**

   - Dùng Supabase Realtime để cập nhật UI real-time (vd: task board). ([Supabase][4])

> Output:
>
> - 1 “Supabase + Next.js Starter” repo nội bộ.
> - Tài liệu “Coding convention: cách gọi Supabase trong Next.js (server/client)”.

### Phase 3 – Batch job, background work & advanced feature (2–4 ngày)

Mục tiêu: trả lời các câu “bài toán truyền thống” theo style Supabase.

1. **Batch job / Cron**
   Có 2 hướng chính:

   - **Cron trong Postgres (Supabase Cron + pg_cron)**

     - Dùng module **Supabase Cron** và extension `pg_cron` để tạo job chạy theo lịch, viết job bằng SQL/PLpgSQL. ([Supabase][5])
     - Use-case: cleanup record, aggregate dữ liệu, sync status,…

   - **Scheduled Edge Functions**

     - Supabase support `pg_cron` + `pg_net` để gọi **Edge Functions** định kỳ, ví dụ 5 phút/lần. ([Supabase][6])
     - Use-case: gọi API bên ngoài, gửi email, sync queue,…

   - Gợi ý trong tài liệu training:

     - “Nếu job thuần DB -> ưu tiên Cron + SQL”
     - “Nếu job cần HTTP external / logic phức tạp -> Edge Function + Cron scheduler”

2. **Queues & async processing**

   - Tìm hiểu Supabase **Queues** (pgmq) – message queue trong Postgres dùng cho xử lý background. ([Supabase][7])
   - Use-case: job nặng (send mail hàng loạt, sync lớn…) -> push vào queue, worker (Edge Function / external worker) consume.

3. **Storage & file handling**

   - Upload avatar / document.
   - Best practices: dùng RLS + signed URL thay vì public bucket.

4. **Webhooks & event-driven**

   - Dùng **Database Webhooks / Trigger -> Edge Functions** để xử lý sự kiện (record inserted/updated -> gửi mail, log, sync).

> Output:
>
> - Tài liệu “Batch job & Background processing với Supabase”.
> - 1–2 ví dụ cụ thể:
>
>   - Cron cleanup data hằng đêm.
>   - Edge Function + Cron gửi email nhắc hạn.

### Phase 4 – DevOps, CI/CD & môi trường (2–3 ngày)

Mục tiêu: hiểu **Supabase CLI, migration, test, deploy**.

1. **Supabase CLI**

   - Cài đặt, `supabase init`, `supabase start` (local), `supabase db push`,… ([Supabase][8])
   - Best practice: treat Supabase config + migrations như **config-as-code**. ([Supabase][9])

2. **CI/CD với GitHub Actions**

   - Dùng **Supabase CLI Action** để chạy migration/tests trên pipeline. ([GitHub][10])
   - Pipeline mẫu:

     - Lint + test Next.js
     - Chạy Supabase test (pgTAP nếu có)
     - Apply migration lên staging/production
     - Deploy Edge Functions (nếu dùng) ([Supabase][11])

3. **Kết hợp deploy Next.js (Vercel, Cloudflare, …)**

   - Dùng env var `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key **không bao giờ** nằm ở FE, chỉ nằm trong backend/Edge Functions/CI.

> Output:
>
> - Tài liệu “CI/CD cho Supabase + Next.js” với YAML mẫu GitHub Actions.
> - Checklist khi tạo môi trường mới (dev/stg/prod).

## 2. So sánh Supabase + Next.js vs Backend truyền thống

Giả sử “truyền thống” = NestJS/Express + Postgres, deploy trên AWS/GCP, tự lo auth, storage, cron, etc.

### 2.1. Về effort implement

**Supabase + Next.js**

- Auth, user table, JWT, password reset, magic link: built-in. ([Supabase][3])
- Realtime, Storage, RLS, Cron, Queues: bật bằng config/SQL + ít code. ([Supabase][4])
- Bạn chủ yếu viết:

  - Schema & RLS (SQL)
  - UI + một ít glue code (Next.js server/client)
  - Edge Functions cho logic đặc biệt

**Backend truyền thống**

- Phải chọn & integrate từng thứ:

  - Auth (JWT, OAuth providers, session management)
  - Job scheduler (BullMQ, cron, Cloud Tasks, EventBridge…)
  - Queues (SQS, RabbitMQ, Kafka,…)
  - Storage (S3 + signed URL)

- Effort ban đầu cao, nhưng:

  - Linh hoạt cho hệ thống lớn, domain phức tạp, cần microservices.

**Kết luận ngắn gọn** (để bỏ vào doc nội bộ):

- **Supabase thắng** về tốc độ dựng MVP, training dev mới, giảm boilerplate backend.
- **Backend truyền thống thắng** khi:

  - Domain phức tạp, long-running computation, heavy integration với hệ thống nội bộ/on-prem.
  - Cần full control infra / multi-region / vendor-neutral.

### 2.2. Về DevOps & vận hành

**Supabase**

- DB, auth, storage, cron, queue, functions: **managed**; scale, backup, observability do Supabase lo chính. ([Supabase][2])
- DevOps tập trung vào:

  - Migrations + versioning
  - CI/CD cho Edge Functions + schema + tests
  - Monitoring logs/traces qua Supabase UI

- Ít “yak shaving” với infra (no RDS, no SQS, no ECS/EKS config…).

**Backend truyền thống**

- Phải lo:

  - Provision DB (RDS/Cloud SQL), networking, security group/VPC.
  - Job runner, message queues, file storage.
  - Observability: Prometheus/Grafana/Loki/Tempo, log shipping,…

- Tốn effort nhưng:

  - Kiểm soát chi tiết infra, tuning performance & cost.

## 3. Khung tài liệu Best Practices + các bài toán nên cover

Bạn có thể thiết kế **1 bộ tài liệu nội bộ** với structure kiểu:

### 3.1. Mục lục gợi ý

1. **Overview**

   - Khi nào nên dùng Supabase, khi nào nên đi backend truyền thống
   - Kiến trúc Supabase + Next.js (diagram)

2. **Project Setup & Environment**

   - Cấu trúc repo (monorepo? FE+infra?)
   - Quy ước `.env`, service role key
   - Pattern multi-environment (dev/stg/prod)

3. **Authentication**

   - Email/password, magic link, OTP, OAuth
   - Luồng auth trong Next.js (App Router, middleware, server components) ([Supabase][12])
   - Session management & refresh token

4. **Authorization (RLS & Roles)**

   - Mapping roles (admin/user/mod) vào JWT claims
   - Pattern multi-tenant:

     - `organization_id` gắn với user + data
     - RLS policy “user chỉ xem được org của mình”

   - Quy ước:

     - “Luôn dùng RLS, không rely chỉ vào code phía Next.js”

5. **Database Design & Migrations**

   - Convention đặt tên schema, table, index, enum
   - Cách viết migration (SQL) và apply qua CLI/CI
   - Seed data cho dev/test

6. **Batch Job / Scheduled Tasks**

   - Khi nào dùng:

     - **Supabase Cron + SQL** (pg_cron)
     - **Cron -> Edge Function**
     - **Queues (pgmq)** cho job dài/nhiều. ([Supabase][5])

   - Ví dụ chuẩn:

     - Cleanup soft-deleted record mỗi ngày
     - Gửi email nhắc trước ngày hết hạn 3 ngày
     - Đồng bộ data sang một hệ thống khác

7. **API & Integration**

   - Khi nào gọi Supabase trực tiếp từ client
   - Khi nào cần một lớp API trung gian (Next.js Route Handlers / external backend).
   - Webhook / event-driven (trigger -> Edge Function).

8. **Storage & File Handling**

   - Quy ước bucket per domain (avatars, documents, logs,…)
   - Dùng signed URL, không public raw.
   - Mapping giữa DB record và file path.

9. **CI/CD & Testing**

   - Pipeline chuẩn cho repo có Supabase + Next.js:

     - Lint & unit test
     - Supabase migration/test (pgTAP) ([Supabase][13])
     - Deploy Edge Functions / apply DB migrations
     - Deploy FE (Vercel/Cloudflare)

   - Testing strategy:

     - Unit test (Next.js + Edge Functions)
     - Integration test với Supabase local (CLI)

10. **Observability & Debugging**

    - Sử dụng log trong Supabase (DB logs, Edge Functions logs, Cron logs). ([Supabase][5])
    - Pattern tracing request: gắn `request_id` xuyên suốt.

11. **Security & Compliance**

    - Bảo vệ service role key
    - Chính sách RLS bắt buộc
    - Rate limit / abuse protection (Edge Functions / middleware).

12. **Performance & Cost**

    - Indexing & query optimization (vẫn là Postgres)
    - Giảm round-trip (ưu tiên RPC/Edge Functions cho logic phức tạp).
    - Gợi ý phân bổ project/môi trường để tối ưu cost.

### 3.2. Những bài toán “truyền thống” nên có example Supabase

Gợi ý các bài toán bạn nên implement song song **2 bản** (Supabase + Next.js vs backend truyền thống) để so effort:

1. **User onboarding & multi-tenant**
2. **Billing-like flow** (subscription, expired, reminder)
3. **Batch job nhắc hạn, cleanup, report**
4. **Upload & access control file**
5. **Webhook từ third-party** (Stripe, GitHub, …)
6. **Internal admin panel** (RBAC + audit log)

Mỗi bài toán, bạn có thể làm 1 bảng nhỏ so sánh:

- Cột 1: Cần làm gì trong backend truyền thống (NestJS + RDS + S3 + cron)
- Cột 2: Cần làm gì với Supabase (feature nào, config gì, code khoảng bao nhiêu)
  => Sau vài bài, bạn sẽ có **“Effort Comparison”** rất dễ training dev mới.

[1]: https://supabase.com/docs/guides/getting-started?utm_source=chatgpt.com "Getting Started | Supabase Docs"
[2]: https://supabase.com/docs?utm_source=chatgpt.com "Supabase Docs"
[3]: https://supabase.com/docs/guides/auth/quickstarts/nextjs?utm_source=chatgpt.com "Use Supabase Auth with Next.js"
[4]: https://supabase.com/docs/guides/realtime/getting_started?utm_source=chatgpt.com "Getting Started with Realtime | Supabase Docs"
[5]: https://supabase.com/docs/guides/cron?utm_source=chatgpt.com "Cron | Supabase Docs"
[6]: https://supabase.com/docs/guides/functions/schedule-functions?utm_source=chatgpt.com "Scheduling Edge Functions | Supabase Docs"
[7]: https://supabase.com/docs/guides/queues/quickstart?utm_source=chatgpt.com "Quickstart | Supabase Docs"
[8]: https://supabase.com/docs/reference/cli/introduction?utm_source=chatgpt.com "CLI Reference | Supabase Docs"
[9]: https://supabase.com/blog/cli-v2-config-as-code?utm_source=chatgpt.com "Supabase CLI v2: Config as Code"
[10]: https://github.com/marketplace/actions/supabase-cli-action?utm_source=chatgpt.com "Supabase CLI Action - GitHub Marketplace"
[11]: https://supabase.com/docs/guides/functions/examples/github-actions?utm_source=chatgpt.com "GitHub Actions | Supabase Docs"
[12]: https://supabase.com/docs/guides/auth/server-side/nextjs?utm_source=chatgpt.com "Setting up Server-Side Auth for Next.js"
[13]: https://supabase.com/docs/guides/deployment/ci/testing?utm_source=chatgpt.com "Automated testing using GitHub Actions | Supabase Docs"
