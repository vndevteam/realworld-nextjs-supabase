# Phần 14. Tài liệu Tham Khảo

> Mục tiêu: cung cấp danh mục tài nguyên chính thức và các kinh nghiệm thực tiễn mở rộng, giúp đội ngũ dev luôn nắm bắt kịp thời kiến thức, best practice, và xu hướng công nghệ.

## 14.1 🧩 Tài liệu chính thức (Official Docs)

| Chủ đề                                            | Đường dẫn                                                               | Ghi chú                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Supabase Documentation**                        | <https://supabase.com/docs>                                             | Trang chủ tài liệu chính thức                                 |
| **Next.js Documentation**                         | <https://nextjs.org/docs>                                               | Tài liệu framework Next.js (App Router, SSR, ISR, Middleware) |
| **Supabase Auth Guide**                           | <https://supabase.com/docs/guides/auth>                                 | Cấu hình JWT, OAuth, Magic Link, OTP                          |
| **Supabase Row Level Security (RLS)**             | <https://supabase.com/docs/guides/database/postgres/row-level-security> | Cách bật và viết policy bảo mật                               |
| **Supabase CLI Reference**                        | <https://supabase.com/docs/reference/cli>                               | Tất cả lệnh CLI (link, db push, migrate, function deploy)     |
| **Supabase Edge Functions**                       | <https://supabase.com/docs/guides/functions>                            | Hướng dẫn viết & deploy Edge Function                         |
| **Supabase Storage**                              | <https://supabase.com/docs/guides/storage>                              | Upload, signed URL, bucket policy                             |
| **Supabase Realtime**                             | <https://supabase.com/docs/guides/realtime>                             | Streaming dữ liệu theo thời gian thực                         |
| **Supabase Database Extensions**                  | <https://supabase.com/docs/guides/database/extensions>                  | pg_cron, pg_net, pgmq, vector, v.v.                           |
| **Supabase API Reference (PostgREST)**            | <https://supabase.com/docs/reference/javascript/select>                 | API client và cú pháp query                                   |
| **Supabase Pricing Overview**                     | <https://supabase.com/pricing>                                          | Chi tiết plan, quota và chi phí                               |
| **Next.js Deployment**                            | <https://vercel.com/docs/deployments>                                   | Deploy Next.js trên Vercel                                    |
| **Next.js Proxy (Old Middleware) & Edge Runtime** | <https://nextjs.org/docs/app/api-reference/file-conventions/proxy>      | Cấu hình bảo mật và proxy (middleware cũ)                     |
| **NextAuth.js (Optional)**                        | <https://next-auth.js.org>                                              | Nếu tích hợp auth ngoài Supabase                              |

## 14.2 ⚙️ Công cụ & Thư viện hữu ích

| Mục đích             | Công cụ / Package       | Ghi chú                              |
| -------------------- | ----------------------- | ------------------------------------ |
| Supabase CLI         | `supabase`              | Dùng cho migration, deploy function  |
| Supabase JS Client   | `@supabase/supabase-js` | SDK chính dùng trong Next.js         |
| Supabase SSR         | `@supabase/ssr`         | Hỗ trợ auth cho App Router SSR       |
| Monitoring / Tracing | `@opentelemetry/api`    | Thu thập trace end-to-end            |
| Error Tracking       | `@sentry/nextjs`        | Gửi lỗi từ Edge & FE lên Sentry      |
| Task Queue           | `pgmq`                  | Queue native trong Postgres          |
| Scheduler            | `pg_cron`               | Lên lịch job định kỳ                 |
| HTTP call trong SQL  | `pg_net`                | Gửi request API từ trigger DB        |
| Vector Search        | `pgvector`              | Lưu embedding, dùng cho AI search    |
| Infrastructure IaC   | Terraform, Pulumi       | Tự động hóa deploy Supabase project  |
| CI/CD                | GitHub Actions          | Triển khai build-test-deploy tự động |
| Visualization        | Grafana, Metabase       | Tạo dashboard phân tích dữ liệu      |
| Performance test     | K6, JMeter              | Load test và benchmark Edge Function |

## 14.3 🧠 Blog & Case Study (Chính thức từ Supabase)

| Chủ đề                          | Đường dẫn                                                             | Ghi chú                                           |
| ------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| **Supabase Launch Weeks**       | <https://supabase.com/blog/tags/launch-week>                          | Tổng hợp cập nhật hàng quý                        |
| **Supabase vs Firebase**        | <https://supabase.com/alternatives/supabase-vs-firebase>              | So sánh chi tiết                                  |
| **Using pgmq for job queue**    | <https://supabase.com/blog/supabase-queues>                           | Queue trong Postgres                              |
| **Processing large jobs**       | <https://supabase.com/blog/processing-large-jobs-with-edge-functions> | Xử lý job lớn với Edge Functions, Cron, và Queues |
| **Postgres Performance Tuning** | <https://supabase.com/docs/guides/platform/performance>               | Tối ưu query & index                              |

## 14.4 🎓 Tài nguyên học tập & Video

