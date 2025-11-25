# Tổng Quan Dự Án & PDR

::: tip Tài Liệu Liên Quan
- [Tóm tắt Codebase](/vi/codebase-summary) - Tổng quan cấu trúc kho mã và công nghệ
- [Cấu trúc & Chuẩn mã](/vi/codebase-structure-architecture-code-standards) - Hướng dẫn phát triển và mẫu kiến trúc
:::

## Tóm Tắt Điều Hành

Kho lưu này chứa mã nguồn ví dụ ứng dụng "RealWorld" xây dựng bằng Next.js và Supabase. Mục tiêu chính: cung cấp một template thực tế để dev học và mở rộng, minh họa kiến trúc full‑stack hiện đại theo hướng serverless. Có chủ đích KHÔNG giải quyết các nhu cầu doanh nghiệp quy mô lớn như đa tenant, mô hình vai trò phức tạp vượt quá RLS cơ bản, hay phân tích nâng cao. Tập trung vào nền tảng vững chắc cho một ứng dụng SaaS điển hình.

## Giá Trị Cốt Lõi

- **Cho Người Dùng:** Một bản clone Medium.com hoạt động, hiệu năng và tin cậy tuân thủ đặc tả RealWorld.
- **Cho Đội Ngũ Dev:** Monorepo có tài liệu đầy đủ, dễ bảo trì và mở rộng – “đường vàng” cho các dự án tiếp theo. Ưu tiên trải nghiệm phát triển, vòng lặp nhanh, chi phí vận hành thấp.

## Phạm Vi

### Trong Phạm Vi

- Xác thực người dùng (đăng ký, đăng nhập)
- Quản lý bài viết (tạo, đọc, sửa, xóa)
- Bình luận bài viết
- Hồ sơ người dùng
- Thẻ (tag) và lọc bài viết
- Theo dõi người dùng khác
- Trang tài liệu giải thích kiến trúc & hướng dẫn onboarding

### Ngoài Phạm Vi (hiện tại)

- Cộng tác thời gian thực
- Công cụ kiểm duyệt nội dung nâng cao
- Tích hợp mạng xã hội nâng cao
- Mô hình kiếm tiền / subscription
- Thông báo trong ứng dụng

## Tổng Quan Chức Năng

Hiện có khung ứng dụng Next.js tối giản và backend Supabase.

- **Next.js (`/nextjs`):** Ứng dụng Next.js 14 cơ bản (layout + trang thử) – chưa có tính năng RealWorld.
- **Supabase (`/supabase`):** Có `config.toml` nhưng CHƯA có migrations ⇒ Chưa định nghĩa mô hình dữ liệu.
- **Tài liệu (`/docs`):** Site VitePress đa ngôn ngữ (EN, VI) với bộ hướng dẫn onboarding phong phú.

## Yêu Cầu Phi Chức Năng

- **Bảo Mật:** **(Một Phần)** Dự kiến dùng RLS Supabase nhưng chưa triển khai; rủi ro lộ secret phía client cao. Xem `docs/onboarding-guide/security.md`.
- **Độ Tin Cậy:** **(Thất Bại)** Chưa có health check, monitoring, alerting ⇒ Trạng thái UNKNOWN.
- **Hiệu Năng:** **(Thất Bại)** Chưa có benchmark; app tối giản nên nhanh nhưng chưa có pattern truy vấn tối ưu. Xem `performance-optimization.md`.
- **Khả Năng Mở Rộng:** **(Một Phần)** Supabase hỗ trợ tốt theo chiều dọc; chưa có thiết kế kiểm chứng mở rộng ngang.
- **Khả Năng Bảo Trì:** **(Đạt)** Cấu trúc monorepo + tooling + tài liệu tốt.

## Tóm Tắt Kiến Trúc

Ba thành phần chính trong monorepo `pnpm`:

- **Frontend Next.js:** SSR/CSR React; giao diện và tương tác; gọi Supabase cho dữ liệu & auth.
- **Supabase Backend:** Database Postgres, Auth, PostgREST API; ủy quyền dựa vào RLS.
- **Tài Liệu VitePress:** Nơi lưu toàn bộ kiến thức dự án (onboarding, kiến trúc, chuẩn mã).
- **Quy Trình OpenSpec:** Cơ chế đề xuất & phê duyệt thay đổi quan trọng.

## Môi Trường & Công Cụ

- Monorepo dùng `pnpm workspaces`.
- CI/CD: Chỉ có workflow deploy tài liệu (`deploy-docs.yml`). Chưa có CI cho app (lint, test, build).
- Tooling: `eslint`, `prettier`, `husky`, `commitlint`.

## Rủi Ro & Ràng Buộc Hiện Tại

- **Ràng Buộc Cứng:** Tuân thủ đặc tả RealWorld.
- **Nợ Kỹ Thuật:** App Next.js còn trống, cần nhiều tính năng.
- **Thiếu Hạ Tầng:** Chưa có môi trường staging/production; thiếu observability.
- **Khoảng Trống Data Model:** Không có migrations ⇒ Blocker lớn nhất.

## Trạng Thái Checklist PDR

- [ ] Định Nghĩa Vấn Đề: (Pass)
- [ ] Phạm Vi & Yêu Cầu: (Pass)
- [ ] Kiến Trúc Cao Cấp: (Partial)
- [ ] Mô Hình Dữ Liệu: (Fail)
- [ ] Kế Hoạch Bảo Mật: (Partial)
- [ ] Chiến Lược Kiểm Thử: (Fail)
- [ ] Kế Hoạch Triển Khai: (Fail)
- [ ] Observability: (Fail)

## Bước Tiếp Theo Gần Nhất

1. Định nghĩa mô hình dữ liệu (users, articles, comments, tags, follows) qua migrations.
2. Triển khai luồng đăng ký / đăng nhập Supabase Auth trong Next.js.
3. Thêm workflow CI cho lint + build Next.js.
4. Áp dụng RLS ban đầu cho các bảng.
5. Tạo API route đầu tiên (tạo bài viết) để kiểm chứng stack end‑to‑end.
