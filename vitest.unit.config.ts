import { defineConfig } from "vitest/config";

// Minimal standalone config for unit tests that don't need the full Vite/TanStack
// plugin stack (which currently fails to load due to a broken dependency tree).
export default defineConfig({
	test: {
		environment: "node",
		include: ["src/lib/password.test.ts"],
	},
});
