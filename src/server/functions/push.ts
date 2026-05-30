import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { pushSubscriptions } from "../../db/schema";
import { getAuthSession } from "../../lib/auth";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { getVapidPublicKeyValue } from "../lib/push-sender";

export const getVapidPublicKey = createServerFn({ method: "GET" })
  .handler(async () => {
    return getVapidPublicKeyValue();
  });

export const subscribePush = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      endpoint: z.string(),
      keys: z.object({
        p256dh: z.string(),
        auth: z.string(),
      }),
    })
  )
  .handler(async ({ data }) => {
    const session = await getAuthSession();
    if (!session) throw new Error("Unauthorized");

    await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, data.endpoint));

    await db.insert(pushSubscriptions).values({
      id: crypto.randomUUID(),
      userId: session.id,
      endpoint: data.endpoint,
      p256dh: data.keys.p256dh,
      auth: data.keys.auth,
      createdAt: new Date(),
    });

    return { success: true };
  });

export const unsubscribePush = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      endpoint: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const session = await getAuthSession();
    if (!session) throw new Error("Unauthorized");

    await db
      .delete(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.endpoint, data.endpoint),
          eq(pushSubscriptions.userId, session.id)
        )
      );

    return { success: true };
  });
