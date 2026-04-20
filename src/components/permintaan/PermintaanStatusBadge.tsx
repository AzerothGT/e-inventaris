import { PermintaanStatus, STATUS_METADATA } from "../../lib/approvals";

interface PermintaanStatusBadgeProps {
  status: PermintaanStatus;
}

export function PermintaanStatusBadge({ status }: PermintaanStatusBadgeProps) {
  const metadata = STATUS_METADATA[status];
  
  if (!metadata) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 border border-gray-500/20">
        Unknown
      </span>
    );
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${metadata.color}`}>
      {metadata.label}
    </span>
  );
}
