/**
 * Server-only utility: send a web push notification to all subscriptions of a user.
 * This file must NOT be imported by any client-side code.
 */

import { db } from "../../db";
import { pushSubscriptions } from "../../db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

let keysInitialized = false;
let vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
};

async function getWebPush() {
  // Hide from Vite static analysis so this file is never bundled client-side
  const importName = "web-push";
  const webpush = (await import(/* @vite-ignore */ importName)).default;

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
        vapidKeys = { publicKey: keys.publicKey, privateKey: keys.privateKey };
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

export function getVapidPublicKeyValue() {
  return getWebPush().then(() => vapidKeys.publicKey);
}

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
    return webpush
      .sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
      .catch(async (error: { statusCode: number }) => {
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        } else {
          console.error("Web Push error:", error);
        }
      });
  });

  await Promise.all(promises);
}
