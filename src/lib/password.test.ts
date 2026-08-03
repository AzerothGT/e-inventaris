import { describe, expect, it } from "vitest";
import { hashPassword, isHashed, verifyPassword } from "./password";

describe("password", () => {
	it("hashes to a prefixed salt$hash string", async () => {
		const hash = await hashPassword("secret123");
		expect(hash.startsWith("scrypt$")).toBe(true);
		expect(hash.split("$")).toHaveLength(3);
		expect(isHashed(hash)).toBe(true);
	});

	it("produces a different hash each time (random salt)", async () => {
		const a = await hashPassword("secret123");
		const b = await hashPassword("secret123");
		expect(a).not.toBe(b);
	});

	it("verifies a correct password against its hash", async () => {
		const hash = await hashPassword("secret123");
		expect(await verifyPassword("secret123", hash)).toBe(true);
	});

	it("rejects an incorrect password", async () => {
		const hash = await hashPassword("secret123");
		expect(await verifyPassword("wrong", hash)).toBe(false);
	});

	it("verifies legacy plaintext passwords for transparent migration", async () => {
		expect(isHashed("plaintextpw")).toBe(false);
		expect(await verifyPassword("plaintextpw", "plaintextpw")).toBe(true);
		expect(await verifyPassword("wrong", "plaintextpw")).toBe(false);
	});

	it("rejects malformed hash strings", async () => {
		expect(await verifyPassword("secret", "scrypt$onlyonepart")).toBe(false);
	});
});
