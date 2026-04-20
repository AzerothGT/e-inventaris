import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { permintaanPengadaan, barang, approvalLogs, users } from "../../db/schema";
import { getAuthSession } from "../../lib/auth";
import { z } from "zod";
import { isValidTransition, PermintaanStatus, UserRole } from "../../lib/approvals";
import { eq, desc } from "drizzle-orm";

export const createPermintaan = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      namaBarang: z.string().min(1, "Nama barang harus diisi"),
      merek: z.string().optional(),
      kategori: z.string().optional(),
      jumlah: z.number().int().min(1, "Jumlah minimal 1"),
      deskripsi: z.string().min(1, "Alasan harus diisi"),
      prioritas: z.enum(["rendah", "sedang", "tinggi"]),
    })
  )
  .handler(async ({ data }) => {
    const session = await getAuthSession();
    if (!session) {
      throw new Error("Anda harus login untuk melakukan permintaan");
    }

    const newPermintaan = {
      id: crypto.randomUUID(),
      ...data,
      status: "menunggu_kaprog" as const,
      diajukanOleh: session.id,
      createdAt: new Date(),
    };

    await db.insert(permintaanPengadaan).values(newPermintaan);

    // Initial log
    await db.insert(approvalLogs).values({
      id: crypto.randomUUID(),
      permintaanId: newPermintaan.id,
      userId: session.id,
      action: "Mengajukan Permintaan",
      newStatus: "menunggu_kaprog",
      createdAt: new Date(),
    });

    return { success: true, data: newPermintaan };
  });

export const getPermintaanList = createServerFn({ method: "GET" })
  .handler(async () => {
    const list = await db
      .select()
      .from(permintaanPengadaan)
      .orderBy(permintaanPengadaan.createdAt);

    return list;
  });

export const updatePermintaanStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      status: z.enum([
        'menunggu_kaprog', 
        'menunggu_wakasek', 
        'menunggu_kepsek', 
        'disetujui', 
        'proses_pembelian', 
        'selesai', 
        'ditolak'
      ]),
      // Optional data for final step
      targetRuanganId: z.string().optional(),
      targetLemari: z.string().optional(),
      kondisiDiterima: z.enum(['baik', 'rusak_ringan', 'rusak_berat']).optional(),
    })
  )
  .handler(async ({ data }) => {
    const session = await getAuthSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const [permintaan] = await db
      .select()
      .from(permintaanPengadaan)
      .where(eq(permintaanPengadaan.id, data.id))
      .limit(1);

    if (!permintaan) {
      throw new Error("Permintaan tidak ditemukan");
    }

    if (!isValidTransition(permintaan.status as PermintaanStatus, data.status as PermintaanStatus, session.role as UserRole)) {
      throw new Error("Transisi status tidak valid untuk role Anda");
    }

    const updateData: any = { status: data.status };
    
    // Capture transition metadata
    if (data.status === 'disetujui') {
      updateData.disetujuiOleh = session.id;
    }

    // Capture inventory metadata if provided (final step)
    if (data.targetRuanganId) updateData.targetRuanganId = data.targetRuanganId;
    if (data.targetLemari) updateData.targetLemari = data.targetLemari;
    if (data.kondisiDiterima) updateData.kondisiDiterima = data.kondisiDiterima;

    // Handle "selesai" - Create Inventory Item
    if (data.status === 'selesai') {
      if (!data.targetRuanganId || !data.kondisiDiterima) {
        throw new Error("Data inventory (ruangan & kondisi) harus diisi untuk menyelesaikan permintaan");
      }

      // 1. Create a unique code for the new item
      const shortId = data.id.slice(0, 4).toUpperCase();
      const kodeBarang = `BRG-${new Date().getFullYear()}-${shortId}`;

      // 2. Insert into barang table
      await db.insert(barang).values({
        id: crypto.randomUUID(),
        kodeBarang,
        nama: permintaan.namaBarang,
        merek: permintaan.merek || "Tidak Spesifik",
        kategori: permintaan.kategori || "Umum",
        jumlah: permintaan.jumlah,
        ruanganId: data.targetRuanganId,
        status: data.kondisiDiterima,
        tahunPengadaan: new Date().getFullYear(),
        createdAt: new Date(),
      });
    }

    await db
      .update(permintaanPengadaan)
      .set(updateData)
      .where(eq(permintaanPengadaan.id, data.id));

    // Log the transition
    await db.insert(approvalLogs).values({
      id: crypto.randomUUID(),
      permintaanId: data.id,
      userId: session.id,
      action: `Update Status ke ${data.status.replace('_', ' ')}`,
      previousStatus: permintaan.status,
      newStatus: data.status,
      catatan: data.status === 'selesai' ? `Barang diterima di ${data.targetRuanganId}` : undefined,
      createdAt: new Date(),
    });

    return { success: true };
  });

export const getApprovalLogs = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: permintaanId }) => {
    const logs = await db
      .select({
        id: approvalLogs.id,
        action: approvalLogs.action,
        previousStatus: approvalLogs.previousStatus,
        newStatus: approvalLogs.newStatus,
        catatan: approvalLogs.catatan,
        createdAt: approvalLogs.createdAt,
        userName: users.name,
        userRole: users.role,
      })
      .from(approvalLogs)
      .leftJoin(users, eq(approvalLogs.userId, users.id))
      .where(eq(approvalLogs.permintaanId, permintaanId))
      .orderBy(desc(approvalLogs.createdAt));

    return logs;
  });
