interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>;
	readonly userChoice: Promise<{ outcome: string }>;
	prompt(): Promise<void>;
}

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown, Download, LogOut, Package } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ROLE_DEPARTMENTS, type UserRole } from "../../lib/approvals";
import {
	getPushSubscriptionState,
	registerPush,
	unregisterPush,
} from "../../lib/push";
import { cn } from "../../lib/utils";
import { getCurrentUser, logoutUser } from "../../server/functions/auth";
import { NavbarBottom } from "./NavbarBottom";
import { NotificationBell } from "./NotificationBell";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
	const [profileOpen, setProfileOpen] = React.useState(false);
	const [isPushEnabled, setIsPushEnabled] = React.useState(false);
	const [isPushPending, setIsPushPending] = React.useState(false);
	const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
	const queryClient = useQueryClient();
	const router = useRouter();

	React.useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;
		const promptEvent = deferredPrompt as unknown as BeforeInstallPromptEvent;
		promptEvent.prompt();
		const { outcome } = await promptEvent.userChoice;
		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		}
		setDeferredPrompt(null);
	};

	const { data: user } = useSuspenseQuery({
		queryKey: ["session"],
		queryFn: () => getCurrentUser(),
	});

	const logoutMutation = useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			queryClient.setQueryData(["session"], null);
			router.invalidate();
			toast.success("Berhasil keluar");
		},
	});

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	React.useEffect(() => {
		getPushSubscriptionState().then((state) => {
			setIsPushEnabled(state.subscribed);
		});
	}, []);

	const handleTogglePush = async () => {
		setIsPushPending(true);
		try {
			if (isPushEnabled) {
				await unregisterPush();
				setIsPushEnabled(false);
				toast.success("Push notifikasi dimatikan");
			} else {
				await registerPush();
				setIsPushEnabled(true);
				toast.success("Push notifikasi diaktifkan");
			}
		} catch (error: unknown) {
			console.error(error);
			toast.error((error as Error).message || "Gagal mengubah push notifikasi");
		} finally {
			setIsPushPending(false);
		}
	};

	return (
		<div className="flex h-screen overflow-hidden bg-surface-50 font-sans text-surface-950">
			{/* Sidebar - desktop only */}
			<div className="z-30 hidden lg:block">
				<Sidebar />
			</div>

			{/* Main content area */}
			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				{/* Top Navbar */}
				<header className="relative z-10 flex h-16 w-full shrink-0 items-center justify-between border-white/40 border-b bg-white/70 px-4 shadow-sm backdrop-blur-md lg:px-8">
					<div className="flex items-center">
						{/* Mobile Navbar Branding */}
						<div className="flex items-center gap-2 font-bold text-lg text-primary-600 tracking-tight lg:hidden">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
								<Package size={18} />
							</div>
							E-Inventaris
						</div>
						<h1 className="hidden font-semibold text-surface-900 text-xl lg:block">
							{/* Dynamic title could go here based on route */}
						</h1>
					</div>

					<div className="hidden max-w-2xl flex-1 justify-center px-4 md:flex">
						{/* Search bar removed */}
					</div>

					<div className="flex items-center gap-4">
						<NotificationBell />

						<div className="relative ml-2 border-surface-200 border-l pl-4">
							<button
								onClick={() => setProfileOpen(!profileOpen)}
								className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-surface-50 focus:outline-none"
								aria-expanded={profileOpen}
								aria-haspopup="true"
							>
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 text-sm uppercase">
									{getInitials(user?.name || "??")}
								</div>
								<div className="hidden text-left text-sm md:block">
									<p className="font-medium text-surface-900">{user?.name}</p>
									<p className="text-surface-500 text-xs">
										{ROLE_DEPARTMENTS[user?.role as UserRole] || user?.role}
									</p>
								</div>
								<ChevronDown
									size={16}
									className={`hidden text-surface-500 transition-transform sm:block ${profileOpen ? "rotate-180" : ""}`}
								/>
							</button>

							{/* Dropdown Menu */}
							{profileOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setProfileOpen(false)}
									/>
									<div className="absolute right-0 z-50 mt-2 w-64 origin-top-right transform rounded-xl border border-surface-200 bg-white py-1.5 shadow-lg transition-all">
										<div className="flex items-center justify-between border-surface-100 border-b px-4 py-1.5 font-bold text-[10px] text-surface-400 tracking-wider">
											<span>PENGATURAN</span>
										</div>
										<div className="flex items-center justify-between border-surface-100 border-b px-4 py-3">
											<div className="flex flex-col pr-2">
												<span className="font-semibold text-surface-700 text-xs">
													Push Notifikasi
												</span>
												<span className="text-[9px] text-surface-400 leading-tight">
													Terima info persetujuan & pengadaan
												</span>
											</div>
											<button
												onClick={handleTogglePush}
												disabled={isPushPending}
												className={cn(
													"relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50",
													isPushEnabled ? "bg-primary-600" : "bg-surface-200",
												)}
												aria-label="Toggle push notification"
											>
												<span
													className={cn(
														"pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
														isPushEnabled ? "translate-x-4" : "translate-x-0",
													)}
												/>
											</button>
										</div>
										{deferredPrompt != null && (
											<button
												onClick={handleInstallClick}
												className="flex w-full items-center gap-3 border-surface-100 border-b px-4 py-2.5 text-left font-medium text-sm text-surface-700 transition-colors hover:bg-surface-50"
											>
												<Download size={16} className="text-primary-600" />
												<span>Instal Aplikasi</span>
											</button>
										)}
										<button
											onClick={() => logoutMutation.mutate({})}
											disabled={logoutMutation.isPending}
											className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-medium text-danger-600 text-sm transition-colors hover:bg-danger-50 disabled:opacity-50"
										>
											<LogOut size={16} />
											{logoutMutation.isPending ? "Keluar..." : "Keluar"}
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</header>

				{/* Page content scrollable area */}
				<main className="flex-1 overflow-y-auto bg-surface-50 p-4 pb-20 lg:p-8 lg:pb-8">
					<div className="page-enter relative mx-auto max-w-7xl">
						{children}
					</div>
				</main>
			</div>

			{/* Mobile Bottom Navigation */}
			<NavbarBottom />
		</div>
	);
}
