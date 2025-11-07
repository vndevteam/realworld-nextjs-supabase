# 📚 Phần 14. Tài liệu Tham Khảo

> Mục tiêu: cung cấp danh mục tài nguyên chính thức và thực hành mở rộng, giúp đội ngũ dev duy trì cập nhật kiến thức, best practice, và xu hướng công nghệ.

## 14.1 🧩 Tài liệu chính thức (Official Docs)

| Chủ đề                                 | Đường dẫn                                                                                                                                            | Ghi chú                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Supabase Documentation**             | [https://supabase.com/docs](https://supabase.com/docs)                                                                                               | Trang chủ tài liệu chính thức                                 |
| **Next.js Documentation**              | [https://nextjs.org/docs](https://nextjs.org/docs)                                                                                                   | Tài liệu framework Next.js (App Router, SSR, ISR, Middleware) |
| **Supabase Auth Guide**                | [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)                                                                       | Cấu hình JWT, OAuth, Magic Link, OTP                          |
| **Supabase Row Level Security (RLS)**  | [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)                                 | Cách bật và viết policy bảo mật                               |
| **Supabase CLI Reference**             | [https://supabase.com/docs/reference/cli](https://supabase.com/docs/reference/cli)                                                                   | Tất cả lệnh CLI (link, db push, migrate, function deploy)     |
| **Supabase Edge Functions**            | [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)                                                             | Hướng dẫn viết & deploy Edge Function                         |
| **Supabase Storage**                   | [https://supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)                                                                 | Upload, signed URL, bucket policy                             |
| **Supabase Realtime**                  | [https://supabase.com/docs/guides/realtime](https://supabase.com/docs/guides/realtime)                                                               | Streaming dữ liệu theo thời gian thực                         |
| **Supabase Database Extensions**       | [https://supabase.com/docs/guides/database/extensions](https://supabase.com/docs/guides/database/extensions)                                         | pg_cron, pg_net, pgmq, vector, v.v.                           |
| **Supabase API Reference (PostgREST)** | [https://supabase.com/docs/reference/javascript/select](https://supabase.com/docs/reference/javascript/select)                                       | API client và cú pháp query                                   |
| **Supabase Pricing Overview**          | [https://supabase.com/pricing](https://supabase.com/pricing)                                                                                         | Chi tiết plan, quota và chi phí                               |
| **Next.js Deployment**                 | [https://vercel.com/docs/deployments/overview](https://vercel.com/docs/deployments/overview)                                                         | Deploy Next.js trên Vercel                                    |
| **Next.js Middleware & Edge Runtime**  | [https://nextjs.org/docs/app/building-your-application/routing/middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) | Cấu hình bảo mật và middleware                                |
| **NextAuth.js (Optional)**             | [https://next-auth.js.org](https://next-auth.js.org)                                                                                                 | Nếu tích hợp auth ngoài Supabase                              |

## 14.2 ⚙️ Công cụ & Thư viện hữu ích

| Mục đích             | Công cụ / Package                              | Ghi chú                              |
| -------------------- | ---------------------------------------------- | ------------------------------------ |
| Supabase CLI         | `@supabase/cli`                                | Dùng cho migration, deploy function  |
| Supabase JS Client   | `@supabase/supabase-js`                        | SDK chính dùng trong Next.js         |
| Supabase SSR         | `@supabase/ssr`                                | Hỗ trợ auth cho App Router SSR       |
| Monitoring / Tracing | `@opentelemetry/api`, `tempo`, `grafana-agent` | Thu thập trace end-to-end            |
| Error Tracking       | `@sentry/nextjs`                               | Gửi lỗi từ Edge & FE lên Sentry      |
| Task Queue           | `pgmq`                                         | Queue native trong Postgres          |
| Scheduler            | `pg_cron`                                      | Lên lịch job định kỳ                 |
| HTTP call trong SQL  | `pg_net`                                       | Gửi request API từ trigger DB        |
| Vector Search        | `pgvector`                                     | Lưu embedding, dùng cho AI search    |
| Infrastructure IaC   | Terraform, Pulumi                              | Tự động hóa deploy Supabase project  |
| CI/CD                | GitHub Actions                                 | Triển khai build-test-deploy tự động |
| Visualization        | Grafana, Metabase                              | Tạo dashboard phân tích dữ liệu      |
| Performance test     | K6, JMeter                                     | Load test và benchmark Edge Function |

## 14.3 🧠 Blog & Case Study (Chính thức từ Supabase)

| Chủ đề                          | Đường dẫn                                                                                                          | Ghi chú                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| **Supabase Launch Weeks**       | [https://supabase.com/blog/tag/launch-week](https://supabase.com/blog/tag/launch-week)                             | Tổng hợp cập nhật hàng quý |
| **Supabase vs Firebase**        | [https://supabase.com/blog/supabase-vs-firebase](https://supabase.com/blog/supabase-vs-firebase)                   | So sánh chi tiết           |
| **Building SaaS with Supabase** | [https://supabase.com/blog/saas-starter-kit](https://supabase.com/blog/saas-starter-kit)                           | Tạo SaaS app full stack    |
| **Using pgmq for job queue**    | [https://supabase.com/blog/pgmq-introduction](https://supabase.com/blog/pgmq-introduction)                         | Queue trong Postgres       |
| **Edge Functions Tips**         | [https://supabase.com/blog/edge-functions-best-practices](https://supabase.com/blog/edge-functions-best-practices) | Tối ưu function runtime    |
| **Postgres Performance Tuning** | [https://supabase.com/blog/postgres-performance-tuning](https://supabase.com/blog/postgres-performance-tuning)     | Tối ưu query & index       |
| **Auth Deep Dive**              | [https://supabase.com/blog/supabase-auth-deep-dive](https://supabase.com/blog/supabase-auth-deep-dive)             | Phân tích nội bộ GoTrue    |
| **RLS Patterns**                | [https://supabase.com/blog/row-level-security-patterns](https://supabase.com/blog/row-level-security-patterns)     | Các mẫu policy phổ biến    |

## 14.4 🎓 Tài nguyên học tập & Video

| Chủ đề                                   | Nguồn                                                                                                      | Ghi chú                               |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Supabase Crash Course (FreeCodeCamp)** | [YouTube - FreeCodeCamp](https://www.youtube.com/watch?v=2x0m1NjyR9E)                                      | Khoá học toàn diện Supabase + Next.js |
| **Next.js 15 (App Router)**              | [YouTube - Traversy Media](https://www.youtube.com/watch?v=ZVnjOPwW4ZA)                                    | Cập nhật App Router, SSR, ISR         |
| **Supabase Edge Functions Live Demo**    | [YouTube - Supabase](https://www.youtube.com/@supabase)                                                    | Demo function, storage, auth          |
| **Auth & RLS Workshop**                  | [Supabase Live Workshop](https://www.youtube.com/watch?v=Z-Nl1xA1IYQ)                                      | Xây dựng auth an toàn với RLS         |
| **pgvector for AI Search**               | [YouTube - Supabase AI Playlist](https://www.youtube.com/playlist?list=PL5P6qYJ2Sl6Ym2X-ZqL6FXR3vWqC1u-M1) | Dựng AI app với pgvector              |
| **Deploy with Supabase CLI**             | [Supabase CLI Walkthrough](https://www.youtube.com/watch?v=OZzL4k6kRLo)                                    | Hướng dẫn chi tiết                    |
| **Performance Testing (K6)**             | [Grafana K6 YouTube](https://www.youtube.com/@k6-load-testing)                                             | Tối ưu Edge Function / API latency    |

## 14.5 🧮 Cộng đồng & Kênh thảo luận

| Nguồn                           | Đường dẫn                                                                                            | Ghi chú                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| **Supabase Discord**            | [https://discord.supabase.com](https://discord.supabase.com)                                         | Cộng đồng dev toàn cầu          |
| **Supabase GitHub Discussions** | [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions) | Thảo luận & Q&A kỹ thuật        |
| **Reddit r/Supabase**           | [https://reddit.com/r/Supabase](https://reddit.com/r/Supabase)                                       | Trao đổi use case & kinh nghiệm |
| **Supabase Status Page**        | [https://status.supabase.com](https://status.supabase.com)                                           | Theo dõi uptime hệ thống        |
| **Next.js Discord**             | [https://discord.gg/nextjs](https://discord.gg/nextjs)                                               | Cộng đồng Next.js chính thức    |

## 14.6 🧩 Template & Boilerplate Repositories

| Tên repo                                        | Mô tả                                   | Link                                                                                                                             |
| ----------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **supabase/supabase**                           | Mã nguồn open-source chính thức         | [https://github.com/supabase/supabase](https://github.com/supabase/supabase)                                                     |
| **supabase/supabase-js**                        | SDK JavaScript chính thức               | [https://github.com/supabase/supabase-js](https://github.com/supabase/supabase-js)                                               |
| **supabase-community/supabase-nextjs-template** | Template Supabase + Next.js 14/15       | [https://github.com/supabase-community/supabase-nextjs-template](https://github.com/supabase-community/supabase-nextjs-template) |
| **vercel/nextjs-postgres-starter**              | Template Next.js + Postgres             | [https://github.com/vercel/nextjs-postgres-starter](https://github.com/vercel/nextjs-postgres-starter)                           |
| **openstatusHQ/openstatus**                     | SaaS monitoring app built with Supabase | [https://github.com/openstatusHQ/openstatus](https://github.com/openstatusHQ/openstatus)                                         |
| **pgvector/supabase-ai-demo**                   | Supabase + pgvector AI example          | [https://github.com/supabase-community/pgvector-demo](https://github.com/supabase-community/pgvector-demo)                       |

## 14.7 🧠 Tài liệu chuyên sâu về PostgreSQL

| Chủ đề                       | Đường dẫn                                                                                                                      | Ghi chú                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| **Postgres Documentation**   | [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)                                                           | Tài liệu gốc                      |
| **RLS & Security Policies**  | [https://www.postgresql.org/docs/current/ddl-rowsecurity.html](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)   | RLS nguyên bản                    |
| **EXPLAIN & Query Planning** | [https://www.postgresql.org/docs/current/using-explain.html](https://www.postgresql.org/docs/current/using-explain.html)       | Hiểu cơ chế query planner         |
| **Extensions Ecosystem**     | [https://pgxn.org/](https://pgxn.org/)                                                                                         | Tìm và cài extension              |
| **Partitioning Guide**       | [https://www.postgresql.org/docs/current/ddl-partitioning.html](https://www.postgresql.org/docs/current/ddl-partitioning.html) | Chia bảng theo thời gian / tenant |

## 14.8 💼 Các công ty đang dùng Supabase

| Công ty / Tổ chức                              | Ứng dụng                      | Ghi chú                       |
| ---------------------------------------------- | ----------------------------- | ----------------------------- |
| **Hashnode**                                   | Social Blog platform          | Dùng Supabase Realtime + Auth |
| **OpenStatus**                                 | Uptime & monitoring           | Edge Function + pgmq          |
| **Snaplet**                                    | Data snapshot tool            | Supabase DB clone             |
| **Chatbase / Documate**                        | AI chatbot platform           | Supabase + pgvector           |
| **Xata & Convex**                              | Kết hợp với Supabase plugin   | Hybrid SaaS use case          |
| **Sun\* / Laughter Platform** _(ví dụ nội bộ)_ | MVP quản lý property/contract | Supabase làm backend MVP      |

## 14.9 🔬 Hướng tự học nâng cao

| Chủ đề                            | Mục tiêu                             |
| --------------------------------- | ------------------------------------ |
| **PostgreSQL internals**          | Hiểu sâu optimizer, planner, locking |
| **Edge compute & Deno runtime**   | Viết Edge Function tối ưu            |
| **Supabase self-hosted stack**    | Triển khai on-prem hoặc hybrid       |
| **AI / pgvector**                 | Xây search engine, semantic filter   |
| **OTEL & Observability**          | Xây tracing toàn hệ thống            |
| **Multi-tenant RLS pattern**      | Isolation cho SaaS enterprise        |
| **Terraform + Supabase Provider** | IaC cho Supabase project             |

## 14.10 📘 Đề xuất lộ trình học nâng cao

| Giai đoạn    | Trọng tâm                         | Kết quả mong đợi              |
| ------------ | --------------------------------- | ----------------------------- |
| **Tuần 1–2** | Ôn tập RLS, Auth, Policy nâng cao | Tự viết policy phức tạp       |
| **Tuần 3–4** | Edge Functions & CI/CD            | Deploy pipeline hoàn chỉnh    |
| **Tháng 2**  | OTEL + Sentry + Logging           | Có dashboard trace/log        |
| **Tháng 3**  | pgvector + AI integration         | Search & LLM demo             |
| **Tháng 4+** | Self-host Supabase & IaC          | Setup Supabase riêng cho team |

## 14.11 🧾 Kết luận

> Phần “Tài liệu tham khảo” không chỉ là danh sách link,
> mà là **bản đồ học tập mở rộng** để bạn và team có thể tiếp tục nghiên cứu, thử nghiệm và chia sẻ kiến thức.

✅ Sau khi hoàn thành toàn bộ 14 phần:

- Bạn đã nắm vững nền tảng Supabase + Next.js,
- Có thể triển khai, vận hành, bảo mật, tối ưu,
- Và tiếp tục mở rộng lên cấp độ **senior / architect** với khả năng tích hợp AI, observability, multi-tenant, và self-hosted infrastructure.
