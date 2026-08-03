import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;
const PREFIX = "scrypt";

function scryptAsync(password: string, salt: Buffer): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		scrypt(password, salt, KEYLEN, (err, derived) => {
			if (err) reject(err);
			else resolve(derived);
		});
	});
}

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16);
	const derived = await scryptAsync(password, salt);
	return `${PREFIX}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function isHashed(stored: string): boolean {
	return stored.startsWith(`${PREFIX}$`);
}

export async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	if (!isHashed(stored)) {
		// Legacy plaintext password — direct compare for transparent migration.
		return password === stored;
	}

	const [, saltHex, hashHex] = stored.split("$");
	if (!saltHex || !hashHex) return false;

	const salt = Buffer.from(saltHex, "hex");
	const expected = Buffer.from(hashHex, "hex");
	const derived = await scryptAsync(password, salt);

	if (derived.length !== expected.length) return false;
	return timingSafeEqual(derived, expected);
}
