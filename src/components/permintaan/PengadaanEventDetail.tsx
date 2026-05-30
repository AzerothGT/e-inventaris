import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Tag,
  AlertCircle,
  Package,
  MapPin,
} from "lucide-react";
import { PermintaanStatusBadge } from "./PermintaanStatusBadge";
import { PermintaanStatus, ROLE_DEPARTMENTS, UserRole } from "../../lib/approvals";

interface PengadaanEventDetailProps {
  data: any;
}

export function PengadaanEventDetail({ data }: PengadaanEventDetailProps) {
  if (!data) return null;

  const requesterDept = data.requesterRole
    ? ROLE_DEPARTMENTS[data.requesterRole as UserRole]
    : null;
  const olehValue = data.requesterName
    ? `${data.requesterName}${requesterDept ? ` (${requesterDept})` : ""}`
    : "-";

  const prioritasColor =
    data.prioritas === "tinggi"
      ? "text-danger-600"
      : data.prioritas === "sedang"
      ? "text-warning-600"
      : "text-success-600";

  return (
    <div className="space-y-6">
      {/* Event Title Banner */}
      <div className="flex items-center gap-3 p-4 bg-primary-50/50 rounded-xl border border-primary-100">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
          <Tag className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-widest">
              Nama Event
            </h4>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-primary-200 text-primary-700 font-bold">
              {data.kodePengadaan || "-"}
            </span>
          </div>
          <p className="text-lg font-bold text-primary-700">{data.namaEvent}</p>
        </div>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-surface-100 p-4 shadow-sm space-y-1">
          <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">
            Prioritas
          </p>
          <p className={`font-semibold capitalize ${prioritasColor}`}>
            {data.prioritas}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-surface-100 p-4 shadow-sm space-y-1">
          <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">
            Status
          </p>
          <PermintaanStatusBadge status={data.status as PermintaanStatus} />
        </div>
        <div className="bg-white rounded-xl border border-surface-100 p-4 shadow-sm space-y-1">
          <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">
            Diajukan
          </p>
          <p className="text-sm font-semibold text-surface-900 leading-snug">
            {olehValue}
          </p>
          <p className="text-xs text-surface-400">
            {data.createdAt
              ? format(new Date(data.createdAt), "dd MMM yyyy HH:mm", {
                  locale: id,
                })
              : "-"}
          </p>
        </div>
      </div>

      {/* Deskripsi */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold text-surface-400 uppercase tracking-widest flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          Deskripsi / Alasan Pengadaan
        </h5>
        <div className="p-4 bg-surface-50 rounded-xl border border-surface-100 italic text-surface-700 text-sm leading-relaxed">
          "{data.deskripsi}"
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-surface-400 uppercase tracking-widest flex items-center gap-2">
          <Package className="h-3 w-3" />
          Daftar Barang ({data.items?.length ?? 0} item)
        </h5>

        <div className="overflow-hidden rounded-xl border border-surface-200">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Merek
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                  Jumlah
                </th>
                {data.status === "selesai" && (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                      Ruangan
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">
                      Kondisi
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {(data.items ?? []).map((item: any, i: number) => (
                <tr key={item.id ?? i} className="hover:bg-surface-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-surface-900">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="w-10 h-10 rounded-lg border border-surface-200 overflow-hidden bg-surface-50 shrink-0 shadow-sm">
                          <img src={item.imageUrl} alt={item.namaBarang} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {!item.imageUrl && (
                        <div className="w-10 h-10 rounded-lg border border-surface-200 bg-surface-100 flex items-center justify-center shrink-0">
                          <Package className="h-4 w-4 text-surface-400" />
                        </div>
                      )}
                      <span>{item.namaBarang}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500">
                    {item.merek || "-"}
                  </td>
                  <td className="px-4 py-3 text-surface-500">
                    {item.kategori || "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-surface-900">
                    {item.jumlah} {item.satuan || "unit"}
                  </td>
                  {data.status === "selesai" && (
                    <>
                      <td className="px-4 py-3 text-surface-700 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-surface-400" />
                          {item.targetRuanganId
                            ? item.namaRuangan || item.targetRuanganId
                            : "-"}
                          {item.targetLemari
                            ? ` / ${item.targetLemari}`
                            : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-xs font-medium text-surface-600">
                          {item.kondisiDiterima?.replace("_", " ") || "-"}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
