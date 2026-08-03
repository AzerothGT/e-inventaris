import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { IconBox } from "../ui/IconBox";

interface DashboardEmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel: string;
	actionTo: string;
	variant?: "primary" | "success" | "warning" | "surface";
}

export function DashboardEmptyState({
	icon,
	title,
	description,
	actionLabel,
	actionTo,
	variant = "primary",
}: DashboardEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
			<IconBox icon={icon} variant={variant} size={20} className="h-10 w-10" />
			<div className="space-y-1">
				<p className="font-semibold text-sm text-surface-800">{title}</p>
				<p className="mx-auto max-w-60 text-surface-500 text-xs leading-relaxed">
					{description}
				</p>
			</div>
			<Link
				to={actionTo}
				className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 font-semibold text-white text-xs shadow-sm transition-colors hover:bg-primary-700"
			>
				{actionLabel}
			</Link>
		</div>
	);
}
