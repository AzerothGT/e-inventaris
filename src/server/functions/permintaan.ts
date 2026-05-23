import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import {
  pengadaanEvent,
  pengadaanItem,
  barang,
  approvalLogs,
  users,
  notifikasi,
} from "../../db/schema";
import { getAuthSession } from "../../lib/auth";
import { z } from "zod";
import {
  isValidTransition,
  PermintaanStatus,
  UserRole,
  STATUS_METADATA,
} from "../../lib/approvals";
import { eq, desc, inArray, and } from "drizzle-orm";

async function sendNotification(userId: string, tipe: string, pesan: string) {
  await db.insert(notifikasi).values({
    id: crypto.randomUUID(),
    userId,
    tipe,
    pesan,
    dibaca: false,
    createdAt: new Date(),
  });
}

async function notifyRoles(roles: string[], tipe: string, pesan: string) {
  const targetUsers = await db
    .select()
    .from(users)
    .where(inArray(users.role, roles as any));
  for (const user of targetUsers) {
    await sendNotification(user.id, tipe, pesan);
  }
}

// ─── Create Event ─────────────────────────────────────────────────────────────

export const createPengadaanEvent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      namaEvent: z.string().min(1, "Nama event harus diisi"),
      deskripsi: z.string().min(1, "Deskripsi harus diisi"),
      prioritas: z.enum(["rendah", "sedang", "tinggi"]),
      items: z
        .array(
          z.object({
            namaBarang: z.string().min(1, "Nama barang harus diisi"),
            merek: z.string().optional(),
            kategori: z.string().optional(),
            jumlah: z.number().int().min(1, "Jumlah minimal 1"),
            satuan: z.string().default("Unit"),
            imageUrl: z.string().optional(),
          })
        )
        .min(1, "Minimal 1 item harus ditambahkan"),
    })
  )
  .handler(async ({ data }) => {
    const session = await getAuthSession();
    if (!session) throw new Error("Anda harus login untuk melakukan permintaan");

    const eventId = crypto.randomUUID();
    const shortId = eventId.slice(0, 4).toUpperCase();
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const kodePengadaan = `PR-${today}-${shortId}`;

    await db.insert(pengadaanEvent).values({
      id: eventId,
      kodePengadaan,
      namaEvent: data.namaEvent,
      deskripsi: data.deskripsi,
      prioritas: data.prioritas,
      status: "menunggu_kaprog",
      diajukanOleh: session.id,
      createdAt: new Date(),
    });

    await db.insert(pengadaanItem).values(
      data.items.map((item) => ({
        id: crypto.randomUUID(),
        eventId,
        namaBarang: item.namaBarang,
        merek: item.merek,
        kategori: item.kategori,
        jumlah: item.jumlah,
        satuan: item.satuan,
        imageUrl: item.imageUrl,
        createdAt: new Date(),
      }))
    );

    await db.insert(approvalLogs).values({
      id: crypto.randomUUID(),
      permintaanId: eventId,
      userId: session.id,
      action: "Mengajukan Permintaan",
      newStatus: "menunggu_kaprog",
      createdAt: new Date(),
    });

    await notifyRoles(
      ["kaprog", "admin"],
      "Permintaan Baru",
      `Ada permintaan baru: "${data.namaEvent}" dari ${session.name}`
    );

    return { success: true, id: eventId };
  });

// ─── Get Event List ───────────────────────────────────────────────────────────

export const getPengadaanEventList = createServerFn({ method: "GET" }).handler(
  async () => {
    const events = await db
      .select({
        id: pengadaanEvent.id,
        kodePengadaan: pengadaanEvent.kodePengadaan,
        namaEvent: pengadaanEvent.namaEvent,
        deskripsi: pengadaanEvent.deskripsi,
        prioritas: pengadaanEvent.prioritas,
        status: pengadaanEvent.status,
        diajukanOleh: pengadaanEvent.diajukanOleh,
        createdAt: pengadaanEvent.createdAt,
        requesterName: users.name,
        requesterRole: users.role,
      })
      .from(pengadaanEvent)
      .leftJoin(users, eq(pengadaanEvent.diajukanOleh, users.id))
      .orderBy(desc(pengadaanEvent.createdAt));

    const allItems = await db.select().from(pengadaanItem);

    return events.map((e) => ({
      ...e,
      items: allItems.filter((i) => i.eventId === e.id),
    }));
  }
);

// ─── Get Items for an Event ───────────────────────────────────────────────────

export const getPengadaanItems = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: eventId }) => {
    return db
      .select()
      .from(pengadaanItem)
      .where(eq(pengadaanItem.eventId, eventId));
  });

// ─── Update Event Status ──────────────────────────────────────────────────────

