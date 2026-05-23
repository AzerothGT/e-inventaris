# AGENTS.md — e-inventaris

## Agent Behavior (User Request)
- **Always** invoke the `find-skills` skill before starting work
- **Always** use caveman mode for communication (ultra-compressed, technically accurate)
- **Always** use `subagent-driven-development` skill for multi-task implementation work
- **Always** use `using-superpowers` skill at conversation start
- **Always** use `using-git-worktrees` skill for isolated feature work
- **Always** use `frontend-design` skill when building UI components, pages, or styling

## Project
- **TanStack Start** (React 19) + Vite 7 + Nitro server + file-based routing
- **Drizzle ORM** → Turso/LibSQL (SQLite), local fallback `sqlite.db`
- **Tailwind CSS 4** (Vite plugin), **Biome** (formatter/linter), **Zod** validation
- **React Hook Form** + Zod resolvers, **Sonner** toasts, **jsPDF** for reports

## Commands
```
pnpm dev          # dev server on :3000
pnpm build        # production build
pnpm serve        # preview build
pnpm test         # vitest run
npx drizzle-kit generate  # generate migrations from schema
npx drizzle-kit migrate   # apply migrations
```

## Key Paths
- `src/routes/` — file-based routes (TanStack Router). `__root.tsx` is layout
- `src/routeTree.gen.ts` — **auto-generated**, never edit manually
- `src/server/functions/` — server-side logic (auth, barang, dashboard, etc.)
- `src/db/schema.ts` — Drizzle schema. `src/db/index.ts` — db instance
- `drizzle/` — migration output
- `src/components/ui/` — shared UI components

## Database
- Dialect: `turso` (libsql). Env: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Falls back to `file:sqlite.db` when env vars missing
- Tables: users, kategori, ruangan, barang, pengadaanEvent, pengadaanItem, permintaan_pengadaan (legacy), notifikasi, approval_logs

## Conventions
- Biome: tabs, double quotes, `src/routeTree.gen.ts` and `src/styles.css` excluded
- TypeScript: strict, `noUnusedLocals`, `noUnusedParameters`, `@/*` path alias
- Roles: admin, kaprog, penjaga_lab, orang_tu, wakasek, kepala_sekolah, tu_admin
- Route guards via `_authenticated.tsx` layout
