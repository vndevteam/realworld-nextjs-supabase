# Supabase + Next.js Onboarding Guide

Mục tiêu của bộ tài liệu:

> - Giúp dev mới hiểu Supabase nhanh, có khả năng tự build MVP trong vài ngày.
> - Làm chuẩn nội bộ để scale đội dev, dễ dàng onboard người mới hoặc so sánh effort với backend truyền thống.
> - Làm cơ sở cho future best-practices (batch job, auth, RLS, CI/CD,…).

## 🏁 Phần 0. Giới thiệu & Tổng quan

1. **Mục tiêu của tài liệu**

   - Mục tiêu training (learning outcomes)
   - Đối tượng (dev frontend, fullstack, backend, intern,…)
   - Cách đọc tài liệu: theo tuần / theo module

2. **Kiến trúc tổng quan Supabase + Next.js**

   - Diagram: Next.js (App Router) ↔ Supabase (DB + Auth + Storage + Functions)
   - Giải thích các thành phần chính:

     - Database (Postgres)
     - Auth
     - Storage
     - Edge Functions
     - Cron & Queue
     - Realtime

   - So sánh nhanh với backend truyền thống (NestJS, Express, Postgres, S3,…)

3. **Case study xuyên suốt (Sample App)**

   - Giới thiệu app mẫu (ví dụ: “Subscription Manager”)
   - Các tính năng sẽ triển khai: Auth, CRUD, Batch Job, Upload, Cron
   - Cấu trúc thư mục, flow học tập theo từng module

## 🧱 Phần 1. Cài đặt & Chuẩn bị môi trường

1. **Cài đặt công cụ**

   - Node.js / pnpm / npm
   - Supabase CLI (`supabase login`, `supabase start`, …)
   - VSCode plugins (SQLTools, Supabase, etc.)

2. **Khởi tạo project**

   - `npx create-next-app`
   - `npx supabase init`
   - Cấu hình `.env` (Supabase URL, Anon Key)
   - Kết nối thử với Supabase SDK