export const updatePengadaanStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      status: z.enum([
        "menunggu_kaprog",
        "menunggu_wakasek",
        "menunggu_kepsek",
        "disetujui",
        "proses_pembelian",
        "selesai",
        "ditolak",
      ]),
      catatan: z.string().optional(),
      // Only used when status === 'selesai'
      itemUpdates: z
        .array(
          z.object({
            itemId: z.string(),
            targetRuanganId: z.string(),
            targetLemari: z.string().optional(),
            kondisiDiterima: z.enum(["baik", "rusak_ringan", "rusak_berat"]),
          })
        )
        .optional(),
    })
  )
  .handler(async ({ data }) => {
    const session = await getAuthSession();
    if (!session) throw new Error("Unauthorized");

    const [event] = await db
      .select()
      .from(pengadaanEvent)
      .where(eq(pengadaanEvent.id, data.id))
      .limit(1);

    if (!event) throw new Error("Permintaan tidak ditemukan");

    if (
      !isValidTransition(
        event.status as PermintaanStatus,
        data.status as PermintaanStatus,
        session.role as UserRole
      )
    ) {
      throw new Error("Transisi status tidak valid untuk role Anda");
    }

    const updateData: any = { status: data.status };
    if (data.status === "disetujui") {
      updateData.disetujuiOleh = session.id;
    }

    // Handle selesai: update each item + create inventory
    if (data.status === "selesai") {
      if (!data.itemUpdates || data.itemUpdates.length === 0) {
        throw new Error(
          "Data penerimaan per item harus diisi untuk menyelesaikan permintaan"
        );
      }

      for (const upd of data.itemUpdates) {
        // Update item record
        await db
          .update(pengadaanItem)
          .set({
            targetRuanganId: upd.targetRuanganId,
            targetLemari: upd.targetLemari || "",
            kondisiDiterima: upd.kondisiDiterima,
          })
          .where(eq(pengadaanItem.id, upd.itemId));

        // Fetch the item to get its details
        const [item] = await db
          .select()
          .from(pengadaanItem)
          .where(eq(pengadaanItem.id, upd.itemId))
          .limit(1);

        if (!item) continue;

        // Check for existing matching barang
        const [existingBarang] = await db
          .select()
          .from(barang)
          .where(
            and(
              eq(barang.nama, item.namaBarang),
              eq(barang.merek, item.merek || "Tidak Spesifik"),
              eq(barang.ruanganId, upd.targetRuanganId),
              eq(barang.status, upd.kondisiDiterima),
              eq(barang.lemari, upd.targetLemari || "")
            )
          )
          .limit(1);

        if (existingBarang) {
          await db
            .update(barang)
            .set({ jumlah: existingBarang.jumlah + item.jumlah })
            .where(eq(barang.id, existingBarang.id));
        } else {
          const shortId = item.id.slice(0, 4).toUpperCase();
          const kodeBarang = `BRG-${new Date().getFullYear()}-${shortId}`;
          await db.insert(barang).values({
            id: crypto.randomUUID(),
            kodeBarang,
            nama: item.namaBarang,
            merek: item.merek || "Tidak Spesifik",
            kategori: item.kategori || "Umum",
            jumlah: item.jumlah,
            satuan: item.satuan || "Unit",
            ruanganId: upd.targetRuanganId,
            lemari: upd.targetLemari || "",
            status: upd.kondisiDiterima,
            imageUrl: item.imageUrl,
            tahunPengadaan: new Date().getFullYear(),
            createdAt: new Date(),
          });
        }
      }
    }

    await db
      .update(pengadaanEvent)
      .set(updateData)
      .where(eq(pengadaanEvent.id, data.id));

    await db.insert(approvalLogs).values({
      id: crypto.randomUUID(),
      permintaanId: data.id,
      userId: session.id,
      action: `Update Status ke ${data.status.replace(/_/g, " ")}`,
      previousStatus: event.status,
      newStatus: data.status,
      catatan: data.catatan,
      createdAt: new Date(),
    });

    const newStatusLabel =
      STATUS_METADATA[data.status as PermintaanStatus].label;
    await sendNotification(
      event.diajukanOleh,
      "Update Status",
      `Permintaan "${event.namaEvent}" sekarang: ${newStatusLabel}`
    );

    if (data.status === "menunggu_wakasek") {
      await notifyRoles(
        ["wakasek", "admin"],
        "Persetujuan Diperlukan",
        `Permintaan "${event.namaEvent}" menunggu persetujuan Wakasek`
      );
    } else if (data.status === "menunggu_kepsek") {
      await notifyRoles(
        ["kepala_sekolah", "admin"],
        "Persetujuan Diperlukan",
        `Permintaan "${event.namaEvent}" menunggu persetujuan Kepsek`
      );
    } else if (data.status === "disetujui") {
      await notifyRoles(
        ["tu_admin", "orang_tu", "admin"],
        "Proses Pembelian",
        `Permintaan "${event.namaEvent}" telah disetujui, siap dibeli`
      );
    }

    return { success: true };
  });

// ─── Approval Logs ────────────────────────────────────────────────────────────

export const getApprovalLogs = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: eventId }) => {
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
      .where(eq(approvalLogs.permintaanId, eventId))
      .orderBy(desc(approvalLogs.createdAt));

    return logs;
  });
