# Phần 4. Database & Migrations

> Mục tiêu: nắm vững cách thiết kế schema, viết migration chuẩn nội bộ, seed dữ liệu, và quản lý thay đổi DB xuyên suốt môi trường.

## 4.1 🎯 Mục tiêu học phần

Sau khi hoàn thành phần này, dev có thể:

- Thiết kế và triển khai schema PostgreSQL trong Supabase.
- Sử dụng **Supabase CLI** để quản lý migration như code.
- Tạo seed data và local DB đồng bộ.
- Tối ưu hiệu năng qua index, enum, constraint.
- Giữ version schema thống nhất giữa dev/staging/prod.

## 4.2 🧠 Kiến thức nền tảng

### Vì sao cần migrations?

- **Tính đồng bộ**: mọi dev đều có schema giống nhau.
- **Version control**: dễ rollback khi có lỗi.
- **Automation**: CI/CD có thể apply migration tự động.
- **Lịch sử thay đổi rõ ràng**: mỗi thay đổi DB có commit trace.

### Cấu trúc cơ bản của migration

```sql
-- migration file ví dụ
-- 20251105120200_create_tasks_table.sql

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table tasks enable row level security;

comment on table tasks is 'User task list';
```

## 4.3 🧩 Tạo migration bằng Supabase CLI

### Khởi tạo migration mới

```bash
supabase migration new create_tasks_table
```

CLI sẽ tạo file:

```bash
/supabase/migrations/
  └── 20251105120200_create_tasks_table.sql
```

Bạn chỉnh SQL trực tiếp trong file này.

### Áp dụng migration local

```bash
supabase db reset
# hoặc chỉ apply
supabase db push
```

- `db reset`: xóa DB local, tạo lại toàn bộ schema + seed.
- `db push`: apply migration mới mà không xóa dữ liệu.

### Kiểm tra trạng thái migration

```bash
supabase migration list
```

> Hiển thị danh sách migration đã chạy / pending / lỗi.

## 4.4 🧱 Thiết kế schema cơ bản (chuẩn nội bộ)

Dưới đây là ví dụ **schema gốc** dùng xuyên suốt tài liệu (ứng dụng "Subscription Manager").

### Tạo bảng `subscriptions`

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  service_name text not null,
  price numeric(10,2) not null,
  currency text default 'USD',
  renew_date date,
  is_active boolean default true,
  created_at timestamptz default now()
);
comment on table subscriptions is 'User subscription service information';
alter table subscriptions enable row level security;
```

### Policy cơ bản

```sql
create policy "Users can view own subscriptions"
on subscriptions for select
using ( auth.uid() = user_id );

create policy "Users can insert own subscriptions"
on subscriptions for insert
with check ( auth.uid() = user_id );
```

## 4.5 🧾 Index, Constraint, Enum

### Index

```sql
create index idx_subscriptions_user_id on subscriptions(user_id);
create index idx_subscriptions_renew_date on subscriptions(renew_date);
```

> Giúp tối ưu truy vấn khi lọc theo user hoặc thời gian.

### Enum type

```sql
create type subscription_status as enum ('active', 'expired', 'cancelled');

alter table subscriptions add column status subscription_status default 'active';
```

### Constraint

```sql
alter table subscriptions
add constraint valid_price check (price >= 0);
```

## 4.6 🧪 Seed dữ liệu local

### Tạo file `/supabase/seed.sql`

```sql
insert into subscriptions (user_id, service_name, price, renew_date)
values
  ('00000000-0000-0000-0000-000000000001', 'Netflix', 12.99, '2025-12-01'),
  ('00000000-0000-0000-0000-000000000001', 'Spotify', 9.99, '2025-12-15');
