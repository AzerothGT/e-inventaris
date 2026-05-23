import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { permintaanPengadaan, barang, approvalLogs, users } from "../../db/schema";
import { getAuthSession } from "../../lib/auth";
import { eq, and, ne, count, sql, desc } from "drizzle-orm";
import { PermintaanStatus, UserRole } from "../../lib/approvals";

export const getDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getAuthSession();
    if (!session) throw new Error("Unauthorized");

    const userId = session.id;
    const role = session.role as UserRole;

    // 1. Total Barang
    const [barangCount] = await db.select({ value: count() }).from(barang);

    // 2. Permintaan Aktif (Not selesai or ditolak)
    const [activeRequestsCount] = await db
      .select({ value: count() })
      .from(permintaanPengadaan)
      .where(
        and(
          ne(permintaanPengadaan.status, "selesai"),
          ne(permintaanPengadaan.status, "ditolak")
        )
      );

    // 3. Persetujuan Saya (Role-based)
    let approvalNeededCount = 0;
    if (role !== 'penjaga_lab' && role !== 'orang_tu') {
      let statusToWatch: PermintaanStatus[] = [];
      if (role === 'admin') {
        statusToWatch = ['menunggu_kaprog', 'menunggu_wakasek', 'menunggu_kepsek', 'disetujui', 'proses_pembelian'];
      } else if (role === 'kaprog') {
        statusToWatch = ['menunggu_kaprog'];
      } else if (role === 'wakasek') {
        statusToWatch = ['menunggu_wakasek'];
      } else if (role === 'kepala_sekolah') {
        statusToWatch = ['menunggu_kepsek'];
      } else if (role === 'tu_admin' || role === 'orang_tu') {
        statusToWatch = ['disetujui', 'proses_pembelian'];
      }

      if (statusToWatch.length > 0) {
        const [result] = await db
          .select({ value: count() })
          .from(permintaanPengadaan)
          .where(sql`${permintaanPengadaan.status} IN ${statusToWatch}`);
        approvalNeededCount = result.value;
      }
    } else if (role === 'penjaga_lab') {
      // For Requesters, "Persetujuan Saya" might mean "My Pending Requests"
      const [result] = await db
        .select({ value: count() })
        .from(permintaanPengadaan)
        .where(
          and(
            eq(permintaanPengadaan.diajukanOleh, userId),
            ne(permintaanPengadaan.status, 'selesai'),
            ne(permintaanPengadaan.status, 'ditolak')
          )
        );
      approvalNeededCount = result.value;
    }

    // 4. Selesai (Bulan ini)
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const [completedCount] = await db
      .select({ value: count() })
      .from(approvalLogs)
      .where(
        and(
          eq(approvalLogs.newStatus, "selesai"),
          sql`${approvalLogs.createdAt} >= ${firstDayOfMonth.getTime()}`
        )
      );

    return {
      totalBarang: barangCount.value,
      activeRequests: activeRequestsCount.value,
      pendingAction: approvalNeededCount,
      completedMonth: completedCount.value,
    };
  });

export const getRecentActivity = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getAuthSession();
    if (!session) throw new Error("Unauthorized");


    // Fetch last 10 logs with user info
    let query = db
      .select({
        id: approvalLogs.id,
        action: approvalLogs.action,
        newStatus: approvalLogs.newStatus,
        createdAt: approvalLogs.createdAt,
        userName: users.name,
        userRole: users.role,
        permintaanId: approvalLogs.permintaanId,
        namaBarang: permintaanPengadaan.namaBarang,
      })
      .from(approvalLogs)
      .leftJoin(users, eq(approvalLogs.userId, users.id))
      .leftJoin(permintaanPengadaan, eq(approvalLogs.permintaanId, permintaanPengadaan.id))
      .orderBy(desc(approvalLogs.createdAt))
      .limit(10);

    // If it's a requester, maybe they only want to see their own request updates?
    // But usually activity feeds show "system activity" for transparency.
    // Let's keep it broad for now but maybe filter for pure requesters if they have too much noise.

    return await query;
  });

export const getApprovalQueue = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getAuthSession();
    if (!session) throw new Error("Unauthorized");

    const role = session.role as UserRole;
    if (role === 'penjaga_lab') return [];

    let statusToWatch: PermintaanStatus[] = [];
    if (role === 'admin') {
      statusToWatch = ['menunggu_kaprog', 'menunggu_wakasek', 'menunggu_kepsek', 'disetujui', 'proses_pembelian'];
    } else if (role === 'kaprog') {
      statusToWatch = ['menunggu_kaprog'];
    } else if (role === 'wakasek') {
      statusToWatch = ['menunggu_wakasek'];
    } else if (role === 'kepala_sekolah') {
      statusToWatch = ['menunggu_kepsek'];
    } else if (role === 'tu_admin' || role === 'orang_tu') {
      statusToWatch = ['disetujui', 'proses_pembelian'];
    }

    if (statusToWatch.length === 0) return [];

    const queue = await db
      .select({
        id: permintaanPengadaan.id,
        namaBarang: permintaanPengadaan.namaBarang,
        jumlah: permintaanPengadaan.jumlah,
        prioritas: permintaanPengadaan.prioritas,
        status: permintaanPengadaan.status,
        createdAt: permintaanPengadaan.createdAt,
        requesterName: users.name,
      })
      .from(permintaanPengadaan)
      .leftJoin(users, eq(permintaanPengadaan.diajukanOleh, users.id))
      .where(sql`${permintaanPengadaan.status} IN ${statusToWatch}`)
      .orderBy(desc(permintaanPengadaan.createdAt));

    return queue;
  });
