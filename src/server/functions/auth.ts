import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schema";
import {
	clearAuthSession,
	getAuthSession,
	setAuthSession,
} from "../../lib/auth";
import { hashPassword, isHashed, verifyPassword } from "../../lib/password";

export const loginUser = createServerFn({ method: "POST" })
	.validator(
		z.object({
			username: z.string(),
			password: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const { username, password } = data;

		const result = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);
		const user = result[0];

		if (!user || !(await verifyPassword(password, user.password))) {
			throw new Error("Username atau password salah");
		}

		// Transparently upgrade legacy plaintext passwords to a hash on successful login.
		if (!isHashed(user.password)) {
			await db
				.update(users)
				.set({ password: await hashPassword(password), updatedAt: new Date() })
				.where(eq(users.id, user.id));
		}

		await setAuthSession(user.id);
		return {
			success: true,
			user: {
				id: user.id,
				username: user.username,
				role: user.role,
				name: user.name,
			},
		};
	});

export const logoutUser = createServerFn({ method: "POST" }).handler(
	async () => {
		await clearAuthSession();
		return { success: true };
	},
);

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await getAuthSession();
		if (!user) return null;
		return {
			id: user.id,
			username: user.username,
			role: user.role,
			name: user.name,
		};
	},
);
