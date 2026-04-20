import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { notifikasi } from "../../db/schema";
import { getAuthSession } from "../../lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const getNotifications = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getAuthSession();
    if (!session) return [];

    const list = await db
      .select()
      .from(notifikasi)
      .where(eq(notifikasi.userId, session.id))
      .orderBy(desc(notifikasi.createdAt));

    return list;
  });

export const getUnreadNotificationCount = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getAuthSession();
    if (!session) return 0;

    const result = await db
      .select({ count: notifikasi.id })
      .from(notifikasi)
      .where(
        and(
          eq(notifikasi.userId, session.id),
          eq(notifikasi.dibaca, false)
        )
      );

    return result.length;
  });

export const markAsRead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().optional() }))
  .handler(async ({ data }) => {
    const session = await getAuthSession();
    if (!session) throw new Error("Unauthorized");

    if (data.id) {
      await db
        .update(notifikasi)
        .set({ dibaca: true })
        .where(
          and(
            eq(notifikasi.id, data.id),
            eq(notifikasi.userId, session.id)
          )
        );
    } else {
      // Mark all as read
      await db
        .update(notifikasi)
        .set({ dibaca: true })
        .where(eq(notifikasi.userId, session.id));
    }

    return { success: true };
  });
