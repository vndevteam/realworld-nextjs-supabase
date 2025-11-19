# Phần 1. Cài đặt & Chuẩn bị môi trường

> Mục tiêu: thiết lập môi trường dev chuẩn nội bộ, chạy được Supabase local, Next.js frontend, và kết nối giữa hai bên.

## 1.1 ⚙️ Mục tiêu học phần

Sau khi hoàn thành, dev sẽ có thể:

- Cài đặt Supabase CLI, Node.js, VSCode và các plugin cần thiết.
- Tạo project Supabase mới + Next.js project kết nối thành công.
- Chạy Supabase local với database, auth, storage.
- Hiểu cấu trúc thư mục project chuẩn nội bộ.

## 1.2 🧩 Công cụ cần chuẩn bị

### Phần mềm bắt buộc

| Công cụ                     | Mục đích                               | Cài đặt                                                                 |
| --------------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| **Node.js ≥ 20**            | Chạy Next.js và CLI                    | [nodejs.org](https://nodejs.org)                                        |
| **pnpm** _(khuyến nghị)_    | Quản lý package nhanh hơn npm          | `npm i -g pnpm`                                                         |
| **Supabase CLI**            | Quản lý project, chạy DB local, deploy | [Supabase CLI Docs](https://supabase.com/docs/guides/cli)               |
| **Docker Desktop / Podman** | Supabase local chạy qua container      | [docker.com](https://www.docker.com/) / [podman.io](https://podman.io/) |
| **VSCode**                  | IDE chính                              | [code.visualstudio.com](https://code.visualstudio.com/)                 |

### VSCode Extensions khuyến nghị

| Extension                  | Mục đích                              |
| -------------------------- | ------------------------------------- |
| **Supabase (by Supabase)** | Kết nối và quản lý database trực tiếp |
| **SQLTools**               | Viết và chạy query SQL                |
| **ESLint + Prettier**      | Format và lint code                   |

### Tài khoản cần có

- 1 tài khoản [Supabase](https://supabase.com/dashboard)
- 1 tài khoản GitHub (dùng để liên kết Supabase project và CI/CD)
- 1 tài khoản [Vercel](https://vercel.com) hoặc Cloudflare Pages (cho bước deploy sau này)

## 1.3 🧱 Tạo Supabase Project đầu tiên

### Bước 1. Đăng nhập Supabase Dashboard

- Vào [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Chọn **New Project**
- Đặt tên: `supabase-training`
- Chọn Region gần nhất (ví dụ: Singapore)
- Ghi chú mật khẩu Postgres DB → để dùng cho CLI local.

### Bước 2. Tạo Project local

```bash
mkdir supabase-next-demo
cd supabase-next-demo
npx supabase init
```

Lệnh này sẽ tạo thư mục:

```bash
/supabase
  ├── config.toml         # cấu hình local
  ├── migrations/         # chứa file SQL migration
  └── seed.sql            # seed data ban đầu
```

### Bước 3. Chạy Supabase local

```bash
supabase start
```

> CLI sẽ tự chạy Postgres, API, Auth, Storage trong Docker.
> Mặc định truy cập:
>
> - API URL: `http://localhost:54321`
> - DB: `localhost:54322`
> - Studio (dashboard local): `http://localhost:54323`
> - Tài khoản database: `postgres` / `postgres` _(mặc định từ Supabase local containers)_

### Bước 4. Đăng nhập CLI

```bash
supabase login
```

Dán **Access Token** (lấy từ Supabase Dashboard → Account → Access Token).

## 1.4 ⚡ Tạo Next.js Project

### Bước 1. Tạo project Next.js mới

```bash
pnpm create next-app@latest web --typescript --app
cd web
```

> Cấu hình đề xuất:
>
> - ✅ TypeScript
> - ✅ ESLint
> - ✅ App Router
> - ✅ TailwindCSS (optional nhưng khuyến nghị cho UI demo)

### Bước 2. Cài Supabase SDK

```bash
pnpm add @supabase/supabase-js
```

### Bước 3. Tạo file `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

> 🔎 `anon_key` lấy tại **Supabase → Settings → API → Project API keys**.

### Bước 4. Tạo client helper

`/lib/supabaseClient.ts`

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

> 💡 `createClient` là hàm helper để tạo một client Supabase. Nó được sử dụng để kết nối với database Supabase ở client-side. Bạn cũng có thể sử dụng `createBrowserClient` hoặc `createServerClient` từ `@supabase/ssr` để tạo một client (khuyến nghị cho Next.js App Router).

### Bước 5. Test kết nối

`app/page.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("profiles").select("*");
      setProfiles(data || []);
    };
    fetchData();
  }, []);

  return (
    <main>
      <h1>Hello Supabase</h1>
      <pre>{JSON.stringify(profiles, null, 2)}</pre>
    </main>
  );
}
```

> 👉 Nếu hiện lỗi `relation "profiles" does not exist`, điều đó bình thường trước khi hoàn thành Phần 2 - ta sẽ tạo bảng `profiles` ở Authentication (mục 2.5) và quay lại Database ở Phần 4.

## 1.5 🗂️ Cấu trúc thư mục chuẩn nội bộ

```bash
/supabase
  ├── migrations/           # Mọi thay đổi DB đều ở đây
  ├── seed.sql              # Data mẫu
  ├── functions/            # Edge Functions
  ├── policies/             # RLS & policy SQL
/web
  ├── app/                  # Next.js App Router
  ├── lib/                  # Client helper (supabaseClient, auth helper)
  ├── components/           # UI components
  ├── types/                # TypeScript types
  └── public/               # Assets
/scripts
  ├── local-reset.sh        # Script reset DB local
  ├── cron/                 # Các batch job định kỳ
  └── dev-seed.ts           # Tạo data dev nhanh
```

### Best Practice

- Mỗi lần thay đổi DB phải qua migration, không thao tác thủ công.
- Tên migration nên theo format:

  ```bash
  20251105120000_create_users_table.sql
  20251105120500_add_rls_policy_users.sql
  ```

- Folder `/scripts` nên có:

  - `init-local.sh` → setup local lần đầu
  - `reset-db.sh` → xóa container Supabase + start lại clean

## 1.6 🧰 Thiết lập Git & GitHub Actions cơ bản

1. **Khởi tạo Git repo**

   ```bash
   git init
   git add .
   git commit -m "init supabase + nextjs project"
   ```

2. **Tạo remote repo**

   - GitHub → New Repository → `supabase-next-demo`
   - Push:

     ```bash
     git remote add origin git@github.com:<yourname>/supabase-next-demo.git
     git push -u origin main
     ```

3. **Thiết lập workflow (tạm thời)**
   File `.github/workflows/check.yml`:

   ```yaml
   name: Check Project Setup

   on:
     push:
       branches: [main]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v5
         - name: Setup Node
           uses: actions/setup-node@v6
           with:
             node-version: 20
         - uses: pnpm/action-setup@v4
           with:
             version: 10.18.1
         - run: pnpm install
           working-directory: web
         - run: pnpm build
           working-directory: web
   ```

   > Giúp đảm bảo project luôn build được sau mỗi commit.

## 1.7 🧭 Kiểm tra & xác nhận môi trường

✅ Sau khi setup, hãy đảm bảo:

- [ ] Chạy được `supabase start` và truy cập Studio local.
- [ ] Tạo được project Next.js và hiển thị "Hello Supabase".
- [ ] `.env.local` có 2 biến Supabase URL và Anon Key đúng.
- [ ] GitHub Actions build thành công.
- [ ] Docker không bị conflict port (5432–54323).

## 1.8 💡 Best Practices nội bộ

1. **Không dùng Dashboard Production để tạo bảng** – luôn qua migration SQL.
2. **Luôn commit file `.sql` migration cùng với code thay đổi.**
3. **Không share Service Role Key** cho FE hoặc môi trường dev công khai.
4. **Đặt riêng project Supabase cho từng môi trường** (dev / staging / prod).
5. **Khi run local Supabase:**

   - Kiểm tra Docker container `supabase_db` có hoạt động.
   - Dọn dữ liệu local thường xuyên (`supabase stop && supabase start`).

6. **Mỗi dev tạo branch riêng** khi training (`feat/yourname-auth`, `feat/yourname-crud`).

## 1.9 📚 Tài liệu tham khảo

- [Supabase CLI Quickstart](https://supabase.com/docs/guides/cli/getting-started)
- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase SDK Reference](https://supabase.com/docs/reference/javascript/start)
- [Supabase Next Demo](https://github.com/lamngockhuong/supabase-next-demo)

## 1.10 🧾 Output sau phần này

> Sau khi hoàn tất Phần 1, dev mới nên có thể:
>
> - [x] Tạo project Supabase local + kết nối bằng CLI
> - [x] Tạo Next.js app và kết nối Supabase thành công
> - [x] Hiểu cấu trúc project chuẩn nội bộ
> - [x] Build & chạy được pipeline basic (GitHub Actions)
> - [x] Có môi trường sẵn để học tiếp Phần 2 (Auth)
