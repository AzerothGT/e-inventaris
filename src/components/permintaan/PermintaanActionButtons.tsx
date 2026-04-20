import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAvailableActions, PermintaanStatus, UserRole } from "../../lib/approvals";
import { updatePermintaanStatus } from "../../server/functions/permintaan";
import { getRuanganList } from "../../server/functions/ruangan"; // To list rooms
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

interface PermintaanActionButtonsProps {
  permintaanId: string;
  currentStatus: PermintaanStatus;
  userRole: UserRole;
  onSuccess?: () => void;
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
  const [comment, setComment] = useState("");
  const [pendingAction, setPendingAction] = useState<any>(null);
  
  const [receiveData, setReceiveData] = useState({
    targetRuanganId: "",
    targetLemari: "",
    kondisiDiterima: "baik" as "baik" | "rusak_ringan" | "rusak_berat",
  });

  const availableActions = getAvailableActions(currentStatus, userRole);

  const { data: ruanganList } = useQuery({
    queryKey: ['ruangan'],
    queryFn: () => getRuanganList(),
    enabled: isReceiveDialogOpen, // Only fetch when needed
  });

  const mutation = useMutation({
    mutationFn: updatePermintaanStatus,
    onSuccess: () => {
      toast.success("Status permintaan berhasil diperbarui");
      // Explicitly invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['permintaan'] });
      queryClient.invalidateQueries({ queryKey: ['approvalLogs', permintaanId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      // Forces TanStack Start to refresh the current route's data
      router.invalidate();
      
      setIsReceiveDialogOpen(false);
      setIsRejectDialogOpen(false);
      setComment("");
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
      data: { 
        id: permintaanId, 
        status: pendingAction.to,
        catatan: comment
      } 
    });
  };

  const handleConfirmReceive = () => {
    if (!receiveData.targetRuanganId) {
      toast.error("Pilih ruangan terlebih dahulu");
      return;
    }
    mutation.mutate({ 
      data: { 
        id: permintaanId, 
        status: 'selesai',
        targetRuanganId: receiveData.targetRuanganId,
        targetLemari: receiveData.targetLemari,
        kondisiDiterima: receiveData.kondisiDiterima
      } 
    });
  };

  if (availableActions.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {availableActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant as any}
            size="sm"
            disabled={mutation.isPending}
            onClick={() => handleActionClick(action)}
          >
            {mutation.isPending ? "Loading..." : action.label}
          </Button>
        ))}
      </div>

      <Dialog 
        isOpen={isReceiveDialogOpen} 
        onClose={() => setIsReceiveDialogOpen(false)}
        title="Terima Barang & Masuk Inventory"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-500">
            Silakan tentukan lokasi penyimpanan barang ini untuk didaftarkan ke inventory.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Pilih Ruangan</label>
            <select
              className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white"
              value={receiveData.targetRuanganId}
              onChange={(e) => setReceiveData({ ...receiveData, targetRuanganId: e.target.value })}
            >
              <option value="">-- Pilih Ruangan --</option>
              {ruanganList?.map((r) => (
                <option key={r.id} value={r.id}>{r.nama} ({r.kodeRuangan})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Lemari/Posisi (Opsional)</label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white"
              placeholder="Contoh: Lemari A1"
              value={receiveData.targetLemari}
              onChange={(e) => setReceiveData({ ...receiveData, targetLemari: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Kondisi Barang</label>
            <select
              className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white"
              value={receiveData.kondisiDiterima}
              onChange={(e) => setReceiveData({ ...receiveData, kondisiDiterima: e.target.value as any })}
            >
              <option value="baik">Sangat Baik / Baru</option>
              <option value="rusak_ringan">Rusak Ringan (Lecet/Box Rusak)</option>
              <option value="rusak_berat">Rusak Berat</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsReceiveDialogOpen(false)}>Batal</Button>
            <Button 
              variant="success" 
              onClick={handleConfirmReceive}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Memproses..." : "Konfirmasi & Selesai"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog 
        isOpen={isRejectDialogOpen} 
        onClose={() => setIsRejectDialogOpen(false)}
        title={pendingAction?.label || "Konfirmasi"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Alasan {pendingAction?.label?.toLowerCase() === 'batalkan' ? 'Pembatalan' : 'Penolakan'}
            </label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-600 focus:outline-none resize-none transition-all"
              placeholder="Berikan alasan yang jelas agar pemohon memahami keputusannya..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)}>Kembali</Button>
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
    </>
  );
}
