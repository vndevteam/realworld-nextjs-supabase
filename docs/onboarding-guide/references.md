# Part 14. References

> Goal: Provide catalog of official resources and extended practices, helping dev teams maintain updated knowledge, best practices, and technology trends.

## 14.1 🧩 Official Documentation

| Topic                                  | Link                                                                                                                                                 | Notes                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Supabase Documentation**             | [https://supabase.com/docs](https://supabase.com/docs)                                                                                               | Official documentation homepage                            |
| **Next.js Documentation**              | [https://nextjs.org/docs](https://nextjs.org/docs)                                                                                                   | Next.js framework docs (App Router, SSR, ISR, Middleware)  |
| **Supabase Auth Guide**                | [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)                                                                       | Configure JWT, OAuth, Magic Link, OTP                      |
| **Supabase Row Level Security (RLS)**  | [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)                                 | How to enable and write security policies                  |
| **Supabase CLI Reference**             | [https://supabase.com/docs/reference/cli](https://supabase.com/docs/reference/cli)                                                                   | All CLI commands (link, db push, migrate, function deploy) |
| **Supabase Edge Functions**            | [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)                                                             | Guide to write & deploy Edge Functions                     |
| **Supabase Storage**                   | [https://supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)                                                                 | Upload, signed URLs, bucket policies                       |
| **Supabase Realtime**                  | [https://supabase.com/docs/guides/realtime](https://supabase.com/docs/guides/realtime)                                                               | Real-time data streaming                                   |
| **Supabase Database Extensions**       | [https://supabase.com/docs/guides/database/extensions](https://supabase.com/docs/guides/database/extensions)                                         | pg_cron, pg_net, pgmq, vector, etc.                        |
| **Supabase API Reference (PostgREST)** | [https://supabase.com/docs/reference/javascript/select](https://supabase.com/docs/reference/javascript/select)                                       | API client and query syntax                                |
| **Supabase Pricing Overview**          | [https://supabase.com/pricing](https://supabase.com/pricing)                                                                                         | Plan details, quotas and costs                             |
| **Next.js Deployment**                 | [https://vercel.com/docs/deployments/overview](https://vercel.com/docs/deployments/overview)                                                         | Deploy Next.js on Vercel                                   |
| **Next.js Middleware & Edge Runtime**  | [https://nextjs.org/docs/app/building-your-application/routing/middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) | Configure security and middleware                          |
| **NextAuth.js (Optional)**             | [https://next-auth.js.org](https://next-auth.js.org)                                                                                                 | If integrating auth outside Supabase                       |

## 14.2 ⚙️ Useful Tools & Libraries

| Purpose              | Tool / Package                                 | Notes                                  |
| -------------------- | ---------------------------------------------- | -------------------------------------- |
| Supabase CLI         | `@supabase/cli`                                | For migrations, deploy functions       |
| Supabase JS Client   | `@supabase/supabase-js`                        | Main SDK used in Next.js               |
| Supabase SSR         | `@supabase/ssr`                                | Auth support for App Router SSR        |
| Monitoring / Tracing | `@opentelemetry/api`, `tempo`, `grafana-agent` | Collect end-to-end traces              |
| Error Tracking       | `@sentry/nextjs`                               | Send errors from Edge & FE to Sentry   |
| Task Queue           | `pgmq`                                         | Native queue in Postgres               |
| Scheduler            | `pg_cron`                                      | Schedule periodic jobs                 |
| HTTP calls in SQL    | `pg_net`                                       | Send API requests from DB triggers     |
| Vector Search        | `pgvector`                                     | Store embeddings, use for AI search    |
| Infrastructure IaC   | Terraform, Pulumi                              | Automate Supabase project deployment   |
| CI/CD                | GitHub Actions                                 | Automated build-test-deploy            |
| Visualization        | Grafana, Metabase                              | Create data analysis dashboards        |
| Performance Testing  | K6, JMeter                                     | Load test and benchmark Edge Functions |

## 14.3 🧠 Blog & Case Studies (Official from Supabase)

| Topic                           | Link                                                                                                               | Notes                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| **Supabase Launch Weeks**       | [https://supabase.com/blog/tag/launch-week](https://supabase.com/blog/tag/launch-week)                             | Quarterly update summary   |
| **Supabase vs Firebase**        | [https://supabase.com/blog/supabase-vs-firebase](https://supabase.com/blog/supabase-vs-firebase)                   | Detailed comparison        |
| **Building SaaS with Supabase** | [https://supabase.com/blog/saas-starter-kit](https://supabase.com/blog/saas-starter-kit)                           | Build full-stack SaaS app  |
| **Using pgmq for job queue**    | [https://supabase.com/blog/pgmq-introduction](https://supabase.com/blog/pgmq-introduction)                         | Queue in Postgres          |
| **Edge Functions Tips**         | [https://supabase.com/blog/edge-functions-best-practices](https://supabase.com/blog/edge-functions-best-practices) | Optimize function runtime  |
| **Postgres Performance Tuning** | [https://supabase.com/blog/postgres-performance-tuning](https://supabase.com/blog/postgres-performance-tuning)     | Optimize queries & indexes |
| **Auth Deep Dive**              | [https://supabase.com/blog/supabase-auth-deep-dive](https://supabase.com/blog/supabase-auth-deep-dive)             | GoTrue internal analysis   |
| **RLS Patterns**                | [https://supabase.com/blog/row-level-security-patterns](https://supabase.com/blog/row-level-security-patterns)     | Common policy patterns     |

## 14.4 🎓 Learning Resources & Videos

| Topic                                    | Source                                                                                                     | Notes                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Supabase Crash Course (FreeCodeCamp)** | [YouTube - FreeCodeCamp](https://www.youtube.com/watch?v=2x0m1NjyR9E)                                      | Comprehensive Supabase + Next.js course |
| **Next.js 15 (App Router)**              | [YouTube - Traversy Media](https://www.youtube.com/watch?v=ZVnjOPwW4ZA)                                    | App Router, SSR, ISR updates            |
| **Supabase Edge Functions Live Demo**    | [YouTube - Supabase](https://www.youtube.com/@supabase)                                                    | Demo functions, storage, auth           |
| **Auth & RLS Workshop**                  | [Supabase Live Workshop](https://www.youtube.com/watch?v=Z-Nl1xA1IYQ)                                      | Build secure auth with RLS              |
| **pgvector for AI Search**               | [YouTube - Supabase AI Playlist](https://www.youtube.com/playlist?list=PL5P6qYJ2Sl6Ym2X-ZqL6FXR3vWqC1u-M1) | Build AI app with pgvector              |
| **Deploy with Supabase CLI**             | [Supabase CLI Walkthrough](https://www.youtube.com/watch?v=OZzL4k6kRLo)                                    | Detailed guide                          |
| **Performance Testing (K6)**             | [Grafana K6 YouTube](https://www.youtube.com/@k6-load-testing)                                             | Optimize Edge Function / API latency    |

## 14.5 🧮 Community & Discussion Channels

| Source                          | Link                                                                                                 | Notes                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Supabase Discord**            | [https://discord.supabase.com](https://discord.supabase.com)                                         | Global dev community           |
| **Supabase GitHub Discussions** | [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions) | Technical discussions & Q&A    |
| **Reddit r/Supabase**           | [https://reddit.com/r/Supabase](https://reddit.com/r/Supabase)                                       | Use case & experience exchange |
| **Supabase Status Page**        | [https://status.supabase.com](https://status.supabase.com)                                           | Monitor system uptime          |
| **Next.js Discord**             | [https://discord.gg/nextjs](https://discord.gg/nextjs)                                               | Official Next.js community     |

## 14.6 🧩 Template & Boilerplate Repositories

| Repo Name                                       | Description                             | Link                                                                                                                             |
| ----------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **supabase/supabase**                           | Official open-source codebase           | [https://github.com/supabase/supabase](https://github.com/supabase/supabase)                                                     |
| **supabase/supabase-js**                        | Official JavaScript SDK                 | [https://github.com/supabase/supabase-js](https://github.com/supabase/supabase-js)                                               |
| **supabase-community/supabase-nextjs-template** | Supabase + Next.js 14/15 template       | [https://github.com/supabase-community/supabase-nextjs-template](https://github.com/supabase-community/supabase-nextjs-template) |
| **vercel/nextjs-postgres-starter**              | Next.js + Postgres template             | [https://github.com/vercel/nextjs-postgres-starter](https://github.com/vercel/nextjs-postgres-starter)                           |
| **openstatusHQ/openstatus**                     | SaaS monitoring app built with Supabase | [https://github.com/openstatusHQ/openstatus](https://github.com/openstatusHQ/openstatus)                                         |
| **pgvector/supabase-ai-demo**                   | Supabase + pgvector AI example          | [https://github.com/supabase-community/pgvector-demo](https://github.com/supabase-community/pgvector-demo)                       |

## 14.7 🧠 In-Depth PostgreSQL Documentation

| Topic                        | Link                                                                                                                           | Notes                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| **Postgres Documentation**   | [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)                                                           | Original documentation             |
| **RLS & Security Policies**  | [https://www.postgresql.org/docs/current/ddl-rowsecurity.html](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)   | Native RLS                         |
| **EXPLAIN & Query Planning** | [https://www.postgresql.org/docs/current/using-explain.html](https://www.postgresql.org/docs/current/using-explain.html)       | Understand query planner mechanism |
| **Extensions Ecosystem**     | [https://pgxn.org/](https://pgxn.org/)                                                                                         | Find and install extensions        |
| **Partitioning Guide**       | [https://www.postgresql.org/docs/current/ddl-partitioning.html](https://www.postgresql.org/docs/current/ddl-partitioning.html) | Partition tables by time / tenant  |

## 14.8 💼 Companies Using Supabase

| Company / Organization                             | Application                      | Notes                         |
| -------------------------------------------------- | -------------------------------- | ----------------------------- |
| **Hashnode**                                       | Social Blog platform             | Uses Supabase Realtime + Auth |
| **OpenStatus**                                     | Uptime & monitoring              | Edge Functions + pgmq         |
| **Snaplet**                                        | Data snapshot tool               | Supabase DB clone             |
| **Chatbase / Documate**                            | AI chatbot platform              | Supabase + pgvector           |
| **Xata & Convex**                                  | Combined with Supabase plugins   | Hybrid SaaS use case          |
| **Sun\* / Laughter Platform** _(internal example)_ | MVP property/contract management | Supabase as MVP backend       |

## 14.9 🔬 Advanced Self-Study Directions

| Topic                             | Goal                                              |
| --------------------------------- | ------------------------------------------------- |
| **PostgreSQL internals**          | Deep understanding of optimizer, planner, locking |
| **Edge compute & Deno runtime**   | Write optimized Edge Functions                    |
| **Supabase self-hosted stack**    | Deploy on-prem or hybrid                          |
| **AI / pgvector**                 | Build search engine, semantic filter              |
| **OTEL & Observability**          | Build end-to-end system tracing                   |
| **Multi-tenant RLS patterns**     | Isolation for enterprise SaaS                     |
| **Terraform + Supabase Provider** | IaC for Supabase projects                         |

## 14.10 📘 Suggested Advanced Learning Path

| Phase        | Focus                               | Expected Outcome                |
| ------------ | ----------------------------------- | ------------------------------- |
| **Week 1–2** | Review RLS, Auth, Advanced Policies | Write complex policies yourself |
| **Week 3–4** | Edge Functions & CI/CD              | Complete deployment pipeline    |
| **Month 2**  | OTEL + Sentry + Logging             | Have trace/log dashboard        |
| **Month 3**  | pgvector + AI Integration           | Search & LLM demo               |
| **Month 4+** | Self-host Supabase & IaC            | Setup Supabase for team         |

## 14.11 🧾 Conclusion

> The "References" section is not just a list of links,
> but an **extended learning map** for you and your team to continue researching, experimenting, and sharing knowledge.

✅ After completing all 14 parts:

- You have mastered Supabase + Next.js foundation,
- Can deploy, operate, secure, optimize,
- And continue expanding to **senior / architect** level with AI integration, observability, multi-tenant, and self-hosted infrastructure capabilities.