```

### Apply seed

```bash
supabase db reset --seed
```

> CLI sẽ chạy toàn bộ migration rồi chạy `seed.sql` để có dữ liệu test.

## 4.7 🧩 Migration workflow chuẩn nội bộ

```mermaid
flowchart TD
A[Dev thay đổi schema] --> B[Chạy supabase migration new]
B --> C[Sửa SQL migration]
C --> D[Chạy supabase db push để test local]
D --> E[Commit & push lên GitHub]
E --> F[CI/CD apply migration trên staging]
F --> G[Deploy production sau review]
```

## 4.8 🧭 Quy ước đặt tên & tổ chức file

| Loại file | Định dạng tên                       | Ví dụ                                     |
| --------- | ----------------------------------- | ----------------------------------------- |
| Migration | `YYYYMMDDHHmmss_action.sql`         | `20251105120200_create_users_table.sql`   |
| Policy    | `YYYYMMDDHHmmss_policy_<table>.sql` | `20251106120200_policy_subscriptions.sql` |
| Seed      | `seed.sql`                          | -                                         |

**Best Practice:** mỗi thay đổi DB → 1 migration riêng biệt, không gộp nhiều bảng trong 1 file.

## 4.9 ⚙️ Đồng bộ schema giữa môi trường

### Export schema hiện tại

```bash
supabase db dump --local -f schema.sql
```

### Apply schema cho môi trường khác

```bash
supabase db push --db-url postgres://user:pass@host:port/dbname
```

> Giúp đảm bảo staging/production luôn cùng version.

## 4.10 🧩 Tích hợp migration vào CI/CD

### GitHub Actions (ví dụ)

`.github/workflows/db-migration.yml`

```yaml
name: Supabase Migrations

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      - name: Login Supabase
        run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
      - name: Push migrations
        run: supabase db push
```

## 4.11 🧮 Performance & Maintainability Tips

| Chủ đề          | Best Practice                                            |
| --------------- | -------------------------------------------------------- |
| **Index**       | Chỉ tạo index cho cột thường dùng trong `WHERE` / `JOIN` |
| **Enum**        | Dùng enum thay cho text khi có giá trị cố định           |
| **Constraint**  | Dùng `CHECK` để tránh dữ liệu sai logic                  |
| **Timestamp**   | Luôn dùng `timestamptz` thay vì `timestamp`              |
| **Naming**      | snake_case, tên bảng số nhiều (`users`, `tasks`)         |
| **Soft delete** | Thêm `deleted_at` thay vì xóa vật lý                     |
| **Audit log**   | Tạo trigger ghi log khi cần trace hành động              |

## 4.12 🧰 Công cụ hỗ trợ kiểm tra schema

- **Supabase Studio → Table Editor / SQL Editor**
- **CLI commands:**

  - `supabase migration list` - xem trạng thái các migration (đã chạy / pending / lỗi).
  - `supabase db push` - áp dụng migration và hiển thị lỗi nếu SQL không hợp lệ.
  - `supabase db diff` - so sánh schema giữa local và remote để phát hiện khác biệt.

- **VSCode extension "[Supabase](https://marketplace.visualstudio.com/items?itemName=Supabase.vscode-supabase-extension)"**: xem trực tiếp schema, run query nhanh.

## 4.13 🧭 Checklist hoàn thành

- [ ] Biết tạo và áp dụng migration bằng CLI.
- [ ] Tạo bảng, index, enum, constraint cơ bản.
- [ ] Viết seed data cho môi trường local.
- [ ] Biết export & đồng bộ schema giữa môi trường.
- [ ] Hiểu workflow apply migration trong CI/CD.
- [ ] Giữ được version schema đồng bộ cho toàn team.

## 4.14 💡 Best Practices nội bộ

1. **Tuyệt đối không chỉnh DB trực tiếp** trên production - chỉ qua migration.
2. **Migration phải có mô tả rõ ràng**: comment đầu file ghi lý do, issue link.
3. **Không merge migration conflict bằng tay** - regenerate file mới.
4. **Giữ seed.sql nhỏ gọn**, chỉ data phục vụ test.
5. **Test migration local trước khi commit** (`supabase db reset`).
6. **Review migration cùng code change** trong PR.
7. **Luôn tạo index cho foreign key**, nhất là khi dùng RLS subquery.
8. **Tách policy vào file riêng**, để dễ track quyền và rollback.

## 4.15 📚 Tài liệu tham khảo

- [Supabase Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments)
- [PostgreSQL Schema Design](https://www.postgresql.org/docs/current/ddl.html)
- [Supabase Migration Guide](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase CLI Database Migrations](https://supabase.com/docs/reference/cli/supabase-migration)
- [Supabase db push & db reset Docs](https://supabase.com/docs/reference/cli/supabase-db-push)

## 4.16 🧾 Output sau phần này

> Sau khi hoàn tất phần 4, dev mới sẽ có thể:
>
> - [x] Viết migration SQL và seed local DB.
> - [x] Hiểu rõ workflow version control schema.
> - [x] Quản lý môi trường dev/staging/prod qua CLI.
> - [x] Tối ưu schema bằng index, constraint, enum.
> - [x] Tự động hóa migration qua CI/CD.
