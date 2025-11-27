# Cấu Trúc Codebase, Kiến Trúc & Chuẩn Mã

::: tip Tài Liệu Liên Quan

- [Tổng quan & PDR](project-overview-pdr.md) - Mục tiêu, phạm vi và yêu cầu dự án
- [Tóm tắt Codebase](codebase-summary.md) - Tổng quan cấu trúc kho mã và công nghệ
  :::

## Nguyên Tắc Chỉ Đạo

- **YAGNI:** Không thêm tính năng khi chưa cần thực sự.
- **KISS:** Giải pháp càng đơn giản càng tốt.
- **DRY:** Tái sử dụng hợp lý; tránh trừu tượng sớm.

## Chuẩn Monorepo

- **Ranh Giới:**
  - `nextjs`: Mã frontend.
  - `supabase`: Cấu hình DB & migrations.
  - `docs`: Tài liệu.
- **Quy Tắc Dependency:** Không vòng lặp phụ thuộc; dùng `pnpm` workspace.

## Quy Ước Thư Mục

- `/nextjs/app`: Theo chuẩn App Router; gom nhóm theo route segment.
- `/supabase/migrations`: Mọi thay đổi schema phải qua migrations.
- `/docs`: Trung tâm tài liệu.
- `/openspec`: Đề xuất / quyết định kiến trúc.
- Thư mục top-level mới ⇒ cần đề xuất OpenSpec.

## Tổ Chức Tính Năng & Module

1. Tạo route segment mới.
2. Đồng vị trí component, service, type.
3. Component chia sẻ đặt ở `/nextjs/components`.

## Truy Cập Dữ Liệu & Supabase

- BẮT BUỘC dùng RLS cho mọi bảng.
- Thay đổi schema qua `supabase db diff` + commit migrations.
- Xem `database-migrations.md`.

## Mẫu Xác Thực & Phân Quyền

- Supabase Auth cho login/signup (xem `authentication.md`).
- Phân quyền tại DB bằng RLS (xem `authorization-rls.md`).

## Xử Lý Lỗi & Logging

- Cần dịch vụ logging tập trung.
- API trả JSON lỗi nhất quán.
- Không log thông tin nhạy cảm; không lộ lỗi DB thô.

## Cấu Hình & Secret

- Local: `.env.local`.
- Biến client phải `NEXT_PUBLIC_`.
- Tránh phân tán giá trị cấu hình.

## Hiệu Năng

- Chỉ tối ưu khi đo được vấn đề.
- Tránh: truy vấn lớn không phân trang, joins phức tạp trong đường nóng, block event loop.

## Bảo Mật

- Lưu ý OWASP Top 10.
- Nguyên tắc ít đặc quyền.
- Tuyệt đối không lộ `service_role` key.

## Chuẩn Kiểm Thử

- Unit: logic thuần.
- Integration: API + DB.
- Smoke/E2E: Luồng chính sau deploy.

## Quy Trình PR & Spec

- Thay đổi nhỏ: PR trực tiếp.
- Thay đổi lớn: Phải có đề xuất OpenSpec trước (link trong PR).

## Yêu Cầu Cập Nhật Tài Liệu

- Component mới: thêm chú thích JSDoc/TSDoc.
- API route mới: cập nhật tài liệu request/response.
- Thay đổi kiến trúc: cập nhật phần liên quan trong `/docs`.

## Anti-Patterns

- API route quá nặng (fat route). Di chuyển logic vào service.
- Bỏ qua RLS bằng `service_role` phía client.
- Sửa DB trực tiếp trên UI Supabase (gây drift migrations).

## Checklist Merge Tính Năng Mới

1. [ ] Có đề xuất OpenSpec được duyệt.
2. [ ] Tuân thủ chuẩn tài liệu này.
3. [ ] Có test cần thiết & pass.
4. [ ] Cập nhật tài liệu liên quan.
5. [ ] CI pass.
6. [ ] Ít nhất 1 reviewer phê duyệt.
