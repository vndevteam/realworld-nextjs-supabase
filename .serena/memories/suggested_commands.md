Setup:

- `pnpm install` (root) to install workspace deps.
- `cd supabase && supabase start` to boot local stack, then copy `.env.example` -> `.env.local`.

Development:

- `cd nextjs && pnpm dev` to run the web app on :3000.
- `cd nextjs && pnpm lint` for ESLint.
- `cd nextjs && pnpm build` / `pnpm start` for prod build.

Docs:

- `pnpm docs:dev` to serve VitePress (<http://localhost:5173>).
- `pnpm docs:build` then `pnpm docs:preview` to build/preview docs.

Supabase migrations (when added): use `supabase db diff` / `supabase db push` per CLI docs.
