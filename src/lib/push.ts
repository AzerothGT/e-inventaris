import {
	getVapidPublicKey,
	subscribePush,
	unsubscribePush,
} from "../server/functions/push";

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export async function registerPush() {
	if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
		throw new Error("Push notifications are not supported by this browser.");
	}

	// Request permission
	const permission = await Notification.requestPermission();
	if (permission !== "granted") {
		throw new Error("Notification permission denied.");
	}

	// Register service worker
	const registration = await navigator.serviceWorker.register("/sw.js", {
		scope: "/",
	});

	// Get public VAPID key from server
	const publicVapidKey = await getVapidPublicKey();
	const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

	// Subscribe user
	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: convertedVapidKey,
	});

	// Parse keys
	const subscriptionJson = subscription.toJSON();
	if (!subscriptionJson.keys?.p256dh || !subscriptionJson.keys?.auth) {
		throw new Error("Invalid subscription keys received from push manager.");
	}

	// Save subscription to database
	await subscribePush({
		data: {
			endpoint: subscription.endpoint,
			keys: {
				p256dh: subscriptionJson.keys.p256dh,
				auth: subscriptionJson.keys.auth,
			},
		},
	});

	return subscription;
}

export async function unregisterPush() {
	if (!("serviceWorker" in navigator)) return;

	const registration = await navigator.serviceWorker.getRegistration("/");
	if (!registration) return;

	const subscription = await registration.pushManager.getSubscription();
	if (!subscription) return;

	// Unsubscribe from push manager
	await subscription.unsubscribe();

	// Remove from server
	await unsubscribePush({
		data: {
			endpoint: subscription.endpoint,
		},
	});
}

export async function getPushSubscriptionState() {
	if (
		typeof window === "undefined" ||
		!("serviceWorker" in navigator) ||
		!("PushManager" in window)
	) {
		return {
			supported: false,
			subscribed: false,
			permission: "default" as NotificationPermission,
		};
	}

	const registration = await navigator.serviceWorker.getRegistration("/");
	if (!registration) {
		return {
			supported: true,
			subscribed: false,
			permission: Notification.permission,
		};
	}

	const subscription = await registration.pushManager.getSubscription();
	return {
		supported: true,
		subscribed: !!subscription,
		permission: Notification.permission,
	};
}
