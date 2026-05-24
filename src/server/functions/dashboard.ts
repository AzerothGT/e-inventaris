import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { pengadaanEvent, pengadaanItem, barang, approvalLogs, users } from "../../db/schema";
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
      .from(pengadaanEvent)
      .where(
        and(
          ne(pengadaanEvent.status, "selesai"),
          ne(pengadaanEvent.status, "ditolak")
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
          .from(pengadaanEvent)
          .where(sql`${pengadaanEvent.status} IN ${statusToWatch}`);
        approvalNeededCount = result.value;
      }
    } else if (role === 'penjaga_lab') {
      // For Requesters, "Persetujuan Saya" means "My Pending Requests"
      const [result] = await db
        .select({ value: count() })
        .from(pengadaanEvent)
        .where(
          and(
            eq(pengadaanEvent.diajukanOleh, userId),
            ne(pengadaanEvent.status, 'selesai'),
            ne(pengadaanEvent.status, 'ditolak')
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
        namaEvent: pengadaanEvent.namaEvent,
      })
      .from(approvalLogs)
      .leftJoin(users, eq(approvalLogs.userId, users.id))
      .leftJoin(pengadaanEvent, eq(approvalLogs.permintaanId, pengadaanEvent.id))
      .orderBy(desc(approvalLogs.createdAt))
      .limit(10);

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
        id: pengadaanEvent.id,
        namaEvent: pengadaanEvent.namaEvent,
        prioritas: pengadaanEvent.prioritas,
        status: pengadaanEvent.status,
        createdAt: pengadaanEvent.createdAt,
        requesterName: users.name,
        itemCount: sql<number>`count(${pengadaanItem.id})`,
        totalJumlah: sql<number>`sum(${pengadaanItem.jumlah})`,
      })
      .from(pengadaanEvent)
      .leftJoin(users, eq(pengadaanEvent.diajukanOleh, users.id))
      .leftJoin(pengadaanItem, eq(pengadaanEvent.id, pengadaanItem.eventId))
      .where(sql`${pengadaanEvent.status} IN ${statusToWatch}`)
      .groupBy(pengadaanEvent.id, users.name)
      .orderBy(desc(pengadaanEvent.createdAt));

    return queue;
  });