| Chủ đề                                            | Nguồn                                                                                                        | Ghi chú                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Supabase with Cloudflare Workers & KV Storage** | <https://egghead.io/courses/cache-supabase-data-at-the-edge-with-cloudflare-workers-and-kv-storage-883c7959> | Cache Supabase data tại Edge với Cloudflare Workers và KV Storage |
| **Supabase Crash Course (FreeCodeCamp)**          | Đang cập nhật...                                                                                             | Khoá học toàn diện Supabase + Next.js                             |
| **Next.js 15 (App Router)**                       | Đang cập nhật...                                                                                             | Cập nhật App Router, SSR, ISR                                     |
| **Supabase Edge Functions Live Demo**             | Đang cập nhật...                                                                                             | Demo function, storage, auth                                      |
| **Auth & RLS Workshop**                           | Đang cập nhật...                                                                                             | Xây dựng auth an toàn với RLS                                     |
| **pgvector for AI Search**                        | Đang cập nhật...                                                                                             | Dựng AI app với pgvector                                          |
| **Deploy with Supabase CLI**                      | Đang cập nhật...                                                                                             | Hướng dẫn chi tiết                                                |
| **Performance Testing (K6)**                      | Đang cập nhật...                                                                                             | Tối ưu Edge Function / API latency                                |

## 14.5 🧮 Cộng đồng & Kênh thảo luận

| Nguồn                           | Đường dẫn                                                                                            | Ghi chú                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| **Supabase Discord**            | [https://discord.supabase.com](https://discord.supabase.com)                                         | Cộng đồng dev toàn cầu          |
| **Supabase GitHub Discussions** | [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions) | Thảo luận & Q&A kỹ thuật        |
| **Reddit r/Supabase**           | [https://reddit.com/r/Supabase](https://reddit.com/r/Supabase)                                       | Trao đổi use case & kinh nghiệm |
| **Supabase Status Page**        | [https://status.supabase.com](https://status.supabase.com)                                           | Theo dõi uptime hệ thống        |
| **Next.js Discord**             | [https://discord.gg/nextjs](https://discord.gg/nextjs)                                               | Cộng đồng Next.js chính thức    |

## 14.6 🧩 Template & Boilerplate Repositories

| Tên repo                     | Mô tả                           | Link                                                  |
| ---------------------------- | ------------------------------- | ----------------------------------------------------- |
| **supabase/supabase**        | Mã nguồn open-source chính thức | <https://github.com/supabase/supabase>                |
| **supabase/supabase-js**     | SDK JavaScript chính thức       | <https://github.com/supabase/supabase-js>             |
| **supabase-nextjs-template** | Supabase + Next.js 15 template  | <https://github.com/Razikus/supabase-nextjs-template> |

## 14.7 🧠 Tài liệu chuyên sâu về PostgreSQL

| Chủ đề                       | Đường dẫn                                                       | Ghi chú                           |
| ---------------------------- | --------------------------------------------------------------- | --------------------------------- |
| **Postgres Documentation**   | <https://www.postgresql.org/docs/>                              | Tài liệu gốc                      |
| **RLS & Security Policies**  | <https://www.postgresql.org/docs/current/ddl-rowsecurity.html>  | RLS nguyên bản                    |
| **EXPLAIN & Query Planning** | <https://www.postgresql.org/docs/current/using-explain.html>    | Hiểu cơ chế query planner         |
| **Extensions Ecosystem**     | <https://pgxn.org/>                                             | Tìm và cài extension              |
| **Partitioning Guide**       | <https://www.postgresql.org/docs/current/ddl-partitioning.html> | Chia bảng theo thời gian / tenant |

## 14.8 💼 Các công ty đang dùng Supabase

| Công ty / Tổ chức  | Ứng dụng                             | Ghi chú                                                   |
| ------------------ | ------------------------------------ | --------------------------------------------------------- |
| **Phoenix Energy** | Chuyển đổi hạ tầng trọng yếu         | Hoàn tất migration sang Supabase chỉ trong 6 tháng        |
| **Rally**          | Pan-European fleet payments platform | Vận hành toàn bộ quy trình thanh toán trên Supabase stack |
| **Soshi**          | AI social media manager              | Từ dự án hackathon thành startup nhờ Supabase             |
| **Kayhan Space**   | Space-ops telemetry tooling          | Tăng 8× tốc độ phát triển sau khi chuyển sang Supabase    |
| **Udio**           | Music creation platform              | Xây dựng trải nghiệm âm nhạc cộng tác trên Supabase       |

> Tham khảo: [Supabase Customer Stories](https://supabase.com/customers)

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
| **Tuần 1-2** | Ôn tập RLS, Auth, Policy nâng cao | Tự viết policy phức tạp       |
| **Tuần 3-4** | Edge Functions & CI/CD            | Deploy pipeline hoàn chỉnh    |
| **Tháng 2**  | OTEL + Sentry + Logging           | Có dashboard trace/log        |
| **Tháng 3**  | pgvector + AI integration         | Search & LLM demo             |
| **Tháng 4+** | Self-host Supabase & IaC          | Setup Supabase riêng cho team |

## 14.11 🧾 Kết luận

> Phần "Tài liệu tham khảo" không chỉ là danh sách link,
> mà là **bản đồ học tập mở rộng** để bạn và team có thể tiếp tục nghiên cứu, thử nghiệm và chia sẻ kiến thức.

Sau khi hoàn thành toàn bộ 14 phần:

- Bạn đã nắm vững nền tảng Supabase + Next.js,
- Có thể triển khai, vận hành, bảo mật, tối ưu,
- Và tiếp tục mở rộng lên cấp độ **senior / architect** với khả năng tích hợp AI, observability, multi-tenant, và self-hosted infrastructure.
