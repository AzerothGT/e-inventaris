import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import { NotFound } from "../components/ui/NotFound";
import appCss from "../styles.css?url";

const Devtools = import.meta.env.DEV
	? lazy(() => import("../components/devtools/Devtools"))
	: null;

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "E-Inventaris - SMK Al Basyariah" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/icon-512.png", type: "image/png" },
			{ rel: "manifest", href: "/manifest.json" },
		],
	}),

	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext();

	useEffect(() => {
		if (typeof window !== "undefined" && "serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker
					.register("/sw.js", { scope: "/" })
					.then((reg) => {
						console.log("Service Worker registered with scope:", reg.scope);
					})
					.catch((err) => {
						console.error("Service Worker registration failed:", err);
					});
			});
		}
	}, []);

	return (
		<html lang="id">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					{children}
					<Toaster richColors position="top-right" />
					{Devtools ? (
						<Suspense fallback={null}>
							<Devtools />
						</Suspense>
					) : null}
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
