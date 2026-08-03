import { createHmac, timingSafeEqual } from "node:crypto";
import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

const SESSION_COOKIE_NAME = "e-inventaris-session";

function getSessionSecret(): string {
	const secret = process.env.SESSION_SECRET;
	if (secret) return secret;
	console.warn(
		"SESSION_SECRET is not set; using an insecure development default. Set SESSION_SECRET in your environment for production.",
	);
	return "dev-insecure-session-secret";
}

function sign(value: string): string {
	return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

// Cookie value is `userId.signature`. Returns the userId only if the signature matches.
function verifySignedValue(signed: string): string | null {
	const sepIndex = signed.lastIndexOf(".");
	if (sepIndex <= 0) return null;

	const value = signed.slice(0, sepIndex);
	const signature = signed.slice(sepIndex + 1);
	const expected = sign(value);

	const sigBuf = Buffer.from(signature, "hex");
	const expectedBuf = Buffer.from(expected, "hex");
	if (sigBuf.length !== expectedBuf.length) return null;
	if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

	return value;
}

export async function getAuthSession() {
	const signed = getCookie(SESSION_COOKIE_NAME);
	if (!signed) return null;

	const sessionId = verifySignedValue(signed);
	if (!sessionId) return null;

	try {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, sessionId))
			.limit(1);
		return result[0] || null;
	} catch (error) {
		console.error("Session fetch error:", error);
		return null;
	}
}

export async function setAuthSession(userId: string) {
	setCookie(SESSION_COOKIE_NAME, `${userId}.${sign(userId)}`, {
		maxAge: 60 * 60 * 24 * 7, // 1 week
		httpOnly: true,
		sameSite: "lax",
		path: "/",
	});
}

export async function clearAuthSession() {
	deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
}

// Throws if no valid session. Returns the authenticated user.
export async function requireSession() {
	const session = await getAuthSession();
	if (!session) throw new Error("Unauthorized: Anda harus login");
	return session;
}

// Throws if the session role is not in `roles`. Returns the authenticated user.
export async function requireRole(roles: readonly string[]) {
	const session = await requireSession();
	if (!roles.includes(session.role)) {
		throw new Error("Unauthorized: Anda tidak memiliki akses untuk aksi ini");
	}
	return session;
}
