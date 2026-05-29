# 📦 e-inventaris

[![React Version](https://img.shields.io/badge/react-v19.0-blue.svg)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/vite-v7.0-purple.svg)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/drizzle-orm-yellow.svg)](https://orm.drizzle.team/)
[![Database](https://img.shields.io/badge/database-Turso%20%2F%20SQLite-00ebc7.svg)](https://turso.tech/)
[![Linter/Formatter](https://img.shields.io/badge/linter-biome-fca311.svg)](https://biomejs.dev/)

A modern, high-performance School Inventory Management System built using the **TanStack Start** framework (React 19, Vite 7, and Nitro server) paired with **Drizzle ORM** and **Turso (LibSQL)** database.

---

## ✨ Features

- **📊 Modern Dashboard:** Real-time stats, system health summaries, and dynamic notifications.
- **🛡️ Role-Based Access Control (RBAC):** Distinct interfaces and permissions for `admin`, `kaprog`, `penjaga_lab`, `orang_tu`, `wakasek`, `kepala_sekolah`, and `tu_admin`.
- **📦 Asset Tracking (Barang):** Complete tracking of assets, including custom serial numbers, room assignments, physical state/condition (`baik`, `rusak_ringan`, `rusak_berat`), and image uploads.
- **🏗️ Event-Based Procurement (Pengadaan):** Fully audited multi-item request, review, and approval flow with automatic log history.
- **📂 Structural Units:** Manage categories (`kategori`) and rooms/locations (`ruangan`) seamlessly.
- **📄 PDF Export:** Download customized PDF summaries of inventory and procurement workflows using `jsPDF`.

---

## 🛠️ Tech Stack

- **Frontend:** [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview), [Vite 7](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` plugin)
- **Database & ORM:** [Drizzle ORM](https://orm.drizzle.team/), [Turso / LibSQL (SQLite)](https://turso.tech/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Formatting & Linting:** [Biome](https://biomejs.dev/)

---

## 📂 Project Structure

```
├── drizzle/                # Database migrations
├── public/                 # Static assets
└── src/
    ├── components/         # Shared UI components
    │   └── ui/             # Core UI elements (Sonner, layouts)
    ├── db/                 # Drizzle schema and client configurations
    ├── routes/             # TanStack Router file-based pages/endpoints
    │   ├── api/            # Server-side API endpoints
    │   └── _authenticated/ # Protected routes (Dashboard, inventory, rooms)
    ├── server/             # Server functions (authentication, logic)
    ├── routeTree.gen.ts    # Auto-generated routing tree (do not modify)
    └── styles.css          # Global Tailwind CSS imports
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** >= 18
- **pnpm** >= 8 (recommended)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/e-inventaris.git
cd e-inventaris
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory:
```env
TURSO_DATABASE_URL="your-turso-database-url"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```
*Note: If environment variables are omitted, the application will fallback to a local SQLite database (`sqlite.db`).*

### 5. Setup the Database
Generate and apply database migrations to setup the tables:
```bash
# Generate migration files
npx drizzle-kit generate

# Run migrations to target database
npx drizzle-kit migrate
```

### 6. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Commands Reference

- `pnpm dev` - Start development server.
- `pnpm build` - Compile production bundle.
- `pnpm serve` - Locally preview the production build.
- `pnpm test` - Run tests using Vitest.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
