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

## Behavioral Guidelines
Behavioral guidelines to reduce common LLM coding mistakes.

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**
When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.
- Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**
Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
