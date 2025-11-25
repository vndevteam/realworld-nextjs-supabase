# Tóm Tắt Codebase

::: tip Tài Liệu Liên Quan
- [Tổng quan & PDR](/vi/project-overview-pdr) - Mục tiêu, phạm vi và yêu cầu dự án
- [Cấu trúc & Chuẩn mã](/vi/codebase-structure-architecture-code-standards) - Hướng dẫn phát triển và mẫu kiến trúc
:::

## Cấu Trúc Thư Mục

| Thư mục     | Trách nhiệm                           |
| ----------- | ------------------------------------- |
| `/nextjs`   | Ứng dụng Next.js 14 frontend.         |
| `/supabase` | Cấu hình dự án Supabase & migrations. |
| `/docs`     | Site tài liệu VitePress.              |
| `/openspec` | Quy trình đặc tả & đề xuất thay đổi.  |
| `/.github`  | Workflows CI/CD.                      |
| `/.husky`   | Git hooks (pre-commit, commit-msg).   |

## Công Nghệ Sử Dụng

- **Framework:** Next.js 16.0.1
- **Backend:** Supabase (CLI `^2.54.11`)
- **UI:** React 19.2.0
- **Styling:** Tailwind CSS 4.0
- **Ngôn Ngữ:** TypeScript 5
- **Quản Lý Gói:** pnpm 10.18.1
- **Tài Liệu:** VitePress 2.0.0-alpha.12
- **Lint:** ESLint 9
- **CI:** GitHub Actions

## Build & Tooling

- `package.json` root có script cho tài liệu; app Next.js có script build riêng.
- Thiếu lệnh build tổng hợp toàn monorepo.
- Chưa có pipeline test tự động.

## Kiến Trúc Runtime

1. **Trình Duyệt:** Người dùng tương tác giao diện Next.js.
2. **Next.js Server:** Render SSR/CSR; API routes xử lý logic.
3. **Supabase:** Next.js gọi Supabase client.
   - **Auth:** Supabase Auth.
   - **Dữ liệu:** PostgREST + RLS Postgres.

## Mô Hình Dữ Liệu

**KHOẢNG TRỐNG:** Không có migrations ⇒ Mô hình dữ liệu CHƯA XÁC ĐỊNH.

## Các Mối Quan Tâm Xuyên Suốt

- **AuthN/AuthZ:** Tài liệu tại `onboarding-guide/authentication.md` + `authorization-rls.md`.
- **Logging:** UNKNOWN.
- **Xử Lý Lỗi:** UNKNOWN.
- **Cấu Hình:** .env (không commit).
- **Quản Lý Secret:** Env + Supabase; rủi ro lộ secret phía client nếu sai.

## Trạng Thái Kiểm Thử

**Thiếu:** Chưa có bất kỳ test.

- **Đề Xuất:**
  - Unit: Vitest/Jest cho logic thuần.
  - Integration: API routes + Supabase.
  - E2E: Playwright/Cypress cho luồng quan trọng.

## Hiệu Năng

- Hiện tại nhanh vì tối giản.
- **Rủi Ro:** Query không tối ưu, thiếu phân trang, bundle phình to. Xem `performance-optimization.md`.

## Bảo Mật

- **Hiện Có:** Nền tảng Supabase; commit hooks giúp chất lượng.
- **Thiếu:** RLS thực tế; quét dependency; SAST. Xem `security.md`.

## Quan Sát & Giám Sát (Observability)

**Thiếu:** Chưa có logging, metrics, health checks.

- **Tối Thiểu:** Tích hợp dịch vụ log (VD: Logflare), health endpoint. Xem `observability-debugging.md`.

## Đa Ngôn Ngữ / i18n

- Tài liệu có tiếng Việt (`/docs/vi`).
- Ứng dụng Next.js chưa có i18n ⇒ GAP.

## TODO / FIXME

Không tìm thấy chuỗi TODO/FIXME – giai đoạn đầu.

## Sổ Rủi Ro

| Rủi ro                   | Tác động   | Xác suất   | Giảm thiểu                         |
| ------------------------ | ---------- | ---------- | ---------------------------------- |
| Chưa có data model       | Cao        | Cao        | Tạo migrations sớm.                |
| Không có CI app          | Cao        | Cao        | Thêm workflow lint/build/test.     |
| Thiếu RLS                | Cao        | Cao        | Viết chính sách ngay khi tạo bảng. |
| Lộ secret client         | Cao        | Trung bình | Quy ước tiền tố `NEXT_PUBLIC_`.    |
| Không có chiến lược test | Trung bình | Cao        | Áp dụng khuôn khổ test tối thiểu.  |

## Hướng Dẫn Bảo Trì

- Mỗi tính năng mới phải cập nhật tài liệu.
- Thay đổi lớn phải qua quy trình OpenSpec.
- Cập nhật dependencies định kỳ.
- Tuân thủ chuẩn trong `codebase-structure-architecture-code-standards.md`.
