import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { pushSubscriptions } from "../../db/schema";
import { getAuthSession } from "../../lib/auth";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Initialize VAPID keys lazily
let keysInitialized = false;
let vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
};

async function getWebPush() {
  // Hide imports from Vite static analyzer to prevent browser bundling
  const importName = "web-push";
  const fsName = "fs";
  const pathName = "path";

  const webpush = (await import(importName)).default;
  const fs = await import(fsName);
  const path = await import(pathName);
  
  if (!keysInitialized) {
    const keysPath = path.resolve(process.cwd(), "vapid-keys.json");

    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      if (fs.existsSync(keysPath)) {
        try {
          vapidKeys = JSON.parse(fs.readFileSync(keysPath, "utf-8"));
        } catch (e) {
          console.error("Failed to read vapid-keys.json", e);
        }
      }

      if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
        const keys = webpush.generateVAPIDKeys();
        vapidKeys = {
          publicKey: keys.publicKey,
          privateKey: keys.privateKey,
        };
        try {
          fs.writeFileSync(keysPath, JSON.stringify(vapidKeys, null, 2));
        } catch (e) {
          console.error("Failed to write vapid-keys.json", e);
        }
      }
    }

    webpush.setVapidDetails(
      "mailto:admin@example.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    keysInitialized = true;
  }

  return webpush;
}

export const getVapidPublicKey = createServerFn({ method: "GET" })
  .handler(async () => {
    // Force key initialization
    await getWebPush();
    return vapidKeys.publicKey;
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

    // Clean up any existing subscription with the same endpoint
    await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, data.endpoint));

    // Save new subscription
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

/**
 * Send a web push notification to all subscriptions of a specific user.
 */
export async function sendWebPushNotification(
  userId: string,
  title: string,
  body: string,
  url: string = "/"
) {
  const webpush = await getWebPush();

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  const payload = JSON.stringify({ title, body, url });

  const promises = subs.map((sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    return webpush
      .sendNotification(pushSubscription, payload)
      .catch(async (error: { statusCode: number; }) => {
        // If subscription is expired/invalid (Gone 410 or Not Found 404), remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db
            .delete(pushSubscriptions)
            .where(eq(pushSubscriptions.id, sub.id));
        } else {
          console.error("Web Push error:", error);
        }
      });
  });

  await Promise.all(promises);
}
