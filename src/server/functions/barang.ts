import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { barang, ruangan } from "../../db/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { requireSession, requireRole } from "../../lib/auth";

const MANAGE_ROLES = ["admin", "penjaga_lab", "kaprog"] as const;

export const getBarangList = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireSession();
		const list = await db
			.select()
			.from(barang)
			.leftJoin(ruangan, eq(barang.ruanganId, ruangan.id))
			.orderBy(barang.createdAt);

		return list.map((row) => ({
			id: row.barang.id,
			kodeBarang: row.barang.kodeBarang,
			nama: row.barang.nama,
			kategori: row.barang.kategori,
			merek: row.barang.merek,
			noSeri: row.barang.noSeri,
			tahunPengadaan: row.barang.tahunPengadaan,
			jumlah: row.barang.jumlah,
			status: row.barang.status,
			createdAt: row.barang.createdAt,
			ruanganId: row.barang.ruanganId,
			namaRuangan: row.ruangan?.nama ?? null,
			gedung: row.ruangan?.gedung ?? null,
		}));
	},
);

export const getBarangById = createServerFn({ method: "GET" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await requireSession();
		const result = await db
			.select()
			.from(barang)
			.where(eq(barang.id, data.id))
			.limit(1);
		if (!result.length) throw new Error("Barang tidak ditemukan");
		return result[0];
	});

export const createBarang = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			kodeBarang: z.string().min(1, "Kode barang harus diisi"),
			nama: z.string().min(1, "Nama barang harus diisi"),
			kategori: z.string().min(1, "Kategori harus diisi"),
			merek: z.string().min(1, "Merek harus diisi"),
			noSeri: z.string().optional(),
			tahunPengadaan: z.number().int(),
			ruanganId: z.string().min(1, "Ruangan harus dipilih"),
			status: z.enum(["baik", "rusak_ringan", "rusak_berat"]),
			jumlah: z.number().int().min(1),
		}),
	)
	.handler(async ({ data }) => {
		await requireRole(MANAGE_ROLES);
		const newBarang = {
			id: crypto.randomUUID(),
			...data,
			noSeri: data.noSeri || null,
			createdAt: new Date(),
		};

		await db.insert(barang).values(newBarang);

		return { success: true, data: newBarang };
	});

export const createMultipleBarang = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			items: z.array(
				z.object({
					kodeBarang: z.string().min(1, "Kode barang harus diisi"),
					nama: z.string().min(1, "Nama barang harus diisi"),
					kategori: z.string().min(1, "Kategori harus diisi"),
					merek: z.string().min(1, "Merek harus diisi"),
					noSeri: z.string().optional(),
					tahunPengadaan: z.number().int(),
					ruanganId: z.string().min(1, "Ruangan harus dipilih"),
					status: z.enum(["baik", "rusak_ringan", "rusak_berat"]),
					jumlah: z.number().int().min(1),
				}),
			),
		}),
	)
	.handler(async ({ data }) => {
		await requireRole(MANAGE_ROLES);
		if (data.items.length === 0) {
			throw new Error("Minimal 1 barang harus ditambahkan");
		}

		// check for duplicate kodeBarang in DB
		const codes = data.items.map((i) => i.kodeBarang);
		const existing = await db
			.select({ kodeBarang: barang.kodeBarang })
			.from(barang)
			.where(inArray(barang.kodeBarang, codes));

		if (existing.length > 0) {
			const dupCodes = existing.map((e) => e.kodeBarang).join(", ");
			throw new Error(`Kode barang berikut sudah terdaftar: ${dupCodes}`);
		}

		const newBarangList = data.items.map((item) => ({
			id: crypto.randomUUID(),
			...item,
			noSeri: item.noSeri || null,
			createdAt: new Date(),
		}));

		await db.insert(barang).values(newBarangList);

		return { success: true, data: newBarangList };
	});

export const updateBarang = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			id: z.string(),
			kodeBarang: z.string().min(1, "Kode barang harus diisi"),
			nama: z.string().min(1, "Nama barang harus diisi"),
			kategori: z.string().min(1, "Kategori harus diisi"),
			merek: z.string().min(1, "Merek harus diisi"),
			noSeri: z.string().optional(),
			tahunPengadaan: z.number().int(),
			ruanganId: z.string().min(1, "Ruangan harus dipilih"),
			status: z.enum(["baik", "rusak_ringan", "rusak_berat"]),
			jumlah: z.number().int().min(1),
		}),
	)
	.handler(async ({ data }) => {
		await requireRole(MANAGE_ROLES);
		const { id, ...updateData } = data;

		await db
			.update(barang)
			.set({
				...updateData,
				noSeri: updateData.noSeri || null,
			})
			.where(eq(barang.id, id));

		return { success: true };
	});

export const deleteBarang = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		await requireRole(MANAGE_ROLES);
		await db.delete(barang).where(eq(barang.id, data.id));

		return { success: true };
	});
