import { type PermintaanStatus, STATUS_METADATA } from "../../lib/approvals";

interface PermintaanStatusBadgeProps {
	status: PermintaanStatus;
}

export function PermintaanStatusBadge({ status }: PermintaanStatusBadgeProps) {
	const metadata = STATUS_METADATA[status];

	if (!metadata) {
		return (
			<span className="inline-flex items-center whitespace-nowrap rounded-full border border-gray-500/20 bg-gray-500/10 px-2 py-1 font-semibold text-gray-500 text-xs">
				Unknown
			</span>
		);
	}

	return (
		<span
			className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-1 font-semibold text-xs ${metadata.color}`}
		>
			{metadata.label}
		</span>
	);
}