3. **Chạy Supabase local**

   - `supabase start`, truy cập [http://localhost:54323](http://localhost:54323)
   - Tạo user, test Auth
   - Mô phỏng local dev environment hoàn chỉnh

4. **Cấu trúc thư mục đề xuất**

   - `/app` – Next.js App Router
   - `/lib` – Supabase client, hooks
   - `/supabase` – migrations, policies, seeds
   - `/scripts` – batch jobs, automation

## 🔐 Phần 2. Authentication

1. **Kiến trúc Auth của Supabase**

   - Giải thích cơ chế JWT, `auth.uid()`
   - Anon key vs Service role key
   - Sign in/out flow

2. **Triển khai Auth với Next.js**

   - `@supabase/supabase-js` & `@supabase/ssr`
   - Tạo Supabase client cho:

     - Client-side (browser)
     - Server-side (SSR)

   - Middleware bảo vệ routes (`middleware.ts`)

3. **Các loại đăng nhập**

   - Email/password
   - Magic link
   - OAuth (Google, GitHub)
   - OTP (SMS/Email OTP nếu cần)

4. **Quản lý session**

   - Lưu session vào cookie (server component)
   - Refresh token
   - Logout / Revalidate session

5. **Tùy biến Auth**

   - Custom user metadata
   - Hooks `auth.users` → `profile` table sync
   - Best practice: sync user profile bằng trigger hoặc Edge Function

## 🔑 Phần 3. Authorization (RLS & Policy)

1. **Giới thiệu RLS (Row-Level Security)**

   - RLS là gì và vì sao Supabase “an toàn mặc định”
   - Cấu hình RLS trên table

2. **Viết Policy cơ bản**

   - SELECT / INSERT / UPDATE / DELETE
   - Sử dụng `auth.uid()`
   - Ví dụ: “User chỉ xem được task của chính mình”

3. **Tổ chức Role & Permission**

   - Mapping role vào JWT claim
   - Multi-tenant design: `organization_id`
   - Admin / Owner / Member policy

4. **Best Practices**

   - “Always RLS On”
   - Test policy trước khi code (SQL playground)
   - Quy ước viết file policy.sql / migration.sql

## 💾 Phần 4. Database & Migrations

1. **Thiết kế schema**

   - Ví dụ bảng `users`, `organizations`, `memberships`, `tasks`
   - Sử dụng enum, index, constraint
   - Naming convention

2. **Migrations với Supabase CLI**

   - `supabase db push`
   - `supabase migration new add_tasks_table`
   - Quản lý migration file, version control

3. **Seeding & data mẫu**

   - `supabase db seed`
   - Script tạo dữ liệu cho môi trường dev/test

4. **Query & Performance**

   - RPC function
   - Caching (Next.js revalidate tag)
   - Dùng `explain analyze` để kiểm tra query

## 🌐 Phần 5. Supabase + Next.js Integration

1. **Next.js App Router với Supabase**

   - Cách gọi Supabase từ server component
   - Dùng Server Action để CRUD
   - Protect route (redirect nếu chưa đăng nhập)

2. **Realtime Subscription**

   - Realtime setup (`supabase.channel`)
   - Cập nhật UI khi có thay đổi DB
   - Ví dụ: Task board realtime

3. **Storage (Upload & Access Control)**

   - Tạo bucket, config policy
   - Upload file, lấy signed URL
   - Bảo mật: user chỉ xem được file của mình

4. **Edge Functions**

   - Khi nào nên dùng
   - Viết Edge Function (`supabase functions new send-email`)
   - Test và deploy Edge Function
   - Gọi Edge Function từ Next.js (client/server)

## ⏰ Phần 6. Batch Job & Background Tasks

1. **Batch job với pg_cron**

   - Cài extension `pg_cron`
   - Tạo job định kỳ (cleanup, sync, aggregate)
   - Best practice cho cron trong DB

2. **Edge Function + Cron Scheduler**

   - Tạo Edge Function và đăng ký Cron job
   - Use case: gửi email reminder

3. **Queues (pgmq)**

   - Cài extension pgmq
   - Push / Consume job
   - Pattern: async processing trong Supabase

4. **So sánh Cron vs Queue**

   - Cron → định kỳ
   - Queue → theo sự kiện (event-driven)

5. **Monitoring job**

   - Logs trong Supabase dashboard
   - Retry / failure tracking

## 🧩 Phần 7. API & Integration Patterns

1. **Direct Query vs API Proxy**

   - Khi nào FE gọi Supabase trực tiếp
   - Khi nào nên có lớp API trung gian (Route Handler / Function)

2. **Webhooks**

   - Tạo DB trigger → gọi Edge Function
   - Ví dụ: khi user đăng ký → gửi email chào mừng

3. **Integration bên thứ ba**

   - Stripe / GitHub / Slack webhook
   - Best practice lưu audit log

## ⚙️ Phần 8. CI/CD & DevOps

1. **Supabase CLI trong pipeline**

   - Login bằng token
   - Run migration, test, deploy function
   - Ví dụ YAML GitHub Actions

2. **Environment management**

   - Dev / Staging / Prod setup
   - Quy ước env key & secrets
   - Sync schema giữa các môi trường

3. **Deploy Next.js**

   - Vercel / Cloudflare / Render
   - Kết nối với Supabase project
   - Zero-downtime deployment

4. **Testing**

   - Unit test Next.js logic
   - Integration test với Supabase local
   - Mock Supabase trong Jest

## 🔍 Phần 9. Observability & Debugging

1. **Logs**

   - Database logs
   - Edge Function logs
   - Cron / Queue logs

2. **Tracing request**

   - Gắn `request_id` xuyên suốt
   - Tracking error

3. **Monitoring**

   - Alert email / Slack khi job fail
   - Metrics cơ bản (API latency, job duration,…)

## 🔒 Phần 10. Security Best Practices

1. **API key & secret**

   - Quản lý Anon key / Service role key
   - Không bao giờ expose service key lên client

2. **RLS bắt buộc**

   - Checklist RLS khi tạo bảng mới
   - Cách test policy nhanh

3. **Rate limiting & abuse**

   - Dùng Edge Function middleware
   - Logging và detect spam

## 💰 Phần 11. Cost & Performance Optimization

1. **Tối ưu chi phí**

   - Cấu hình Supabase plan hợp lý
   - Sử dụng Storage & Realtime tiết kiệm

2. **Tối ưu performance**

   - Index / query tuning
   - Cache layer trong Next.js
   - Khi nào nên chuyển logic sang Edge Function

3. **Benchmark**

   - So sánh performance CRUD Supabase vs API backend truyền thống

## 📊 Phần 12. So sánh với Techstack truyền thống

| Hạng mục       | Supabase + Next.js      | Backend truyền thống  |
| -------------- | ----------------------- | --------------------- |
| Auth           | Built-in                | Phải code + DB        |
| Storage        | Built-in                | Tự config S3          |
| Cron / Batch   | pg_cron / Edge Function | Bull / Cloud Tasks    |
| Queue          | pgmq                    | Redis / SQS           |
| Realtime       | Có sẵn                  | WebSocket / Socket.IO |
| DevOps         | CLI + Dashboard         | Tự setup infra        |
| Cost khởi điểm | Rất thấp                | Trung bình – cao      |
| Scaling lớn    | Giới hạn vendor         | Tự do control         |

## 🧠 Phần 13. Phụ lục (Advanced)

1. **Multi-project / Monorepo**

   - Tích hợp nhiều Supabase project
   - Tách environment

2. **Custom Postgres extension**

   - Dùng `pgvector`, `postgis`, `citext`, `pg_partman`

3. **Analytics & AI integration**

   - Sử dụng Supabase Vector
   - Query embedding / RAG pattern

4. **Troubleshooting**

   - Các lỗi thường gặp (RLS deny, token expired,…)
   - Checklist debug

## 📎 Phần 14. Tài liệu tham khảo

- Supabase Docs (database, auth, cron, queue, cli, function)
- Next.js App Router Docs
- Example repo (Supabase + Next.js Starter)
- Nội bộ:

  - `supabase_onboarding.md`
  - `supabase_best_practices.sql`
  - `github-actions-supabase.yml`
