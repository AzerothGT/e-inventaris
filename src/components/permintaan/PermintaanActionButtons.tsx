import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAvailableActions, PermintaanStatus, UserRole } from "../../lib/approvals";
import { updatePengadaanStatus, getPengadaanItems } from "../../server/functions/permintaan";
import { getRuanganList } from "../../server/functions/ruangan";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Check,
  X,
  ShoppingCart,
  PackageCheck,
  Ban,
  Loader2,
  Settings,
} from "lucide-react";

interface PermintaanActionButtonsProps {
  permintaanId: string;
  currentStatus: PermintaanStatus;
  userRole: UserRole;
  onSuccess?: () => void;
}

interface ItemReceiveData {
  itemId: string;
  namaBarang: string;
  jumlah: number;
  targetRuanganId: string;
  targetLemari: string;
  kondisiDiterima: "baik" | "rusak_ringan" | "rusak_berat";
}

export function PermintaanActionButtons({
  permintaanId,
  currentStatus,
  userRole,
  onSuccess,
}: PermintaanActionButtonsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [targetStatus, setTargetStatus] = useState("");
  const [overrideComment, setOverrideComment] = useState("");
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [itemReceiveData, setItemReceiveData] = useState<ItemReceiveData[]>([]);

  const availableActions = getAvailableActions(currentStatus, userRole);

  const rollbackStatuses = [
    { value: "menunggu_kaprog", label: "Menunggu Kaprog" },
    { value: "menunggu_wakasek", label: "Disetujui Kaprog (Menunggu Wakasek)" },
    { value: "menunggu_kepsek", label: "Disetujui Wakasek (Menunggu Kepsek)" },
    { value: "disetujui", label: "Disetujui Kepsek" },
    { value: "proses_pembelian", label: "Proses Pembelian" },
    { value: "ditolak", label: "Ditolak" },
  ].filter((s) => s.value !== currentStatus);

  const getActionIcon = (id: string) => {
    if (id.startsWith("approve_")) return <Check className="h-4 w-4" />;
    if (id.startsWith("reject_")) return <X className="h-4 w-4" />;
    if (id === "start_purchase") return <ShoppingCart className="h-4 w-4" />;
    if (id === "complete_purchase") return <PackageCheck className="h-4 w-4" />;
    if (id === "cancel_request") return <Ban className="h-4 w-4" />;
    return null;
  };

  const { data: ruanganList } = useQuery({
    queryKey: ["ruangan"],
    queryFn: () => getRuanganList(),
    enabled: isReceiveDialogOpen,
  });

  const { data: eventItems } = useQuery({
    queryKey: ["pengadaanItems", permintaanId],
    queryFn: () => getPengadaanItems({ data: permintaanId }),
    enabled: isReceiveDialogOpen,
  });

  // Initialise per-item receive data when items load
  const initItemReceiveData = (items: any[]) => {
    setItemReceiveData(
      items.map((item) => ({
        itemId: item.id,
        namaBarang: item.namaBarang,
        jumlah: item.jumlah,
        targetRuanganId: "",
        targetLemari: "",
        kondisiDiterima: "baik",
      }))
    );
  };

  const mutation = useMutation({
    mutationFn: updatePengadaanStatus,
    onSuccess: () => {
      toast.success("Status permintaan berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["permintaan"] });
      queryClient.invalidateQueries({ queryKey: ["approvalLogs", permintaanId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.invalidate();
      setIsReceiveDialogOpen(false);
      setIsRejectDialogOpen(false);
      setIsAdminDialogOpen(false);
      setComment("");
      setOverrideComment("");
      setTargetStatus("");
      setPendingAction(null);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal memperbarui status");
    },
  });

  const handleActionClick = (action: any) => {
    setPendingAction(action);
    if (action.requiresData) {
      setIsReceiveDialogOpen(true);
      // Pre-init with existing items if already loaded
      if (eventItems) initItemReceiveData(eventItems);
    } else if (action.requiresReason) {
      setIsRejectDialogOpen(true);
    } else {
      mutation.mutate({ data: { id: permintaanId, status: action.to } });
    }
  };

  const handleConfirmReject = () => {
    if (!comment.trim()) {
      toast.error("Silakan berikan alasan");
      return;
    }
    mutation.mutate({
      data: { id: permintaanId, status: pendingAction.to, catatan: comment },
    });
  };

  const handleConfirmOverride = () => {
    if (!targetStatus) {
      toast.error("Silakan pilih status baru");
      return;
    }
    if (!overrideComment.trim()) {
      toast.error("Silakan berikan alasan");
      return;
    }
    mutation.mutate({
      data: {
        id: permintaanId,
        status: targetStatus as PermintaanStatus,
        catatan: overrideComment,
      },
    });
  };

  const handleConfirmReceive = () => {
    const missing = itemReceiveData.find((d) => !d.targetRuanganId);
    if (missing) {
      toast.error(`Pilih ruangan untuk barang: ${missing.namaBarang}`);
      return;
    }
    mutation.mutate({
      data: {
        id: permintaanId,
        status: "selesai",
        itemUpdates: itemReceiveData.map((d) => ({
          itemId: d.itemId,
          targetRuanganId: d.targetRuanganId,
          targetLemari: d.targetLemari,
          kondisiDiterima: d.kondisiDiterima,
        })),
      },
    });
  };

  const updateItemField = (
    itemId: string,
    field: keyof ItemReceiveData,
    value: string
  ) => {
    setItemReceiveData((prev) =>
      prev.map((d) => (d.itemId === itemId ? { ...d, [field]: value } : d))
    );
  };

  // When receive dialog opens and items arrive, init data
  if (isReceiveDialogOpen && eventItems && itemReceiveData.length === 0) {
    initItemReceiveData(eventItems);
  }

  if (availableActions.length === 0 && userRole !== "admin") return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {availableActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant as any}
            size="icon"
            title={action.label}
            disabled={mutation.isPending}
            onClick={() => handleActionClick(action)}
            className="h-9 w-9"
          >
            {mutation.isPending && pendingAction?.id === action.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              getActionIcon(action.id)
            )}
          </Button>
        ))}

        {userRole === "admin" && (
          <Button
            variant="secondary"
            size="icon"
            title="Edit Status (Admin Override)"
            disabled={mutation.isPending}
            onClick={() => {
              setTargetStatus("");
              setOverrideComment("");
              setIsAdminDialogOpen(true);
            }}
            className="h-9 w-9"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Receive Dialog — per item */}
      <Dialog
        isOpen={isReceiveDialogOpen}
        onClose={() => setIsReceiveDialogOpen(false)}
        title="Terima Barang & Masuk Inventory"
        size="lg"
      >
        <div className="space-y-5">
          <p className="text-sm text-surface-500">
            Tentukan lokasi penyimpanan dan kondisi untuk setiap barang yang diterima.
          </p>

          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
            {itemReceiveData.map((itemData, idx) => (
              <div
                key={itemData.itemId}
                className="p-4 rounded-xl border border-surface-200 bg-white/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-surface-900 text-sm">
                      {itemData.namaBarang}
                    </p>
                    <p className="text-xs text-surface-400">
                      {itemData.jumlah} unit
                    </p>
                  </div>
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">
                    #{idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-600">
                      Ruangan *
                    </label>
                    <select
                      className="w-full h-9 px-3 rounded-lg border border-surface-200 bg-white text-sm"
                      value={itemData.targetRuanganId}
                      onChange={(e) =>
                        updateItemField(itemData.itemId, "targetRuanganId", e.target.value)
                      }
                    >
                      <option value="">-- Pilih --</option>
                      {ruanganList?.map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.nama} ({r.kodeRuangan})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-600">
                      Lemari/Posisi
                    </label>
                    <input
                      type="text"
                      className="w-full h-9 px-3 rounded-lg border border-surface-200 bg-white text-sm"
                      placeholder="Contoh: Lemari A1"
                      value={itemData.targetLemari}
                      onChange={(e) =>
                        updateItemField(itemData.itemId, "targetLemari", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-600">
                      Kondisi
                    </label>
                    <select
                      className="w-full h-9 px-3 rounded-lg border border-surface-200 bg-white text-sm"
                      value={itemData.kondisiDiterima}
                      onChange={(e) =>
                        updateItemField(
                          itemData.itemId,
                          "kondisiDiterima",
                          e.target.value
                        )
                      }
                    >
                      <option value="baik">Baik / Baru</option>
                      <option value="rusak_ringan">Rusak Ringan</option>
                      <option value="rusak_berat">Rusak Berat</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {itemReceiveData.length === 0 && (
              <div className="py-8 text-center text-surface-400 text-sm">
                Memuat daftar barang...
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsReceiveDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="success"
              onClick={handleConfirmReceive}
              disabled={mutation.isPending || itemReceiveData.length === 0}
            >
              {mutation.isPending ? "Memproses..." : "Konfirmasi & Selesai"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Reject / Cancel Dialog */}
      <Dialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        title={pendingAction?.label || "Konfirmasi"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Alasan{" "}
              {pendingAction?.label?.toLowerCase() === "batalkan"
                ? "Pembatalan"
                : "Penolakan"}
            </label>
            <textarea
              className="w-full mt-5 min-h-[100px] p-3 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-600 focus:outline-none resize-none transition-all"
              placeholder="Berikan alasan yang jelas agar pemohon memahami keputusannya..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Kembali
            </Button>
            <Button
              variant={pendingAction?.variant || "destructive"}
              onClick={handleConfirmReject}
              disabled={mutation.isPending || !comment.trim()}
            >
              {mutation.isPending ? "Memproses..." : "Konfirmasi"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Admin Override Dialog */}
      <Dialog
        isOpen={isAdminDialogOpen}
        onClose={() => setIsAdminDialogOpen(false)}
        title="Override Status Pengajuan (Admin)"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-surface-700">
              Pilih Status Baru *
            </label>
            <select
              className="w-full h-9 px-3 rounded-lg border border-surface-200 bg-white text-sm"
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
            >
              <option value="">-- Pilih Status --</option>
              {rollbackStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-surface-700">
              Alasan / Catatan Override *
            </label>
            <textarea
              className="w-full mt-5 min-h-[100px] p-3 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-600 focus:outline-none resize-none transition-all"
              placeholder="Berikan alasan mengapa status di-override..."
              value={overrideComment}
              onChange={(e) => setOverrideComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsAdminDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmOverride}
              disabled={mutation.isPending || !targetStatus || !overrideComment.trim()}
            >
              {mutation.isPending ? "Memproses..." : "Override Status"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
