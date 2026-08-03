import type * as React from "react";
import { cn } from "../../lib/utils";

interface PageHeaderProps {
	title: string;
	gradientTitle?: string;
	suffix?: string;
	actions?: React.ReactNode;
	animated?: boolean;
	className?: string;
}

export function PageHeader({
	title,
	gradientTitle,
	suffix,
	actions,
	animated = true,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center",
				animated && "stagger-1",
				className,
			)}
		>
			<div className="flex flex-col gap-1">
				<h1 className="font-extrabold text-3xl text-surface-900 tracking-tight">
					{title}
					{gradientTitle && (
						<>
							{" "}
							<span className="text-gradient">{gradientTitle}</span>
						</>
					)}
					{suffix && <>{suffix}</>}
				</h1>
			</div>
			{actions && <div className="flex items-center gap-3">{actions}</div>}
		</div>
	);
}
