import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ClipboardList, Tag, Calendar, Package, AlertCircle, MapPin } from "lucide-react"
import { PermintaanStatusBadge } from "./PermintaanStatusBadge"
import { PermintaanStatus } from "../../lib/approvals"

interface PermintaanDetailProps {
  data: any
}

interface DetailItem {
  label: string;
  value: React.ReactNode;
  isCustom?: boolean;
}

interface DetailSection {
  label: string;
  icon: React.ReactNode;
  items: DetailItem[];
}

export function PermintaanDetail({ data }: PermintaanDetailProps) {
  if (!data) return null;

  const sections: DetailSection[] = [
    {
      label: "Informasi Barang",
      icon: <Package className="h-4 w-4" />,
      items: [
        { label: "Nama Barang", value: data.namaBarang },
        { label: "Merek / Tipe", value: data.merek || "-" },
        { label: "Kategori", value: data.kategori || "-" },
        { label: "Jumlah", value: `${data.jumlah} Unit` },
      ]
    },
    {
      label: "Status & Prioritas",
      icon: <AlertCircle className="h-4 w-4" />,
      items: [
        { label: "Prioritas", value: <span className="capitalize">{data.prioritas}</span>, isCustom: true },
        { label: "Status Saat Ini", value: <PermintaanStatusBadge status={data.status as PermintaanStatus} />, isCustom: true },
      ]
    },
    {
      label: "Pengajuan",
      icon: <Calendar className="h-4 w-4" />,
      items: [
        { label: "Tanggal Pengajuan", value: data.createdAt ? format(new Date(data.createdAt), "dd MMMM yyyy HH:mm", { locale: id }) : "-" },
        { label: "Oleh", value: data.requesterName || "-" },
      ]
    }
  ];

  if (data.status === 'selesai' && data.targetRuanganId) {
    sections.push({
      label: "Informasi Penerimaan",
      icon: <MapPin className="h-4 w-4" />,
      items: [
        { label: "Ruangan", value: data.namaRuangan || "-" },
        { label: "Lemari / Posisi", value: data.targetLemari || "-" },
        { label: "Kondisi Diterima", value: <span className="capitalize">{data.kondisiDiterima?.replace('_', ' ') || "-"}</span>, isCustom: true },
      ]
    });
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex items-center gap-3 p-4 bg-primary-50/50 rounded-xl border border-primary-100">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
          <Tag className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-surface-900 leading-none mb-1">Nama Pengajuan</h4>
          <p className="text-lg font-bold text-primary-700">{data.namaBarang}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-surface-400 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList className="h-3 w-3" />
            Alasan Pengadaan
          </h5>
          <div className="p-4 bg-surface-50 rounded-xl border border-surface-100 italic text-surface-700 text-sm leading-relaxed">
            "{data.deskripsi}"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h5 className="text-xs font-bold text-surface-400 uppercase tracking-widest flex items-center gap-2">
                {section.icon}
                {section.label}
              </h5>
              <div className="space-y-3 bg-white rounded-xl border border-surface-100 p-4 shadow-sm">
                {section.items.map((item, idy) => (
                  <div key={idy} className="flex justify-between items-start gap-4 text-sm">
                    <span className="text-surface-500 font-medium whitespace-nowrap">{item.label}</span>
                    <span className="text-surface-900 font-semibold text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
