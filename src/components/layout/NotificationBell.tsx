import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Bell, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import {
	getNotifications,
	getUnreadNotificationCount,
	markAsRead,
} from "../../server/functions/notifications";

export function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	// Poll for unread count
	const { data: unreadCount = 0 } = useQuery({
		queryKey: ["notifications", "unreadCount"],
		queryFn: () => getUnreadNotificationCount(),
		refetchInterval: 30000, // Every 30 seconds
	});

	const { data: list, isLoading } = useQuery({
		queryKey: ["notifications", "list"],
		queryFn: () => getNotifications(),
		enabled: isOpen, // Only fetch list when open
	});

	const mutation = useMutation({
		mutationFn: markAsRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	// Close dropdown on click outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Update App Icon Badge Count (PWA App Badging API)
	useEffect(() => {
		if (typeof navigator !== "undefined" && "setAppBadge" in navigator) {
			if (unreadCount > 0) {
				navigator.setAppBadge(unreadCount).catch((err) => {
					console.error("Failed to set app badge:", err);
				});
			} else {
				navigator.clearAppBadge().catch((err) => {
					console.error("Failed to clear app badge:", err);
				});
			}
		}
	}, [unreadCount]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative cursor-pointer rounded-lg p-2 text-surface-500 outline-none ring-offset-2 transition-colors hover:bg-surface-100 hover:text-surface-900 focus:ring-2 focus:ring-primary-500"
			>
				<Bell size={20} />
				{unreadCount > 0 && (
					<span className="fade-in zoom-in absolute top-1.5 right-1.5 flex h-4 w-4 animate-in items-center justify-center rounded-full bg-danger-500 font-bold text-[10px] text-white ring-2 ring-white">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="slide-in-from-top-2 absolute right-0 z-50 mt-3 w-80 animate-in overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-2xl backdrop-blur-xl duration-300 sm:w-96">
					<div className="flex items-center justify-between border-surface-100 border-b bg-white/50 p-4">
						<h3 className="font-bold text-surface-900">Notifikasi</h3>
						<div className="flex items-center gap-2">
							{unreadCount > 0 && (
								<button
									onClick={() => mutation.mutate({ data: {} })}
									className="flex cursor-pointer items-center gap-1 font-medium text-primary-600 text-xs hover:text-primary-700"
								>
									<Check size={14} /> Tandai semua dibaca
								</button>
							)}
							<button
								onClick={() => setIsOpen(false)}
								className="cursor-pointer text-surface-400 hover:text-surface-600 lg:hidden"
							>
								<X size={18} />
							</button>
						</div>
					</div>

					<div className="max-h-[400px] overflow-y-auto py-2">
						{isLoading ? (
							<div className="p-8 text-center text-surface-400">Memuat...</div>
						) : list?.length === 0 ? (
							<div className="p-8 text-center text-surface-400">
								Tidak ada notifikasi
							</div>
						) : (
							list?.map((notif) => (
								<div
									key={notif.id}
									className={cn(
										"group relative flex cursor-pointer flex-col gap-1 px-4 py-3 transition-colors hover:bg-white/60",
										!notif.dibaca &&
											"bg-primary-50/30 after:absolute after:top-0 after:bottom-0 after:left-0 after:w-1 after:bg-primary-500",
									)}
									onClick={() =>
										!notif.dibaca && mutation.mutate({ data: { id: notif.id } })
									}
								>
									<div className="flex items-center justify-between gap-2">
										<span className="font-bold text-primary-600 text-xs uppercase tracking-tighter">
											{notif.tipe}
										</span>
										<span className="font-medium text-[10px] text-surface-400">
											{formatDistanceToNow(new Date(notif.createdAt), {
												addSuffix: true,
												locale: id,
											})}
										</span>
									</div>
									<p
										className={cn(
											"text-sm transition-colors",
											notif.dibaca
												? "text-surface-500"
												: "font-medium text-surface-900",
										)}
									>
										{notif.pesan}
									</p>
								</div>
							))
						)}
					</div>

					<div className="border-surface-100 border-t bg-surface-50/50 p-3 text-center">
						<button className="cursor-pointer font-semibold text-surface-500 text-xs transition-colors hover:text-primary-600">
							Lihat Semua Notifikasi
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
